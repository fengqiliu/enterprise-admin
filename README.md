# 企业后台管理系统 (Enterprise Admin System)

基于 **React + Material-UI** 和 **Spring Boot** 构建的现代化企业级后台管理系统。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen.svg)
![Material-UI](https://img.shields.io/badge/Material--UI-5.15-blue.svg)

## 📋 项目简介

本项目是一套全栈企业级后台管理系统，前端采用 React + Material-UI 构建美观的界面，后端采用 Spring Boot + MyBatis-Plus 提供稳定的 API 服务。系统包含用户管理、角色管理、菜单管理、部门管理、数据字典、系统配置、日志管理等常用功能模块，支持 GitHub SSO 单点登录。

## 🎨 技术栈

### 前端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 18.x | UI 框架 |
| Vite | 5.x | 构建工具 |
| Material-UI | 5.x | UI 组件库 |
| React Router | 6.x | 路由管理 |
| Zustand | 4.x | 状态管理 |
| TanStack Query | 5.x | 服务端状态管理 |
| Axios | 1.x | HTTP 请求 |
| Recharts | 2.x | 图表库 |
| TypeScript | 5.x | 类型支持 |
| React Hook Form | 7.x | 表单处理 |
| Zod | 3.x | 表单验证 |

### 后端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Spring Boot | 3.2.x | 后端框架 |
| Spring Security | 6.x | 安全认证 |
| MyBatis-Plus | 3.5.x | ORM 框架 |
| MySQL | 8.x | 主数据库（生产环境） |
| SQLite | 3.x | 嵌入式数据库（开发环境） |
| Redis | 7.x | 缓存（可选） |
| JWT | 0.12.x | Token 认证 |
| Knife4j | 4.x | API 文档 |
| Lombok | - | 代码简化 |

## 📁 项目结构

```
enterprise-admin-system/
├── frontend/                    # 前端项目
│   ├── src/
│   │   ├── components/         # 公共组件
│   │   │   └── Layout/        # 布局组件
│   │   │       ├── AppHeader.tsx    # 顶部导航栏
│   │   │       ├── AppSidebar.tsx   # 侧边栏菜单
│   │   │       └── AppLayout.tsx    # 主布局
│   │   ├── pages/             # 页面组件
│   │   │   ├── Dashboard/     # 仪表盘
│   │   │   ├── Login/         # 登录页
│   │   │   ├── System/        # 系统管理（用户、角色、菜单、部门）
│   │   │   ├── Business/      # 业务管理（字典、配置）
│   │   │   ├── Log/           # 日志中心
│   │   │   └── Report/        # 报表中心
│   │   ├── stores/            # Zustand 状态管理
│   │   ├── services/          # API 服务
│   │   ├── router/            # 路由配置
│   │   ├── theme/             # MUI 主题配置
│   │   ├── App.tsx            # 根组件
│   │   └── main.tsx           # 入口文件
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                     # 后端项目
│   ├── src/main/java/com/enterprise/
│   │   ├── AdminApplication.java    # 启动类
│   │   ├── common/              # 公共类
│   │   ├── config/              # 配置类
│   │   ├── controller/          # 控制器
│   │   ├── dto/                 # 数据传输对象
│   │   ├── entity/              # 实体类
│   │   ├── handler/             # 异常处理
│   │   ├── mapper/              # DAO 层
│   │   ├── service/             # 服务层
│   │   └── dto/                 # 数据传输对象
│   ├── src/main/resources/
│   │   ├── application.yml      # 配置文件
│   │   └── sql/                 # SQL 脚本
│   └── pom.xml
│
└── README.md
```

## 🚀 功能模块

### 1. 首页仪表盘
- 📊 数据概览卡片（用户数、订单数、收入、任务）
- 📈 收入趋势图（面积图）
- 🥧 销售分布图（饼图）
- 📊 周访问量统计（柱状图）
- 📋 最近订单列表

### 2. 系统管理
- 👥 **用户管理** - 用户增删改查、状态切换、密码重置
- 🔐 **角色管理** - 角色配置、权限分配
- 📋 **菜单管理** - 菜单配置、权限标识
- 🏢 **部门管理** - 组织架构管理

### 3. 业务管理
- 📖 **数据字典** - 字典类型和字典项管理
- ⚙️ **参数配置** - 系统参数配置

### 4. 日志中心
- 📝 **操作日志** - 记录用户操作
- 🔑 **登录日志** - 记录登录信息

### 5. 报表中心
- 📊 数据导出
- 📈 统计报表

## 📦 快速开始

### 环境要求

- Node.js >= 18.x
- JDK >= 17
- MySQL >= 8.0（生产环境）
- SQLite 3.x（开发环境，可选）
- Redis >= 7.0（可选，用于缓存）

### 1. 数据库初始化

```bash
# MySQL（生产环境）
mysql -u root -p < backend/src/main/resources/sql/init.sql

# SQLite（开发环境）- 自动创建，无需手动初始化
```

### 2. 后端启动

```bash
cd backend

# 开发模式（使用 SQLite，无需 Redis）
mvn spring-boot:run

# 生产模式：修改数据库配置（src/main/resources/application.yml）
# 访问 API 文档：http://localhost:8081/api/doc.html
```

### 3. 前端启动

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问：http://localhost:3000
```

### 4. 默认账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | 超级管理员 |

## 🎨 界面预览

### 登录页面
- 渐变背景设计
- 第三方登录入口
- 记住我功能

### 仪表盘
- 数据卡片展示
- 多种图表可视化
- 响应式布局

### 用户管理
- 数据表格（支持分页、排序、筛选）
- 搜索过滤
- 新增/编辑/删除对话框

## 🔧 配置说明

### 后端配置

编辑 `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/enterprise_admin
    username: root
    password: your_password
  
  data:
    redis:
      host: localhost
      port: 6379

jwt:
  secret: your-secret-key
  expiration: 86400000
```

### 前端配置

编辑 `frontend/vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8081',
      changeOrigin: true,
    },
  },
}
```

## 📝 API 接口

### 认证接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /auth/login | POST | 用户登录 |
| /auth/logout | POST | 用户登出 |
| /auth/refresh | POST | 刷新 Token |
| /auth/register | POST | 用户注册 |
| /auth/oauth2/github | GET | GitHub OAuth 登录 |

### 用户接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /system/user/list | GET | 用户列表 |
| /system/user/{id} | GET | 用户详情 |
| /system/user | POST | 新增用户 |
| /system/user | PUT | 修改用户 |
| /system/user/{ids} | DELETE | 删除用户 |
| /system/user/{id}/status | PUT | 修改状态 |
| /system/user/{id}/password | PUT | 重置密码 |

## 🛠️ 开发指南

### 前端开发规范

1. 组件使用 PascalCase 命名
2. 优先使用 MUI 的 sx prop 进行样式定义
3. 使用 TypeScript 确保类型安全
4. 使用 Zustand 进行状态管理

### 后端开发规范

1. 使用 Lombok 简化代码
2. 统一使用 Result 封装响应
3. 使用 MyBatis-Plus 进行数据操作
4. 使用 @PreAuthorize 进行权限控制

## 📄 License

MIT License

---

**Built with ❤️ using React, Material-UI, and Spring Boot**