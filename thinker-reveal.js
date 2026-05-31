/**
 * 入口页 Thinker：白膜 + 光标柔光显色（think-wh → thinker-co）
 */
(function (global) {
  const CORE_STOP = 0.22;
  const MID_STOP = 0.52;
  const SOFT_STOP = 0.88;
  const TRAIL_MIN_DIST = 2.2;
  const WHITE_EDGE_PX = 1;
  const SPECULAR_MAP_MAX = 520;
  const SPECULAR_NORMAL_DEPTH = 6.8;
  const SPECULAR_SHININESS = 68;
  const SPECULAR_STRENGTH = 0.86;
  const SPECULAR_LIGHT_DEPTH = 0.82;

  const RELIEF_VERTEX_SHADER = `
attribute vec2 a_position;
attribute vec2 a_uv;

varying vec2 v_uv;

void main() {
  v_uv = a_uv;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

  const RELIEF_FRAGMENT_SHADER = `
precision mediump float;

uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform vec2 u_light;
uniform float u_depth;
uniform float u_specularPower;
uniform vec3 u_metalColor;

varying vec2 v_uv;

float getHeight(vec2 uv) {
  vec4 color = texture2D(u_image, clamp(uv, vec2(0.0), vec2(1.0)));
  float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  float alpha = color.a;
  return alpha * (0.28 + luminance * 0.72);
}

void main() {
  vec2 texel = 1.0 / u_resolution;

  float hL = getHeight(v_uv + vec2(-texel.x, 0.0));
  float hR = getHeight(v_uv + vec2(texel.x, 0.0));
  float hT = getHeight(v_uv + vec2(0.0, -texel.y));
  float hB = getHeight(v_uv + vec2(0.0, texel.y));
  float hC = getHeight(v_uv);

  float dx = hR - hL;
  float dy = hB - hT;

  vec3 normal = normalize(vec3(
    -dx * u_depth,
    -dy * u_depth,
    1.0
  ));

  vec2 lightVector = (u_light - v_uv) * vec2(1.85, 1.65);
  vec3 lightDir = normalize(vec3(lightVector, ${SPECULAR_LIGHT_DEPTH.toFixed(2)}));
  vec3 broadLight = normalize(vec3(normalize(u_light * 2.0 - 1.0) * vec2(0.7, 0.58), 0.9));

  float diffuse = max(dot(normal, lightDir), 0.0);
  float broadDiffuse = max(dot(normal, broadLight), 0.0);

  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 reflectDir = reflect(-lightDir, normal);
  float specular = pow(max(dot(viewDir, reflectDir), 0.0), u_specularPower);
  float microSpecular = pow(max(dot(viewDir, reflectDir), 0.0), u_specularPower * 1.45);
  float curvature = min(1.0, abs(hL + hR + hT + hB - hC * 4.0) * 7.5);
  float fresnel = pow(max(0.0, 1.0 - normal.z), 2.15);

  vec4 base = texture2D(u_image, v_uv);
  float glow = specular * ${SPECULAR_STRENGTH.toFixed(2)}
    + microSpecular * (0.42 + curvature * 0.9)
    + diffuse * 0.12
    + broadDiffuse * 0.08
    + fresnel * (0.16 + curvature * 0.22);

  vec3 finalColor = u_metalColor * (0.35 + diffuse * 0.36)
    + specular * vec3(1.0);

  gl_FragColor = vec4(finalColor, base.a * clamp(glow, 0.0, 1.0));
}
`;

  function holeRadiusPx(cssW) {
    return Math.max(42, Math.min(cssW * 0.28, 150));
  }

  function initThinkerReveal(viewer) {
    if (!viewer || viewer.dataset.thinkerReady === "1") return;

    const canvas = viewer.querySelector(".thinker-veil");
    const colorImg = viewer.querySelector(".entrance-thinker__color");
    const whiteSrc = viewer.dataset.whiteSrc || "images/think-wh.png";
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const highlightCanvas = document.createElement("canvas");
    const highlightCtx = highlightCanvas.getContext("2d", { alpha: true });
    const webglCanvas = document.createElement("canvas");
    const lightCanvas = document.createElement("canvas");
    const lightCtx = lightCanvas.getContext("2d", { alpha: true });
    const reliefCanvas = document.createElement("canvas");
    const reliefCtx = reliefCanvas.getContext("2d", {
      alpha: true,
      willReadFrequently: true,
    });
    const whiteImg = new Image();
    whiteImg.src = whiteSrc;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const lightFadeMs = reduceMotion ? 320 : 1100;

    let mouseIn = false;
    let curCX = 0;
    let curCY = 0;
    const trails = [];
    let cssW = 1;
    let cssH = 1;
    let raf = 0;
    let whiteReady = false;
    let reliefMap = null;
    let reliefWebGL = null;

    whiteImg.onload = () => {
      whiteReady = true;
      reliefWebGL = initReliefWebGL(webglCanvas, whiteImg);
      if (!reliefWebGL) reliefMap = buildReliefMap();
      requestPaintLoop();
    };

    function syncCanvasSize() {
      const rect = viewer.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      cssW = Math.max(1, rect.width);
      cssH = Math.max(1, rect.height);
      const bw = Math.round(cssW * dpr);
      const bh = Math.round(cssH * dpr);
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      if (
        highlightCanvas.width !== bw ||
        highlightCanvas.height !== bh
      ) {
        highlightCanvas.width = bw;
        highlightCanvas.height = bh;
      }
      canvas.style.width = cssW + "px";
      canvas.style.height = cssH + "px";
    }

    function clientToCanvas(cx, cy) {
      const rect = viewer.getBoundingClientRect();
      return {
        x: ((cx - rect.left) / rect.width) * cssW,
        y: ((cy - rect.top) / rect.height) * cssH,
      };
    }

    function getContainPaintRectInViewer() {
      if (!colorImg) {
        return { dx: 0, dy: 0, dw: cssW, dh: cssH };
      }
      const nw = colorImg.naturalWidth || cssW;
      const nh = colorImg.naturalHeight || cssH;
      const ir = nw / nh;
      const cr = cssW / cssH;
      let dw;
      let dh;
      let dx;
      let dy;
      if (ir > cr) {
        dw = cssW;
        dh = cssW / ir;
        dx = 0;
        dy = (cssH - dh) * 0.5;
      } else {
        dh = cssH;
        dw = cssH * ir;
        dx = (cssW - dw) * 0.5;
        dy = 0;
      }
      return { dx, dy, dw, dh };
    }

    function drawWhiteVeil() {
      if (!whiteImg.naturalWidth) return;
      const paint = getContainPaintRectInViewer();
      const edge = WHITE_EDGE_PX;
      ctx.drawImage(
        whiteImg,
        paint.dx - edge,
        paint.dy - edge,
        paint.dw + edge * 2,
        paint.dh + edge * 2,
      );
    }

    function punchSoftHole(px, py, radius, strength) {
      if (strength <= 0.001) return;
      const g = ctx.createRadialGradient(px, py, 0, px, py, radius);
      const s = strength;
      g.addColorStop(0, `rgba(0,0,0,${(0.985 * s).toFixed(4)})`);
      g.addColorStop(CORE_STOP, `rgba(0,0,0,${(0.9 * s).toFixed(4)})`);
      g.addColorStop(MID_STOP, `rgba(0,0,0,${(0.48 * s).toFixed(4)})`);
      g.addColorStop(SOFT_STOP, `rgba(0,0,0,${(0.14 * s).toFixed(4)})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function paintSoftMask(targetCtx, px, py, radius, strength) {
      if (strength <= 0.001) return;
      const g = targetCtx.createRadialGradient(px, py, 0, px, py, radius);
      const s = strength;
      g.addColorStop(0, `rgba(255,255,255,${(0.98 * s).toFixed(4)})`);
      g.addColorStop(CORE_STOP, `rgba(255,255,255,${(0.9 * s).toFixed(4)})`);
      g.addColorStop(MID_STOP, `rgba(255,255,255,${(0.5 * s).toFixed(4)})`);
      g.addColorStop(SOFT_STOP, `rgba(255,255,255,${(0.16 * s).toFixed(4)})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      targetCtx.fillStyle = g;
      targetCtx.beginPath();
      targetCtx.arc(px, py, radius, 0, Math.PI * 2);
      targetCtx.fill();
    }

    function normalize3(x, y, z) {
      const len = Math.hypot(x, y, z) || 1;
      return { x: x / len, y: y / len, z: z / len };
    }

    function sampleHeight(map, x, y) {
      const sx = Math.max(0, Math.min(map.width - 1, x));
      const sy = Math.max(0, Math.min(map.height - 1, y));
      return map.heightData[sy * map.width + sx];
    }

    function compileReliefShader(gl, type, source) {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    function createReliefProgram(gl) {
      const vertexShader = compileReliefShader(
        gl,
        gl.VERTEX_SHADER,
        RELIEF_VERTEX_SHADER,
      );
      const fragmentShader = compileReliefShader(
        gl,
        gl.FRAGMENT_SHADER,
        RELIEF_FRAGMENT_SHADER,
      );

      if (!vertexShader || !fragmentShader) return null;

      const program = gl.createProgram();
      if (!program) return null;

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        return null;
      }

      return program;
    }

    function reliefTextureSize(image) {
      const aspect = image.naturalWidth / image.naturalHeight;
      return {
        width:
          aspect >= 1
            ? SPECULAR_MAP_MAX
            : Math.max(1, Math.round(SPECULAR_MAP_MAX * aspect)),
        height:
          aspect >= 1
            ? Math.max(1, Math.round(SPECULAR_MAP_MAX / aspect))
            : SPECULAR_MAP_MAX,
      };
    }

    function initReliefWebGL(targetCanvas, image) {
      if (!targetCanvas || !image.naturalWidth || !image.naturalHeight) {
        return null;
      }

      // WebGL is optional: any failure here returns null and keeps the CPU
      // relief renderer below as the visual fallback.
      const gl =
        targetCanvas.getContext("webgl", {
          alpha: true,
          antialias: false,
          depth: false,
          premultipliedAlpha: false,
          preserveDrawingBuffer: true,
          stencil: false,
        }) ||
        targetCanvas.getContext("experimental-webgl", {
          alpha: true,
          antialias: false,
          depth: false,
          premultipliedAlpha: false,
          preserveDrawingBuffer: true,
          stencil: false,
        });

      if (!gl) return null;

      const program = createReliefProgram(gl);
      if (!program) return null;

      // The shader renders a compact relief texture, then the 2D canvas scales
      // that result into the visible Thinker image rectangle.
      const size = reliefTextureSize(image);
      targetCanvas.width = size.width;
      targetCanvas.height = size.height;
      gl.viewport(0, 0, size.width, size.height);

      const positionBuffer = gl.createBuffer();
      const uvBuffer = gl.createBuffer();
      const texture = gl.createTexture();

      if (!positionBuffer || !uvBuffer || !texture) return null;

      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );

      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]),
        gl.STATIC_DRAW,
      );

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image,
      );

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const state = {
        gl,
        program,
        positionBuffer,
        uvBuffer,
        texture,
        size,
        attributes: {
          position: gl.getAttribLocation(program, "a_position"),
          uv: gl.getAttribLocation(program, "a_uv"),
        },
        uniforms: {
          image: gl.getUniformLocation(program, "u_image"),
          resolution: gl.getUniformLocation(program, "u_resolution"),
          light: gl.getUniformLocation(program, "u_light"),
          depth: gl.getUniformLocation(program, "u_depth"),
          specularPower: gl.getUniformLocation(program, "u_specularPower"),
          metalColor: gl.getUniformLocation(program, "u_metalColor"),
        },
      };

      if (
        state.attributes.position < 0 ||
        state.attributes.uv < 0 ||
        Object.values(state.uniforms).some((location) => location === null)
      ) {
        return null;
      }

      return state;
    }

    function renderReliefWebGL(px, py, radius, paint) {
      if (!reliefWebGL) return false;

      const { gl, program, attributes, uniforms, positionBuffer, uvBuffer } =
        reliefWebGL;
      const lightU = Math.max(0, Math.min(1, (px - paint.dx) / paint.dw));
      const lightV = Math.max(0, Math.min(1, (py - paint.dy) / paint.dh));
      const dpr = highlightCanvas.width / cssW;

      gl.viewport(0, 0, reliefWebGL.size.width, reliefWebGL.size.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(attributes.position);
      gl.vertexAttribPointer(attributes.position, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.enableVertexAttribArray(attributes.uv);
      gl.vertexAttribPointer(attributes.uv, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, reliefWebGL.texture);
      gl.uniform1i(uniforms.image, 0);
      gl.uniform2f(
        uniforms.resolution,
        whiteImg.naturalWidth,
        whiteImg.naturalHeight,
      );
      gl.uniform2f(uniforms.light, lightU, lightV);
      gl.uniform1f(uniforms.depth, SPECULAR_NORMAL_DEPTH);
      gl.uniform1f(uniforms.specularPower, SPECULAR_SHININESS);
      gl.uniform3f(uniforms.metalColor, 246 / 255, 250 / 255, 255 / 255);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // Clip the shader result to the same soft cursor reveal mask used by the
      // original Canvas version, preserving the existing interaction design.
      highlightCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      highlightCtx.globalAlpha = 1;
      highlightCtx.globalCompositeOperation = "source-over";
      highlightCtx.clearRect(0, 0, cssW, cssH);
      highlightCtx.drawImage(
        webglCanvas,
        paint.dx,
        paint.dy,
        paint.dw,
        paint.dh,
      );

      highlightCtx.globalCompositeOperation = "destination-in";
      paintSoftMask(highlightCtx, px, py, radius * 1.14, 0.82);

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.72;
      ctx.drawImage(highlightCanvas, 0, 0, cssW, cssH);
      ctx.restore();

      return true;
    }

    function buildReliefMap() {
      if (!whiteImg.naturalWidth || !whiteImg.naturalHeight || !reliefCtx) {
        return null;
      }

      const aspect = whiteImg.naturalWidth / whiteImg.naturalHeight;
      const width =
        aspect >= 1
          ? SPECULAR_MAP_MAX
          : Math.max(1, Math.round(SPECULAR_MAP_MAX * aspect));
      const height =
        aspect >= 1
          ? Math.max(1, Math.round(SPECULAR_MAP_MAX / aspect))
          : SPECULAR_MAP_MAX;

      reliefCanvas.width = width;
      reliefCanvas.height = height;
      reliefCtx.clearRect(0, 0, width, height);
      reliefCtx.drawImage(whiteImg, 0, 0, width, height);

      const pixels = reliefCtx.getImageData(0, 0, width, height).data;
      const heightData = new Float32Array(width * height);
      const alphaData = new Float32Array(width * height);
      const normalX = new Float32Array(width * height);
      const normalY = new Float32Array(width * height);
      const normalZ = new Float32Array(width * height);
      const curvatureData = new Float32Array(width * height);

      for (let i = 0; i < heightData.length; i += 1) {
        const p = i * 4;
        const alpha = pixels[p + 3] / 255;
        const luminance =
          (pixels[p] * 0.299 + pixels[p + 1] * 0.587 + pixels[p + 2] * 0.114) /
          255;

        alphaData[i] = alpha;
        heightData[i] = alpha * (0.28 + luminance * 0.72);
      }

      const map = {
        width,
        height,
        heightData,
        alphaData,
        normalX,
        normalY,
        normalZ,
        curvatureData,
      };

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const index = y * width + x;
          const hC = heightData[index];
          const hL = sampleHeight(map, x - 1, y);
          const hR = sampleHeight(map, x + 1, y);
          const hT = sampleHeight(map, x, y - 1);
          const hB = sampleHeight(map, x, y + 1);
          const hTL = sampleHeight(map, x - 1, y - 1);
          const hTR = sampleHeight(map, x + 1, y - 1);
          const hBL = sampleHeight(map, x - 1, y + 1);
          const hBR = sampleHeight(map, x + 1, y + 1);
          const dx = (hTR + hR * 2 + hBR - hTL - hL * 2 - hBL) * 0.25;
          const dy = (hBL + hB * 2 + hBR - hTL - hT * 2 - hTR) * 0.25;
          const normal = normalize3(
            -dx * SPECULAR_NORMAL_DEPTH,
            -dy * SPECULAR_NORMAL_DEPTH,
            1,
          );

          normalX[index] = normal.x;
          normalY[index] = normal.y;
          normalZ[index] = normal.z;
          curvatureData[index] = Math.min(
            1,
            Math.abs(hL + hR + hT + hB - hC * 4) * 7.5,
          );
        }
      }

      return map;
    }

    function drawMovingMetalHighlight(px, py, radius) {
      if (!highlightCtx || !lightCtx || !whiteImg.naturalWidth) return;

      const paint = getContainPaintRectInViewer();
      if (renderReliefWebGL(px, py, radius, paint)) return;

      const centerX = paint.dx + paint.dw * 0.5;
      const centerY = paint.dy + paint.dh * 0.5;
      const lightX = Math.max(
        -1,
        Math.min(1, (px - centerX) / (paint.dw * 0.5)),
      );
      const lightY = Math.max(
        -1,
        Math.min(1, (py - centerY) / (paint.dh * 0.5)),
      );
      const map = reliefMap || buildReliefMap();
      if (!map) return;

      const dpr = highlightCanvas.width / cssW;
      const mouseMapX = ((px - paint.dx) / paint.dw) * map.width;
      const mouseMapY = ((py - paint.dy) / paint.dh) * map.height;
      const broadLight = normalize3(lightX * 0.7, lightY * 0.58, 0.9);

      if (lightCanvas.width !== map.width || lightCanvas.height !== map.height) {
        lightCanvas.width = map.width;
        lightCanvas.height = map.height;
      }

      const specular = lightCtx.createImageData(map.width, map.height);
      const data = specular.data;

      for (let y = 0; y < map.height; y += 1) {
        for (let x = 0; x < map.width; x += 1) {
          const index = y * map.width + x;
          const alpha = map.alphaData[index];
          if (alpha <= 0.01) continue;

          const light = normalize3(
            ((mouseMapX - x) / map.width) * 1.85,
            ((mouseMapY - y) / map.height) * 1.65,
            SPECULAR_LIGHT_DEPTH,
          );
          const halfVector = normalize3(light.x, light.y, light.z + 1);
          const normal = {
            x: map.normalX[index],
            y: map.normalY[index],
            z: map.normalZ[index],
          };
          const ndotl = Math.max(
            0,
            normal.x * light.x + normal.y * light.y + normal.z * light.z,
          );
          const ndoth = Math.max(
            0,
            normal.x * halfVector.x +
              normal.y * halfVector.y +
              normal.z * halfVector.z,
          );
          const broadNdotL = Math.max(
            0,
            normal.x * broadLight.x +
              normal.y * broadLight.y +
              normal.z * broadLight.z,
          );
          const edgeFresnel = Math.pow(Math.max(0, 1 - normal.z), 2.15);
          const microGlint = Math.pow(ndoth, SPECULAR_SHININESS * 1.45);
          const surfaceBreak = map.curvatureData[index];
          const glint =
            Math.pow(ndoth, SPECULAR_SHININESS) * SPECULAR_STRENGTH +
            microGlint * (0.42 + surfaceBreak * 0.9) +
            ndotl * 0.12 +
            broadNdotL * 0.08 +
            edgeFresnel * (0.16 + surfaceBreak * 0.22);
          const glow = Math.min(1, glint) * alpha;
          const p = index * 4;

          data[p] = 246;
          data[p + 1] = 250;
          data[p + 2] = 255;
          data[p + 3] = Math.round(glow * 255);
        }
      }

      lightCtx.putImageData(specular, 0, 0);

      highlightCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      highlightCtx.globalAlpha = 1;
      highlightCtx.globalCompositeOperation = "source-over";
      highlightCtx.clearRect(0, 0, cssW, cssH);
      highlightCtx.drawImage(
        lightCanvas,
        paint.dx,
        paint.dy,
        paint.dw,
        paint.dh,
      );

      highlightCtx.globalCompositeOperation = "destination-in";
      paintSoftMask(highlightCtx, px, py, radius * 1.14, 0.82);

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.72;
      ctx.drawImage(highlightCanvas, 0, 0, cssW, cssH);
      ctx.restore();
    }

    function fadeStrength(t0, now) {
      const u = (now - t0) / lightFadeMs;
      if (u >= 1) return 0;
      if (u <= 0) return 1;
      const v = u * u * (3 - 2 * u);
      return 1 - v;
    }

    function frame(now) {
      syncCanvasSize();
      const dpr = canvas.width / cssW;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, cssW, cssH);

      if (whiteReady) drawWhiteVeil();

      const R = holeRadiusPx(cssW);
      ctx.globalCompositeOperation = "destination-out";

      for (let i = trails.length - 1; i >= 0; i--) {
        const tr = trails[i];
        const st = fadeStrength(tr.t0, now);
        if (st <= 0.008) {
          trails.splice(i, 1);
          continue;
        }
        punchSoftHole(tr.cx, tr.cy, R, st);
      }

      if (mouseIn && whiteReady) {
        const m = clientToCanvas(curCX, curCY);
        punchSoftHole(m.x, m.y, R, 1);
        ctx.globalCompositeOperation = "source-over";
        drawMovingMetalHighlight(m.x, m.y, R);
      }

      if (mouseIn || trails.length > 0 || !whiteReady) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
      }
    }

    function requestPaintLoop() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    function isOverViewer(cx, cy) {
      const r = viewer.getBoundingClientRect();
      return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
    }

    function shouldTrackPointer(cx, cy) {
      return isOverViewer(cx, cy);
    }

    function setActiveCursor(active) {
      viewer.classList.toggle("thinker-viewer--active", active);
    }

    function leaveTracking() {
      if (mouseIn && whiteReady) {
        const p = clientToCanvas(curCX, curCY);
        trails.push({ cx: p.x, cy: p.y, t0: performance.now() });
      }
      mouseIn = false;
      setActiveCursor(false);
      requestPaintLoop();
    }

    function onPointerEnter(e) {
      if (!shouldTrackPointer(e.clientX, e.clientY)) return;
      mouseIn = true;
      curCX = e.clientX;
      curCY = e.clientY;
      setActiveCursor(true);
      requestPaintLoop();
    }

    function onPointerMove(e) {
      if (!shouldTrackPointer(e.clientX, e.clientY)) {
        if (mouseIn) leaveTracking();
        else setActiveCursor(false);
        return;
      }

      if (!mouseIn) {
        mouseIn = true;
        curCX = e.clientX;
        curCY = e.clientY;
        setActiveCursor(true);
        requestPaintLoop();
        return;
      }

      setActiveCursor(true);
      const prevX = curCX;
      const prevY = curCY;
      curCX = e.clientX;
      curCY = e.clientY;
      if (whiteReady) {
        const d = Math.hypot(curCX - prevX, curCY - prevY);
        if (d >= TRAIL_MIN_DIST) {
          const p = clientToCanvas(prevX, prevY);
          trails.push({ cx: p.x, cy: p.y, t0: performance.now() });
        }
      }
      requestPaintLoop();
    }

    function onPointerLeave(e) {
      if (mouseIn) leaveTracking();
      else if (e.relatedTarget && viewer.contains(e.relatedTarget)) {
        onPointerMove(e);
      }
    }

    viewer.addEventListener("pointerenter", onPointerEnter);
    viewer.addEventListener("pointermove", onPointerMove);
    viewer.addEventListener("pointerleave", onPointerLeave);
    viewer.addEventListener("pointerdown", (e) => e.stopPropagation());

    const ro = new ResizeObserver(requestPaintLoop);
    ro.observe(viewer);
    if (colorImg) ro.observe(colorImg);

    viewer.dataset.thinkerReady = "1";
    requestPaintLoop();
  }

  function initAllThinkerReveal() {
    document.querySelectorAll(".thinker-viewer").forEach(initThinkerReveal);
  }

  global.initThinkerReveal = initThinkerReveal;
  global.initAllThinkerReveal = initAllThinkerReveal;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllThinkerReveal);
  } else {
    initAllThinkerReveal();
  }
})(window);
