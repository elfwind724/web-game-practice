# Web Game Practice

一个基于React、TypeScript和Vite构建的Web游戏集合。使用现代前端技术栈，包括React 18、TailwindCSS和React Query。

## 游戏列表

- 记忆游戏：翻转卡片并匹配相同的图案

## 技术栈

- **构建工具**: Vite v5.4.x
- **前端框架**: React 18.3.x
- **类型系统**: TypeScript
- **UI框架**: TailwindCSS
- **状态管理**: React Query
- **路由系统**: React Router DOM

## 项目架构

```
src/
├── components/       # UI 组件
│   ├── ui/          # 基础 UI 组件
│   └── features/    # 功能组件
├── lib/             # 工具函数和配置
├── hooks/           # 自定义 Hooks
├── types/           # TypeScript 类型定义
├── styles/          # 全局样式
└── pages/          # 页面组件
public/
└── images/         # 图片资源
scripts/
└── download-images.js  # 图片下载脚本
```

## 图片资源管理

### 图片选择和来源

项目使用的图片资源主要来自免费图片网站（如Freepik）。图片选择考虑了以下因素：
- 游戏主题相关性
- 现代化设计风格
- 免费使用许可

### 图片下载与存储

项目使用Node.js脚本自动下载和管理图片：

1. **下载脚本**: `scripts/download-images.js` - 使用ES模块格式编写的图片下载工具

```javascript
// 脚本示例
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  {
    url: 'https://img.freepik.com/free-vector/memory-game-landing-page_23-2148690459.jpg',
    name: 'memory-game.jpg'
  },
  // 更多图片...
];

// 下载函数
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Downloaded: ${filepath}`);
          resolve();
        });
      } else {
        response.resume();
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
};

// 执行下载
async function downloadAllImages() {
  const imagesDir = path.join(__dirname, '../public/images');
  
  // 创建images目录
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  for (const image of images) {
    const filepath = path.join(imagesDir, image.name);
    try {
      await downloadImage(image.url, filepath);
    } catch (error) {
      console.error(`Error downloading ${image.name}:`, error.message);
    }
  }
}

downloadAllImages();
```

2. **图片存储路径**: 所有图片都存储在 `public/images/` 目录下
3. **运行下载脚本**: `node scripts/download-images.js`

### 图片引用方式

在代码中引用图片时，需要考虑项目的基础路径（base path）：

```typescript
// 获取Vite的基础路径
const basePath = import.meta.env.BASE_URL;

// 正确引用图片
const imageUrl = `${basePath}images/memory-game.jpg`;

// 在JSX中使用图片
<img src={imageUrl} alt="Memory Game" />

// 在样式中使用图片
<div style={{ backgroundImage: `url(${basePath}images/banner-bg.jpg)` }}></div>
```

这种方式确保图片在不同部署环境下（本地开发、GitHub Pages等）都能正确加载。

### 主要图片资源

| 图片名称 | 用途 | 路径 |
|---------|------|------|
| banner-bg.jpg | 网站横幅背景 | /public/images/banner-bg.jpg |
| memory-game.jpg | 记忆游戏卡片图片 | /public/images/memory-game.jpg |
| memory-game-2.jpg | 记忆游戏卡片图片(备选) | /public/images/memory-game-2.jpg |
| memory-pro-game.jpg | 高级记忆游戏卡片图片 | /public/images/memory-pro-game.jpg |
| puzzle-game.jpg | 拼图游戏卡片图片 | /public/images/puzzle-game.jpg |
| tetris-game.jpg | 俄罗斯方块游戏卡片图片 | /public/images/tetris-game.jpg |
| snake-game.jpg | 贪吃蛇游戏卡片图片 | /public/images/snake-game.jpg |
| 2048-game.jpg | 2048游戏卡片图片 | /public/images/2048-game.jpg |
| sudoku-game.jpg | 数独游戏卡片图片 | /public/images/sudoku-game.jpg |
| word-puzzle-game.jpg | 单词游戏卡片图片 | /public/images/word-puzzle-game.jpg |
| coming-soon-2.jpg | "敬请期待"图片 | /public/images/coming-soon-2.jpg |

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 部署到GitHub Pages

### 配置项目

1. 在`package.json`中添加部署脚本：

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

2. 在`vite.config.ts`中设置正确的基础路径：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/web-game-practice/',
})
```

### 安装部署工具

```bash
npm install --save-dev gh-pages
```

### 部署步骤

```bash
# 构建并部署到GitHub Pages
npm run deploy
```

部署成功后，网站将可通过以下URL访问：
https://用户名.github.io/web-game-practice/

## 贡献

欢迎提交PR和Issue来改进这个项目。

## 许可证

MIT
