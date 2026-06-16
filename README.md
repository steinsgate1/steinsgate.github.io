# SteinsGate 个人博客

一个基于 GitHub Pages 的静态个人博客网站。

## 功能特性

- 📝 **文章分享** - 支持 Markdown 格式的文章展示
- 📚 **资源收藏** - 分类展示各类收藏资源
- 🎨 **现代化设计** - 毛玻璃效果，粉色主题配色
- 📱 **响应式布局** - 适配各种屏幕尺寸
- 🔄 **无刷新导航** - 基于 Hash 的路由系统

## 项目结构

```
src/
├── css/
│   ├── base/
│   │   ├── variables.css    # 全局变量定义（颜色、间距等）
│   │   ├── reset.css        # CSS重置样式
│   │   └── layout.css       # 全局布局样式
│   ├── components/
│   │   ├── sidebar.css      # 侧边栏组件样式
│   │   ├── buttons.css      # 按钮组件样式
│   │   ├── cards.css        # 卡片组件样式
│   │   └── states.css       # 状态组件样式（加载/错误/空状态）
│   ├── views/
│   │   ├── list.css         # 文章列表视图样式
│   │   ├── article.css      # 文章详情视图样式
│   │   └── resources.css    # 资源分享视图样式
│   └── main.css             # CSS入口文件（导入所有模块）
└── js/
    ├── utils/
    │   ├── dom.js           # DOM操作工具函数
    │   ├── date.js          # 日期处理工具函数
    │   ├── router.js        # 路由工具函数
    │   └── categories.js    # 分类配置与工具函数
    ├── components/
    │   ├── ScrollTop.js     # 返回顶部组件逻辑
    │   └── Sidebar.js       # 侧边栏折叠组件逻辑
    ├── views/
    │   ├── ListView.js      # 文章列表视图逻辑
    │   ├── ArticleView.js   # 文章详情视图逻辑
    │   └── ResourcesView.js # 资源分享视图逻辑
    └── main.js              # 应用入口文件
```

## 目录说明

### src/css/
- **base/** - 基础样式，包括变量定义、重置样式和全局布局
- **components/** - 可复用的UI组件样式
- **views/** - 特定页面视图的样式

### src/js/
- **utils/** - 纯工具函数，无业务逻辑依赖
- **components/** - UI组件逻辑，可独立复用
- **views/** - 页面视图逻辑，负责渲染和交互

## 数据文件

- `data/posts.json` - 博客文章数据
- `data/resources.json` - 资源收藏数据
- `data/bookmarks.json` - 书签数据（用于导入资源）

## 运行方式

```bash
# 启动开发服务器
python -m http.server 8000

# 访问地址
http://localhost:8000
```

## 部署

直接将项目推送到 GitHub Pages 即可自动部署。

## 技术栈

- HTML5 + CSS3
- JavaScript (ES6+)
- Marked.js (Markdown解析)
- GitHub Pages