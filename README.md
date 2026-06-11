# Gallery Walk (art-gallery-project)

前后端分离的数字美术馆项目。

```
art-gallery-project/
├── frontend/          # 静态网页（Vercel）
├── backend/           # Node.js + Express + Supabase PostgreSQL
└── database/          # supabase.sql
```

## 1. 安装依赖

### 后端

```bash
cd backend
npm install
```

### 前端图片构建脚本（可选）

```bash
cd ..
npm install
```

## 2. 创建 Supabase 数据库

1. 打开 [supabase.com](https://supabase.com) 注册并 **New Project**
2. 进入 **SQL Editor**，粘贴并运行 `database/supabase.sql`
3. 进入 **Project Settings → Database**，复制 **Connection string → URI**
4. 将 URI 填入 `backend/.env` 的 `DATABASE_URL`

```bash
cd backend
cp .env.example .env
# 编辑 .env，填入 DATABASE_URL 和 CORS_ORIGIN
```

## 3. 启动后端（本地）

```bash
cd backend
npm start
```

- 健康检查：`GET http://localhost:3000/health`
- 订阅接口：`POST http://localhost:3000/api/subscribe`

## 4. 启动前端（本地）

```bash
cd frontend
python3 -m http.server 5500
```

访问：`http://127.0.0.1:5500/about.html`

## 5. 线上部署（推荐）

| 部分 | 平台 | 说明 |
|------|------|------|
| 前端 | **Vercel** | Root Directory 设为 `frontend` |
| 数据库 | **Supabase 免费档** | 运行 `database/supabase.sql` |
| 后端 API | **Render 免费档** | 部署 `backend/`，配置 `DATABASE_URL` |

### Render 部署后端

1. [render.com](https://render.com) 连接 GitHub 仓库
2. 新建 **Web Service**，Root Directory 选 `backend`
3. Build: `npm install`，Start: `npm start`
4. Environment 添加：
   - `DATABASE_URL` = Supabase 连接串
   - `CORS_ORIGIN` = `https://你的-vercel-域名.vercel.app`
5. 部署完成后得到 API 地址，例如 `https://gallery-walk-api.onrender.com`

### Vercel 前端连接 API

在 `frontend/about.html` 取消注释并填写 Render 地址：

```html
<meta name="gallery-subscribe-api" content="https://gallery-walk-api.onrender.com/api/subscribe" />
```

Push 后，访客在 Vercel 网站订阅 → Render API → Supabase 数据库。

## 6. 测试订阅

```bash
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"hello@example.com","source":"website"}'
```

成功：

```json
{ "success": true, "message": "Subscription successful." }
```

重复订阅：

```json
{ "success": false, "message": "This email is already subscribed." }
```

在 Supabase **Table Editor → subscriptions** 可查看写入的邮箱。

## 说明

- 本地开发默认 API：`http://localhost:3000/api/subscribe`
- 线上通过 `<meta name="gallery-subscribe-api">` 或 `window.GALLERY_SUBSCRIBE_API` 覆盖
- 不包含注册、登录、喜欢、收藏功能
