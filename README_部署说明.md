# 李向东 AI 短剧视觉作品集

这是可独立部署的 React + Vite + TypeScript 源码包，不依赖原来的 `chatgpt.site` 托管配置。

## 本地运行

请先安装 Node.js 20 或更高版本，然后在本目录打开终端：

```bash
npm install
npm run dev
```

终端会显示本地预览地址。修改完成后生成正式文件：

```bash
npm run build
```

生成的 `dist` 文件夹就是静态部署产物。

## 推荐部署方式

### Vercel

1. 将整个源码目录上传到 GitHub、GitLab 或 Bitbucket。
2. 在 Vercel 新建项目并导入仓库。
3. Framework 选择 Vite；Build Command 使用 `npm run build`；Output Directory 使用 `dist`。
4. 点击部署。

仓库内已包含 `vercel.json`，支持单页网站路由回退。

### Netlify

导入代码仓库后直接部署即可，仓库内的 `netlify.toml` 已包含构建与发布目录配置。也可以执行 `npm run build` 后，把 `dist` 文件夹拖入 Netlify Drop。

### Cloudflare Pages

连接代码仓库后设置：

- Build command：`npm run build`
- Build output directory：`dist`
- Node.js：20 或更高版本

### 自己的服务器或对象存储

执行 `npm run build`，将 `dist` 内的全部内容上传到网站根目录。服务器应把未知路径回退到 `index.html`。

## 上线前需要检查

- `src/App.tsx` 中的首页背景视频目前使用外部 CloudFront 地址。如果希望完全自主托管，请下载获得授权的视频并放入 `public/assets/video/`，再把地址改为站内路径。
- `index.html` 目前从 Google Fonts 加载字体。面向中国大陆访问时，建议改成本地字体文件。
- `public/assets/episodes/` 包含完整作品视频，公开部署前请确认展示授权。
- 网站静态资源约 100 MB。部分免费托管平台对单文件大小、构建产物或流量有限制，需要查看所选平台的当前套餐规则。
- 更换正式域名后，建议在 `index.html` 补充 canonical、Open Graph URL 和完整的社交分享图片地址。

## 主要编辑位置

- 页面内容和项目数据：`src/App.tsx`
- 整体样式和动效：`src/index.css`
- 图片与视频：`public/assets/`
- 页面标题、描述和字体：`index.html`

## 构建产物说明

源码包中的 `dist` 可以随时删除并通过 `npm run build` 重新生成；`node_modules` 不需要上传或备份，可通过 `npm install` 恢复。
