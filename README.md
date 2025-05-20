# 设计平台项目

## 项目简介
这是一个基于 React + TypeScript + Node.js 的现代化设计平台，提供资源管理、任务跟踪、团队协作等功能。

## 技术栈
- 前端：React + TypeScript + Material-UI + Redux Toolkit
- 后端：Node.js + Express + TypeScript
- 数据库：MongoDB（开发环境使用内存数据库）

## 开发环境要求
- Node.js >= 14
- npm >= 6
- MongoDB >= 4.4（可选，开发环境使用内存数据库）

## 快速开始

### 1. 克隆项目
```bash
git clone [项目地址]
cd design-platform
```

### 2. 安装依赖
```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 3. 启动开发服务器
```bash
# 启动后端服务（在 backend 目录下）
npm run dev

# 启动前端服务（在 frontend 目录下）
npm start
```

### 4. 访问应用
- 前端：http://localhost:3000
- 后端：http://localhost:5001

## 开发环境账号
- 邮箱：admin@example.com
- 密码：admin123

## 项目结构
```
design-platform/
├── frontend/          # 前端项目
│   ├── src/
│   │   ├── components/    # 组件
│   │   ├── pages/        # 页面
│   │   ├── services/     # API 服务
│   │   ├── store/        # Redux store
│   │   └── types/        # TypeScript 类型定义
│   └── package.json
│
├── backend/           # 后端项目
│   ├── src/
│   │   ├── controllers/  # 控制器
│   │   ├── models/      # 数据模型
│   │   ├── routes/      # 路由
│   │   └── services/    # 业务逻辑
│   └── package.json
│
├── README.md
└── ISSUES.md
```

## 功能特性
- [x] 用户认证（登录/注册）
- [x] 开发环境快速登录
- [ ] 资源管理
- [ ] 任务跟踪
- [ ] 团队协作
- [ ] 权限控制

## 开发进度
- [x] 项目基础架构搭建
- [x] 用户认证模块
- [ ] 资源管理模块
- [ ] 任务管理模块
- [ ] 团队协作模块

## 已知问题
详见 [ISSUES.md](./ISSUES.md)

## 贡献指南
1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证
MIT 