(function () {
  const LANGS = ["en", "ja", "zh-CN", "zh-TW", "fr", "es"];
  const LABELS = {
    en: "English",
    ja: "日本語",
    "zh-CN": "简体",
    "zh-TW": "繁體",
    fr: "Français",
    es: "Español",
  };

  const TEXT = {
    en: {
      navPainting: "Painting",
      navSculpture: "Sculpture",
      navPhotography: "Photography",
      navAbout: "About",
      search: "Search",
      menu: "Open menu",
      progressGallery: "Gallery progress",
      progressSculpture: "Sculpture progress",
      progressPhotography: "Display progress",
      footerPainting: "Gallery Walk · Museum wall experience",
      footerSculpture: "Gallery Walk · Sculpture hall",
      footerPhotography: "Gallery Walk · Photography wall experience",
      readBackground: "Read background",
      backToDetails: "Back to details",
      visitMuseum: "Visit Museum Website",
      hintImage: "Drag to move · Scroll to zoom · Double click to reset",
      hintSculpture: "Drag to rotate · Scroll to zoom · Use Sketchfab controls to explore",
      searchPromptPainting: "Search artworks",
      searchPromptSculpture: "Search sculptures",
      searchPromptPhotography: "Search photographs",
      artist: "Artist",
      year: "Year",
      catalogue: "Catalogue",
      medium: "Medium",
      subject: "Subject",
      dimensions: "Dimensions",
      location: "Location",
      accession: "Accession",
      backgroundLabel: "Background",
      storyInContext: "{title} in context",
      artworkStoryGeneric:
        "{artist} shaped {title} through a specific visual language, historical setting, and set of artistic choices. The work can be read through its material, scale, composition, and museum setting. Rather than treating the image as a quick illustration, the viewer is invited to look slowly at its surface, structure, and the cultural moment behind it. Details such as gesture, light, spatial arrangement, and the relationship between figure and background help reveal why the work still carries meaning across time.",
      sculptureStoryGeneric:
        "{artist} shaped {title} through attention to body, material, balance, and viewing angle. Sculpture is never only a front-facing image: its meaning changes as the viewer moves around it. In this digital preview, the work is presented as a three-dimensional study object so that volume, surface, missing parts, weight, and posture can be considered together. The piece invites slower observation of how form occupies space and how material presence creates emotional force.",
      photographyStoryGeneric:
        "{artist} made {title} within a photographic tradition where timing, framing, light, and print quality all shape meaning. The image is presented here as a museum photographic print rather than a passing screen image, encouraging attention to subject, tonal range, cropping, grain, and historical context. Its power comes not only from what it depicts, but from how the photographer organizes a moment and turns it into an image that can be revisited, questioned, and remembered.",
      aboutIntro: "Gallery Walk is an interactive digital museum website designed around the idea of",
      aboutQuote: "\"Slowing down the act of looking\"",
      aboutP1: "On the web, artworks are often consumed quickly as images, with little time spent on their details, context, or material qualities. This project aims to create a more patient viewing experience by allowing users to engage with artworks through scrolling, clicking, dragging, zooming, and rotating.",
      aboutP2: "Each art form is presented through a different interaction model. Paintings are displayed in a horizontal gallery with classical frames, where the centered artwork gradually becomes clearer as if a museum light has been turned on. Sculptures are shown with pedestals and 3D model previews, allowing users to explore their volume, material, and form from different angles. Photography is presented through the visual language of photographic prints and darkroom development, emphasizing tone, contrast, and the process of revealing an image.",
      aboutP3: "The website also provides detailed artwork information, including artist, year, medium, dimensions, location, subject, and collection data. By combining visual interaction with contextual information, the project encourages users to move beyond passive browsing and spend more time understanding each work.",
      aboutP4: "The goal of Gallery Walk is to transform digital art viewing into a slower, more immersive, and more meaningful experience.",
      aboutThanks: "Thanks for your reading.",
      aboutEyebrow: "About",
      aboutHeroTitle: "Gallery Walk",
      aboutHeroLead:
        "Gallery Walk is an interactive digital museum designed around the idea of slowing down the act of looking.",
      aboutHeroText:
        "Instead of scrolling past images quickly, we invite you to observe, interact, and rediscover each artwork through movement and attention.",
      aboutHeroTagline: "SLOW LOOKING. DEEP SEEING.",
      aboutScrollCta: "Scroll to subscribe",
      subscribeEyebrow: "Subscribe",
      subscribeTitleLine1: "Curated Artworks",
      subscribeTitleLine2: "in Your Inbox",
      subscribeThanks: "Thank you.",
      subscribeThanksLine1: "Thank you.",
      subscribeThanksLine2: "",
      subscribeLead:
        "A quiet selection of artworks, stories, and visual references delivered to you with the pace of a museum visit.",
      subscribeEmailLabel: "EMAIL ADDRESS",
      subscribeButton: "SUBSCRIBE",
      subscribeButtonDone: "SUBSCRIBED",
      subscribeEmailPlaceholder: "you@example.com",
      subscribeErrorEmpty: "Please enter your email.",
      subscribeErrorInvalid: "Please enter a valid email address.",
      subscribeSuccessMessage:
        "Your next artwork recommendation will arrive soon.",
    },
    ja: {
      navPainting: "絵画",
      navSculpture: "彫刻",
      navPhotography: "写真",
      navAbout: "概要",
      search: "検索",
      menu: "メニューを開く",
      progressGallery: "ギャラリー進行",
      progressSculpture: "彫刻展示進行",
      progressPhotography: "表示進行",
      footerPainting: "Gallery Walk · 美術館の壁体験",
      footerSculpture: "Gallery Walk · 彫刻ホール",
      footerPhotography: "Gallery Walk · 写真ウォール体験",
      readBackground: "背景を読む",
      backToDetails: "詳細に戻る",
      visitMuseum: "美術館サイトを見る",
      hintImage: "ドラッグで移動 · スクロールでズーム · ダブルクリックでリセット",
      hintSculpture: "ドラッグで回転 · スクロールでズーム · Sketchfab 操作で探索",
      searchPromptPainting: "作品を検索",
      searchPromptSculpture: "彫刻を検索",
      searchPromptPhotography: "写真作品を検索",
      artist: "作者",
      year: "年",
      catalogue: "カタログ",
      medium: "技法・素材",
      subject: "主題",
      dimensions: "寸法",
      location: "所蔵",
      accession: "収蔵番号",
      backgroundLabel: "背景",
      storyInContext: "{title} の背景",
      artworkStoryGeneric:
        "{artist} は {title} を、独自の視覚言語、歴史的背景、そして意識的な造形上の選択によって形づくりました。この作品は、素材、スケール、構図、美術館での展示環境を通して読むことができます。単なる画像として素早く消費するのではなく、表面、空間の組み立て、光、身振り、背景との関係をゆっくり観察することで、作品がなぜ今も意味を持つのかが見えてきます。",
      sculptureStoryGeneric:
        "{artist} による {title} は、身体、素材、均衡、そして視点の変化を通して理解できる作品です。彫刻は正面から見るだけのイメージではなく、周囲を移動することで意味が変化します。この3Dプレビューでは、量感、表面、欠けた部分、重さ、姿勢を同時に観察できます。作品は、形が空間をどのように占め、素材の存在感がどのように感情を生むのかをゆっくり見るよう促します。",
      photographyStoryGeneric:
        "{artist} による {title} は、タイミング、フレーミング、光、プリントの質が意味を形づくる写真の文脈の中で生まれました。ここでは一瞬で流れる画面上の画像ではなく、美術館の写真プリントとして提示されています。主題、階調、コントラスト、トリミング、粒子感、そして記録または構成された歴史的瞬間を意識することで、写真がどのように記憶され、問い直されるイメージになるのかが見えてきます。",
      aboutIntro: "Gallery Walk は、見る行為をゆっくりにするという考えから生まれたインタラクティブなデジタル美術館です。",
      aboutQuote: "「見る行為をゆっくりにする」",
      aboutP1: "ウェブ上では、作品はしばしば画像として素早く消費され、細部、文脈、素材の質に十分な時間が向けられません。このプロジェクトは、スクロール、クリック、ドラッグ、ズーム、回転を通して、より忍耐強い鑑賞体験をつくることを目指しています。",
      aboutP2: "それぞれの芸術形式には異なる操作モデルがあります。絵画は古典的な額縁のある横スクロールのギャラリーに置かれ、中央の作品は美術館の照明が灯るように徐々に鮮明になります。彫刻は台座と3Dプレビューで示され、量感、素材、形をさまざまな角度から探索できます。写真はプリントと暗室現像の視覚言語を通して、階調、コントラスト、像が現れる過程を強調します。",
      aboutP3: "このサイトは作者、年代、技法、寸法、所蔵、主題、コレクション情報などの詳細も提供します。視覚的な操作と文脈情報を組み合わせることで、受動的な閲覧を超え、作品を理解する時間を増やすことを促します。",
      aboutP4: "Gallery Walk の目標は、デジタルでの美術鑑賞を、より遅く、没入的で、意味のある体験へ変えることです。",
      aboutThanks: "お読みいただきありがとうございます。",
      aboutEyebrow: "概要",
      aboutHeroTitle: "Gallery Walk",
      aboutHeroLead:
        "Gallery Walk は、見る行為をゆっくりにするという考えから生まれたインタラクティブなデジタル美術館です。",
      aboutHeroText:
        "画像を素早く流すのではなく、動きと注意を通して作品を観察し、触れ、再発見していただくことを目指しています。",
      aboutHeroTagline: "ゆっくり見る。深く見る。",
      aboutScrollCta: "下へスクロールして登録",
      subscribeEyebrow: "購読",
      subscribeTitleLine1: "厳選された作品",
      subscribeTitleLine2: "あなたの受信箱へ",
      subscribeThanks: "ありがとうございます。",
      subscribeThanksLine1: "ありがとう",
      subscribeThanksLine2: "ございます。",
      subscribeLead:
        "美術館の訪問のようなペースで、作品・ストーリー・視覚的参考資料をお届けします。",
      subscribeEmailLabel: "メールアドレス",
      subscribeButton: "登録する",
      subscribeButtonDone: "登録済み",
      subscribeEmailPlaceholder: "you@example.com",
      subscribeErrorEmpty: "メールアドレスを入力してください。",
      subscribeErrorInvalid: "有効なメールアドレスを入力してください。",
      subscribeSuccessMessage: "次の作品レコメンドをまもなくお届けします。",
    },
    "zh-CN": {
      navPainting: "绘画",
      navSculpture: "雕塑",
      navPhotography: "摄影",
      navAbout: "关于",
      search: "搜索",
      menu: "打开菜单",
      progressGallery: "展厅进度",
      progressSculpture: "雕塑展厅进度",
      progressPhotography: "展示进度",
      footerPainting: "Gallery Walk · 美术馆墙面体验",
      footerSculpture: "Gallery Walk · 雕塑展厅",
      footerPhotography: "Gallery Walk · 摄影墙面体验",
      readBackground: "阅读背景",
      backToDetails: "返回详情",
      visitMuseum: "访问美术馆官网",
      hintImage: "拖动移动 · 滚轮缩放 · 双击复位",
      hintSculpture: "拖动旋转 · 滚轮缩放 · 使用 Sketchfab 控件探索",
      searchPromptPainting: "搜索作品",
      searchPromptSculpture: "搜索雕塑",
      searchPromptPhotography: "搜索摄影作品",
      artist: "艺术家",
      year: "年份",
      catalogue: "目录号",
      medium: "媒介",
      subject: "主题",
      dimensions: "尺寸",
      location: "地点",
      accession: "馆藏编号",
      backgroundLabel: "背景",
      storyInContext: "{title} 的背景",
      artworkStoryGeneric:
        "{artist} 的《{title}》由特定的视觉语言、历史处境和艺术选择共同塑造。它不仅可以从图像内容理解，也可以从媒介、尺度、构图和美术馆展示语境中阅读。观众不应把它当作一张快速浏览的图片，而可以放慢速度观察画面表面、空间组织、光线、人物姿态以及前景和背景之间的关系。这些细节共同揭示了作品为何能够跨越时间持续产生意义。",
      sculptureStoryGeneric:
        "{artist} 的《{title}》可以通过身体、材质、平衡和观看角度来理解。雕塑从来不只是一个正面的图像，它的意义会随着观众的移动而发生变化。在这里，作品被作为三维研究对象呈现，让观众同时观察体量、表面、缺失部分、重量感和姿态。它邀请我们思考形体如何占据空间，以及材质的存在感如何产生情绪和力量。",
      photographyStoryGeneric:
        "{artist} 的《{title}》来自摄影传统中对于时机、构图、光线和打印质感的控制。它在这里不是作为一张快速滑过的屏幕图片，而是以美术馆摄影打印的方式呈现。观众可以通过主题、影调、对比度、裁切、颗粒感，以及它记录或建构的历史时刻来理解这张图像。摄影的力量不仅在于拍到了什么，也在于摄影师如何组织瞬间，使其成为可以被反复观看、追问和记忆的图像。",
      aboutIntro: "Gallery Walk 是一个互动式数字美术馆网站，围绕“放慢观看”这一想法展开。",
      aboutQuote: "“放慢观看这件事”",
      aboutP1: "在网页上，艺术作品常常被当作图像快速消费，人们很少花时间观察它们的细节、语境或媒介特征。这个项目希望通过滚动、点击、拖拽、缩放和旋转，让用户获得更有耐心的观看体验。",
      aboutP2: "每一种艺术形式都对应不同的交互模型。绘画以横向展厅和古典画框呈现，居中的作品会像被美术馆灯光照亮一样逐渐清晰。雕塑通过展台和3D模型预览展示，让用户从不同角度探索体量、材质和形态。摄影则使用相纸与暗房显影的视觉语言，强调影调、对比度以及图像被揭示的过程。",
      aboutP3: "网站也提供详细的作品信息，包括艺术家、年份、媒介、尺寸、地点、主题和馆藏数据。通过结合视觉交互与语境信息，项目鼓励用户超越被动浏览，花更多时间理解每件作品。",
      aboutP4: "Gallery Walk 的目标是把数字艺术观看转化为一种更缓慢、更沉浸、更有意义的体验。",
      aboutThanks: "感谢你的阅读。",
      aboutEyebrow: "关于",
      aboutHeroTitle: "Gallery Walk",
      aboutHeroLead:
        "Gallery Walk 是一座互动数字美术馆，围绕放慢观看这一理念而设计。",
      aboutHeroText:
        "我们邀请你不要匆匆滑过图像，而是通过移动与专注去观察、互动，并重新发现每一件作品。",
      aboutHeroTagline: "慢看 · 深观",
      aboutScrollCta: "向下滑动订阅",
      subscribeEyebrow: "订阅",
      subscribeTitleLine1: "精选艺术作品",
      subscribeTitleLine2: "送达您的收件箱",
      subscribeThanks: "感谢。",
      subscribeThanksLine1: "感谢。",
      subscribeThanksLine2: "",
      subscribeLead:
        "以博物馆参观的节奏，为您呈现精选作品、故事与视觉参考。",
      subscribeEmailLabel: "电子邮箱",
      subscribeButton: "订阅",
      subscribeButtonDone: "已订阅",
      subscribeEmailPlaceholder: "you@example.com",
      subscribeErrorEmpty: "请输入您的邮箱。",
      subscribeErrorInvalid: "请输入有效的邮箱地址。",
      subscribeSuccessMessage: "您的下一条作品推荐即将送达。",
    },
    "zh-TW": {
      navPainting: "繪畫",
      navSculpture: "雕塑",
      navPhotography: "攝影",
      navAbout: "關於",
      search: "搜尋",
      menu: "開啟選單",
      progressGallery: "展廳進度",
      progressSculpture: "雕塑展廳進度",
      progressPhotography: "展示進度",
      footerPainting: "Gallery Walk · 美術館牆面體驗",
      footerSculpture: "Gallery Walk · 雕塑展廳",
      footerPhotography: "Gallery Walk · 攝影牆面體驗",
      readBackground: "閱讀背景",
      backToDetails: "返回詳情",
      visitMuseum: "造訪美術館官網",
      hintImage: "拖曳移動 · 滾輪縮放 · 雙擊重設",
      hintSculpture: "拖曳旋轉 · 滾輪縮放 · 使用 Sketchfab 控制探索",
      searchPromptPainting: "搜尋作品",
      searchPromptSculpture: "搜尋雕塑",
      searchPromptPhotography: "搜尋攝影作品",
      artist: "藝術家",
      year: "年份",
      catalogue: "目錄號",
      medium: "媒材",
      subject: "主題",
      dimensions: "尺寸",
      location: "地點",
      accession: "館藏編號",
      backgroundLabel: "背景",
      storyInContext: "{title} 的背景",
      artworkStoryGeneric:
        "{artist} 的《{title}》由特定的視覺語言、歷史處境和藝術選擇共同塑造。它不只可以從圖像內容理解，也可以從媒材、尺度、構圖和美術館展示脈絡中閱讀。觀眾不應把它當作一張快速瀏覽的圖片，而可以放慢速度觀察畫面表面、空間組織、光線、人物姿態以及前景和背景之間的關係。這些細節共同揭示了作品為何能跨越時間持續產生意義。",
      sculptureStoryGeneric:
        "{artist} 的《{title}》可以透過身體、材質、平衡和觀看角度來理解。雕塑從來不只是正面的圖像，它的意義會隨著觀眾的移動而發生變化。在這裡，作品被作為三維研究物件呈現，讓觀眾同時觀察量感、表面、缺失部分、重量感和姿態。它邀請我們思考形體如何占據空間，以及材質的存在感如何產生情緒和力量。",
      photographyStoryGeneric:
        "{artist} 的《{title}》來自攝影傳統中對於時機、構圖、光線和輸出質感的控制。它在這裡不是作為一張快速滑過的螢幕圖片，而是以美術館攝影輸出的方式呈現。觀眾可以透過主題、影調、對比度、裁切、顆粒感，以及它記錄或建構的歷史時刻來理解這張圖像。攝影的力量不只在於拍到了什麼，也在於攝影師如何組織瞬間，使其成為可以被反覆觀看、追問和記憶的圖像。",
      aboutIntro: "Gallery Walk 是一個互動式數位美術館網站，圍繞「放慢觀看」這一想法展開。",
      aboutQuote: "「放慢觀看這件事」",
      aboutP1: "在網頁上，藝術作品常常被當作圖像快速消費，人們很少花時間觀察它們的細節、脈絡或媒材特徵。這個專案希望透過滾動、點擊、拖曳、縮放和旋轉，讓使用者獲得更有耐心的觀看體驗。",
      aboutP2: "每一種藝術形式都對應不同的互動模型。繪畫以橫向展廳和古典畫框呈現，置中的作品會像被美術館燈光照亮一樣逐漸清晰。雕塑透過展台和3D模型預覽展示，讓使用者從不同角度探索體量、材質和形態。攝影則使用相紙與暗房顯影的視覺語言，強調影調、對比度以及圖像被揭示的過程。",
      aboutP3: "網站也提供詳細的作品資訊，包括藝術家、年份、媒材、尺寸、地點、主題和館藏資料。透過結合視覺互動與脈絡資訊，專案鼓勵使用者超越被動瀏覽，花更多時間理解每件作品。",
      aboutP4: "Gallery Walk 的目標是把數位藝術觀看轉化為一種更緩慢、更沉浸、更有意義的體驗。",
      aboutThanks: "感謝你的閱讀。",
      aboutEyebrow: "關於",
      aboutHeroTitle: "Gallery Walk",
      aboutHeroLead:
        "Gallery Walk 是一座互動式數位美術館，圍繞放慢觀看這一理念而設計。",
      aboutHeroText:
        "我們邀請你不要匆匆滑過圖像，而是透過移動與專注去觀察、互動，並重新發現每一件作品。",
      aboutHeroTagline: "慢看 · 深觀",
      aboutScrollCta: "向下滑動訂閱",
      subscribeEyebrow: "訂閱",
      subscribeTitleLine1: "精選藝術作品",
      subscribeTitleLine2: "送達您的收件匣",
      subscribeThanks: "感謝。",
      subscribeThanksLine1: "感謝。",
      subscribeThanksLine2: "",
      subscribeLead:
        "以美術館參觀的節奏，為您呈現精選作品、故事與視覺參考。",
      subscribeEmailLabel: "電子郵件",
      subscribeButton: "訂閱",
      subscribeButtonDone: "已訂閱",
      subscribeEmailPlaceholder: "you@example.com",
      subscribeErrorEmpty: "請輸入您的電子郵件。",
      subscribeErrorInvalid: "請輸入有效的電子郵件地址。",
      subscribeSuccessMessage: "您的下一則作品推薦即將送達。",
    },
    fr: {
      navPainting: "Peinture",
      navSculpture: "Sculpture",
      navPhotography: "Photographie",
      navAbout: "À propos",
      search: "Rechercher",
      menu: "Ouvrir le menu",
      progressGallery: "Progression",
      progressSculpture: "Progression sculpture",
      progressPhotography: "Progression",
      footerPainting: "Gallery Walk · Expérience murale de musée",
      footerSculpture: "Gallery Walk · Salle de sculpture",
      footerPhotography: "Gallery Walk · Mur photographique",
      readBackground: "Lire le contexte",
      backToDetails: "Retour aux détails",
      visitMuseum: "Visiter le site du musée",
      hintImage: "Faire glisser · Molette pour zoomer · Double-clic pour réinitialiser",
      hintSculpture: "Faire glisser pour tourner · Molette pour zoomer · Explorer avec Sketchfab",
      searchPromptPainting: "Rechercher des œuvres",
      searchPromptSculpture: "Rechercher des sculptures",
      searchPromptPhotography: "Rechercher des photographies",
      artist: "Artiste",
      year: "Année",
      catalogue: "Catalogue",
      medium: "Technique",
      subject: "Sujet",
      dimensions: "Dimensions",
      location: "Lieu",
      accession: "Inventaire",
      backgroundLabel: "Contexte",
      storyInContext: "{title} en contexte",
      artworkStoryGeneric:
        "{title} de {artist} est façonné par un langage visuel, un contexte historique et des choix artistiques précis. L’œuvre peut être comprise à travers son matériau, son échelle, sa composition et son contexte muséal. Plutôt que de la considérer comme une image rapidement consommée, le visiteur est invité à observer lentement la surface, l’organisation de l’espace, la lumière, les gestes et les relations entre figures et arrière-plan. Ces détails révèlent pourquoi l’œuvre continue de produire du sens au fil du temps.",
      sculptureStoryGeneric:
        "{title} de {artist} peut être compris à travers le corps, la matière, l’équilibre et les changements de point de vue. Une sculpture n’est jamais seulement une image frontale : son sens se transforme lorsque le spectateur se déplace autour d’elle. Dans cet aperçu numérique, l’œuvre devient un objet d’étude tridimensionnel qui permet d’observer ensemble le volume, la surface, les parties manquantes, le poids et la posture. Elle invite à regarder comment une forme occupe l’espace et comment la présence matérielle crée une force émotionnelle.",
      photographyStoryGeneric:
        "{title} de {artist} s’inscrit dans une tradition photographique où le moment, le cadrage, la lumière et la qualité du tirage façonnent le sens. L’image est présentée ici comme un tirage de musée plutôt que comme une image de passage sur un écran. Elle demande une attention au sujet, à la gamme tonale, au contraste, au cadrage, au grain et au contexte historique qu’elle enregistre ou construit. Sa puissance vient autant de ce qu’elle montre que de la manière dont le photographe organise un instant pour en faire une image mémorable.",
      aboutIntro: "Gallery Walk est un musée numérique interactif conçu autour de l’idée de ralentir l’acte de regarder.",
      aboutQuote: "« Ralentir l’acte de regarder »",
      aboutP1: "Sur le web, les œuvres sont souvent consommées rapidement comme de simples images, avec peu de temps consacré à leurs détails, à leur contexte ou à leurs qualités matérielles. Ce projet cherche à créer une expérience de regard plus patiente grâce au défilement, au clic, au glissement, au zoom et à la rotation.",
      aboutP2: "Chaque forme d’art est présentée avec un modèle d’interaction différent. Les peintures apparaissent dans une galerie horizontale avec des cadres classiques, où l’œuvre centrée devient progressivement plus claire comme si une lumière de musée s’allumait. Les sculptures sont présentées avec des socles et des aperçus 3D, permettant d’explorer leur volume, leur matière et leur forme sous différents angles. La photographie utilise le langage visuel du tirage et du développement en chambre noire, en soulignant le ton, le contraste et le processus de révélation de l’image.",
      aboutP3: "Le site fournit aussi des informations détaillées sur les œuvres, notamment l’artiste, l’année, la technique, les dimensions, le lieu, le sujet et les données de collection. En combinant interaction visuelle et contexte, il encourage les utilisateurs à dépasser la navigation passive et à passer plus de temps avec chaque œuvre.",
      aboutP4: "L’objectif de Gallery Walk est de transformer la découverte numérique de l’art en une expérience plus lente, plus immersive et plus significative.",
      aboutThanks: "Merci pour votre lecture.",
      aboutEyebrow: "À propos",
      aboutHeroTitle: "Gallery Walk",
      aboutHeroLead:
        "Gallery Walk est un musée numérique interactif conçu autour de l’idée de ralentir l’acte de regarder.",
      aboutHeroText:
        "Plutôt que de faire défiler les images rapidement, nous vous invitons à observer, interagir et redécouvrir chaque œuvre par le mouvement et l’attention.",
      aboutHeroTagline: "REGARD LENT. VISION PROFONDE.",
      aboutScrollCta: "Faire défiler pour s’abonner",
      subscribeEyebrow: "S’abonner",
      subscribeTitleLine1: "Œuvres choisies",
      subscribeTitleLine2: "par e-mail",
      subscribeThanks: "Merci.",
      subscribeThanksLine1: "Merci.",
      subscribeThanksLine2: "",
      subscribeLead:
        "Une sélection d’œuvres, d’histoires et de références visuelles, livrée au rythme d’une visite de musée.",
      subscribeEmailLabel: "ADRESSE E-MAIL",
      subscribeButton: "S’ABONNER",
      subscribeButtonDone: "ABONNÉ",
      subscribeEmailPlaceholder: "vous@exemple.com",
      subscribeErrorEmpty: "Veuillez saisir votre adresse e-mail.",
      subscribeErrorInvalid: "Veuillez saisir une adresse e-mail valide.",
      subscribeSuccessMessage:
        "Votre prochaine recommandation d’œuvre arrive bientôt.",
    },
    es: {
      navPainting: "Pintura",
      navSculpture: "Escultura",
      navPhotography: "Fotografía",
      navAbout: "Acerca de",
      search: "Buscar",
      menu: "Abrir menú",
      progressGallery: "Progreso",
      progressSculpture: "Progreso de escultura",
      progressPhotography: "Progreso",
      footerPainting: "Gallery Walk · Experiencia de muro de museo",
      footerSculpture: "Gallery Walk · Sala de escultura",
      footerPhotography: "Gallery Walk · Muro fotográfico",
      readBackground: "Leer contexto",
      backToDetails: "Volver a detalles",
      visitMuseum: "Visitar sitio del museo",
      hintImage: "Arrastra para mover · Rueda para ampliar · Doble clic para reiniciar",
      hintSculpture: "Arrastra para rotar · Rueda para ampliar · Explora con Sketchfab",
      searchPromptPainting: "Buscar obras",
      searchPromptSculpture: "Buscar esculturas",
      searchPromptPhotography: "Buscar fotografías",
      artist: "Artista",
      year: "Año",
      catalogue: "Catálogo",
      medium: "Técnica",
      subject: "Tema",
      dimensions: "Dimensiones",
      location: "Ubicación",
      accession: "Inventario",
      backgroundLabel: "Contexto",
      storyInContext: "{title} en contexto",
      artworkStoryGeneric:
        "{title} de {artist} está formado por un lenguaje visual específico, un contexto histórico y una serie de decisiones artísticas. La obra puede leerse a través de su material, escala, composición y contexto museístico. En lugar de tratarla como una imagen de consumo rápido, el espectador está invitado a observar con calma la superficie, la organización del espacio, la luz, los gestos y la relación entre figura y fondo. Estos detalles revelan por qué la obra sigue produciendo significado a través del tiempo.",
      sculptureStoryGeneric:
        "{title} de {artist} puede entenderse a través del cuerpo, el material, el equilibrio y los cambios de punto de vista. Una escultura nunca es solo una imagen frontal: su sentido cambia cuando el espectador se mueve a su alrededor. En esta vista digital, la obra se presenta como un objeto tridimensional que permite observar volumen, superficie, partes ausentes, peso y postura al mismo tiempo. Invita a mirar cómo una forma ocupa el espacio y cómo la presencia material genera fuerza emocional.",
      photographyStoryGeneric:
        "{title} de {artist} pertenece a una tradición fotográfica en la que el momento, el encuadre, la luz y la calidad de impresión construyen significado. Aquí se presenta como una copia fotográfica de museo, no como una imagen que se desliza rápidamente por una pantalla. La imagen puede leerse a través de su tema, gama tonal, contraste, encuadre, grano y contexto histórico. Su fuerza no está solo en lo que muestra, sino en cómo el fotógrafo organiza un instante para convertirlo en una imagen que puede recordarse y cuestionarse.",
      aboutIntro: "Gallery Walk es un museo digital interactivo diseñado en torno a la idea de ralentizar el acto de mirar.",
      aboutQuote: "« Ralentizar el acto de mirar »",
      aboutP1: "En la web, las obras suelen consumirse rápidamente como imágenes, con poco tiempo dedicado a sus detalles, contexto o cualidades materiales. Este proyecto busca crear una experiencia de observación más paciente mediante el desplazamiento, el clic, el arrastre, el zoom y la rotación.",
      aboutP2: "Cada forma artística se presenta mediante un modelo de interacción distinto. Las pinturas aparecen en una galería horizontal con marcos clásicos, donde la obra centrada se vuelve más clara como si se encendiera una luz de museo. Las esculturas se muestran con pedestales y vistas 3D, permitiendo explorar su volumen, material y forma desde distintos ángulos. La fotografía se presenta con el lenguaje visual de las copias fotográficas y el revelado de cuarto oscuro, destacando tono, contraste y el proceso de aparición de la imagen.",
      aboutP3: "El sitio también ofrece información detallada de las obras, como artista, año, técnica, dimensiones, ubicación, tema y datos de colección. Al combinar interacción visual con contexto, el proyecto anima a ir más allá de la navegación pasiva y dedicar más tiempo a comprender cada obra.",
      aboutP4: "El objetivo de Gallery Walk es transformar la visualización digital del arte en una experiencia más lenta, inmersiva y significativa.",
      aboutThanks: "Gracias por leer.",
      aboutEyebrow: "Acerca de",
      aboutHeroTitle: "Gallery Walk",
      aboutHeroLead:
        "Gallery Walk es un museo digital interactivo diseñado en torno a la idea de ralentizar el acto de mirar.",
      aboutHeroText:
        "En lugar de desplazarte rápidamente por las imágenes, te invitamos a observar, interactuar y redescubrir cada obra mediante el movimiento y la atención.",
      aboutHeroTagline: "MIRAR LENTO. VER PROFUNDO.",
      aboutScrollCta: "Desplázate para suscribirte",
      subscribeEyebrow: "Suscribirse",
      subscribeTitleLine1: "Obras seleccionadas",
      subscribeTitleLine2: "en tu correo",
      subscribeThanks: "Gracias.",
      subscribeThanksLine1: "Gracias.",
      subscribeThanksLine2: "",
      subscribeLead:
        "Una selección de obras, historias y referencias visuales, entregada al ritmo de una visita al museo.",
      subscribeEmailLabel: "CORREO ELECTRÓNICO",
      subscribeButton: "SUSCRIBIRSE",
      subscribeButtonDone: "SUSCRITO",
      subscribeEmailPlaceholder: "tu@ejemplo.com",
      subscribeErrorEmpty: "Introduce tu correo electrónico.",
      subscribeErrorInvalid: "Introduce una dirección de correo válida.",
      subscribeSuccessMessage:
        "Tu próxima recomendación de obra llegará pronto.",
    },
  };

  function getLanguage() {
    const stored = localStorage.getItem("galleryWalkLanguage");
    return LANGS.includes(stored) ? stored : "en";
  }

  function t(key, lang = getLanguage()) {
    /* 空字符串是合法译文，不能用 ||（否则 subscribeThanksLine2: "" 会变成键名） */
    if (TEXT[lang] && key in TEXT[lang]) return TEXT[lang][key];
    if (key in TEXT.en) return TEXT.en[key];
    return key;
  }

  function format(key, values = {}, lang = getLanguage()) {
    return t(key, lang).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
  }

  function setText(el, value) {
    if (!el || value === undefined) return;
    el.textContent = value;
  }

  function syncThanksTitleLines(lang = getLanguage()) {
    const line2Text = t("subscribeThanksLine2", lang);
    const useTwoLines = Boolean(String(line2Text).trim());

    document
      .querySelectorAll("[data-i18n='subscribeThanksLine2']")
      .forEach((el) => {
        setText(el, line2Text);
        el.hidden = !useTwoLines;
      });

    document.getElementById("subscribeTitle")?.classList.toggle(
      "subscribe-title--thanks-two-line",
      useTwoLines,
    );
  }

  function applyLanguage(lang = getLanguage()) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      if (el.dataset.i18n === "subscribeThanksLine2") return;
      setText(el, t(el.dataset.i18n, lang));
    });
    syncThanksTitleLines(lang);
    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel, lang));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.placeholder = t(el.dataset.i18nPlaceholder, lang);
    });
    document.querySelectorAll("[data-nav]").forEach((el) => {
      const key = `nav${el.dataset.nav[0]?.toUpperCase() || ""}${el.dataset.nav.slice(1)}`;
      if (TEXT[lang]?.[key]) setText(el, t(key, lang));
    });
    document.querySelectorAll(".language-toggle").forEach((button) => {
      button.textContent = LABELS[lang];
      button.setAttribute("aria-label", LABELS[lang]);
    });
    document.querySelectorAll("[data-lang-option]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.langOption === lang);
    });
    window.dispatchEvent(new CustomEvent("gallery-languagechange", { detail: { lang } }));
  }

  function closeMenu(switcher) {
    const toggle = switcher?.querySelector(".language-toggle");
    const menu = switcher?.querySelector(".language-menu");
    if (!toggle || !menu) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    window.setTimeout(() => {
      if (!menu.classList.contains("is-open")) menu.hidden = true;
    }, 300);
  }

  function openMenu(switcher) {
    const toggle = switcher?.querySelector(".language-toggle");
    const menu = switcher?.querySelector(".language-menu");
    if (!toggle || !menu) return;
    menu.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => menu.classList.add("is-open"));
  }

  function init() {
    document.querySelectorAll(".language-switcher").forEach((switcher) => {
      const toggle = switcher.querySelector(".language-toggle");
      const menu = switcher.querySelector(".language-menu");
      toggle?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!menu) return;
        if (menu.classList.contains("is-open")) closeMenu(switcher);
        else openMenu(switcher);
      });

      switcher.querySelectorAll("[data-lang-option]").forEach((button) => {
        button.addEventListener("click", (e) => {
          e.stopPropagation();
          const lang = button.dataset.langOption;
          if (!LANGS.includes(lang)) return;
          localStorage.setItem("galleryWalkLanguage", lang);
          applyLanguage(lang);
          closeMenu(switcher);
        });
      });
    });
    document.addEventListener("click", () => {
      document.querySelectorAll(".language-switcher").forEach(closeMenu);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      document.querySelectorAll(".language-switcher").forEach(closeMenu);
    });
    applyLanguage();
  }

  window.GalleryI18n = { t, format, getLanguage, applyLanguage };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
