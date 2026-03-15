# 企业后台管理系统 - 前端

基于 React + Material-UI 构建的现代化企业级后台管理系统前端。

## 📦 技术栈

- **React 18** - UI 框架
- **Vite** - 构建工具
- **Material-UI v5** - UI 组件库
- **React Router v6** - 路由管理
- **Zustand** - 状态管理
- **Axios** - HTTP 请求
- **Recharts** - 图表库
- **TypeScript** - 类型支持

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产构建

```bash
npm run preview
```

## 📁 项目结构

```
frontend/
├── src/
│   ├── components/         # 公共组件
│   │   └── Layout/        # 布局组件
│   │       ├── AppHeader.tsx    # 顶部导航栏
│   │       ├── AppSidebar.tsx   # 侧边栏菜单
│   │       └── AppLayout.tsx    # 主布局
│   ├── pages/             # 页面组件
│   │   ├── Dashboard/     # 仪表盘
│   │   ├── User/          # 用户管理
│   │   └── Login/         # 登录页
│   ├── hooks/             # 自定义 Hooks
│   ├── stores/            # Zustand 状态管理
│   ├── services/          # API 服务
│   ├── router/            # 路由配置
│   ├── theme/             # MUI 主题配置
│   ├── utils/             # 工具函数
│   ├── App.tsx            # 根组件
│   └── main.tsx           # 入口文件
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎨 功能特性

### 1. 仪表盘
- 数据概览卡片（用户数、订单数、收入等）
- 收入趋势图（面积图）
- 销售分布图（饼图）
- 周访问量统计（柱状图）
- 最近订单列表

### 2. 用户管理
- 用户列表展示（支持分页）
- 用户搜索（用户名/昵称/邮箱）
- 用户新增/编辑/删除
- 用户状态切换
- 用户详情查看

### 3. 登录功能
- 用户名密码登录
- 记住我功能
- 第三方登录入口（Google/GitHub/微信）

### 4. 布局功能
- 响应式侧边栏（可折叠）
- 顶部导航栏
- 标签页导航（多标签）
- 深色/浅色主题切换
- 全屏切换

## 🔧 配置

### API 代理配置

在 `vite.config.ts` 中配置：

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

### 主题配置

在 `src/theme/index.ts` 中自定义主题：

```typescript
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    // ... 其他配置
  },
});
```

## 📝 默认账号

登录账号：
- 用户名：admin
- 密码：admin123

## 🛠️ 开发规范

### 组件命名

```typescript
// 使用 PascalCase 命名组件
export const UserProfile: React.FC = () => {};

// 使用 camelCase 命名 hooks
export const useUserProfile = () => {};
```

### 样式规范

优先使用 MUI 的 `sx` prop：

```typescript
<Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  }}
/>
```

## 📄 License

MIT