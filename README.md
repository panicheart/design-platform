# Department Platform

A comprehensive web-based platform for department management, resource sharing, and development tracking.

## Features

### Resource Library (资源库)
- Human Resources Management
- Time Tracking
- Material Management
- Component Library
- Product Catalog
- Knowledge Base

### Development Platform (研发平台)
- Task Overview
- Requirements Management
- Project Planning
- Workbench
- Issue Tracking

## Tech Stack

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- JWT Authentication

### Frontend
- React
- TypeScript
- Material-UI
- Redux Toolkit

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd department-platform
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/department-platform
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Documentation

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login

### Resources
- GET /api/resources - Get all resources
- GET /api/resources/:id - Get single resource
- POST /api/resources - Create new resource
- PUT /api/resources/:id - Update resource
- DELETE /api/resources/:id - Delete resource

### Tasks
- GET /api/tasks - Get all tasks
- GET /api/tasks/:id - Get single task
- POST /api/tasks - Create new task
- PUT /api/tasks/:id - Update task
- DELETE /api/tasks/:id - Delete task
- POST /api/tasks/:id/comments - Add comment to task
- PATCH /api/tasks/:id/progress - Update task progress

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 