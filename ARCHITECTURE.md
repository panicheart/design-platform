# Department Platform 项目架构文档

## 系统架构概览

```mermaid
graph TB
    subgraph Frontend
        A[React Application] --> B[Redux Store]
        A --> C[React Router]
        A --> D[Material-UI]
        B --> E[Auth Slice]
        B --> F[Resource Slice]
        B --> G[Task Slice]
    end

    subgraph Backend
        H[Express Server] --> I[MongoDB]
        H --> J[Auth Routes]
        H --> K[Resource Routes]
        H --> L[Task Routes]
    end

    A <--> H
```

## 前端架构

```mermaid
graph TB
    subgraph Frontend Components
        A[App] --> B[Layout]
        B --> C[Dashboard]
        B --> D[ResourceLibrary]
        B --> E[DevelopmentPlatform]
        B --> F[Profile]
    end

    subgraph State Management
        G[Redux Store] --> H[Auth Slice]
        G --> I[Resource Slice]
        G --> J[Task Slice]
    end

    subgraph Services
        K[API Service] --> L[Auth API]
        K --> M[Resource API]
        K --> N[Task API]
    end

    A --> G
    A --> K
```

## 后端架构

```mermaid
graph TB
    subgraph Backend Services
        A[Express Server] --> B[Auth Routes]
        A --> C[Resource Routes]
        A --> D[Task Routes]
    end

    subgraph Database
        E[MongoDB] --> F[User Collection]
        E --> G[Resource Collection]
        E --> H[Task Collection]
    end

    B --> E
    C --> E
    D --> E
```

## 技术栈

### 前端
- React 19.1.0
- TypeScript 4.9.5
- Redux Toolkit
- Material-UI 7.1.0
- React Router 7.6.0
- Axios

### 后端
- Node.js
- Express
- MongoDB
- Mongoose
- TypeScript

## 主要功能模块

1. 认证系统
   - 用户登录
   - 用户注册
   - 会话管理

2. 资源库
   - 资源管理
   - 资源分类
   - 资源搜索

3. 开发平台
   - 任务管理
   - 开发工具集成
   - 协作功能

4. 用户档案
   - 个人信息管理
   - 权限控制
   - 设置管理

## 数据流

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database

    U->>F: 用户操作
    F->>B: API 请求
    B->>D: 数据操作
    D-->>B: 返回结果
    B-->>F: API 响应
    F-->>U: 更新界面
```

## 部署架构

```mermaid
graph TB
    subgraph Production
        A[Frontend Server] --> B[CDN]
        C[Backend Server] --> D[MongoDB Cluster]
        E[Load Balancer] --> A
        E --> C
    end

    subgraph Development
        F[Local Frontend] --> G[Local Backend]
        G --> H[Local MongoDB]
    end
``` 