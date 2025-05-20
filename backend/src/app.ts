import express from 'express';
import cors from 'cors';
import taskListRouter from './routes/taskList';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use(taskListRouter);

// 错误处理
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 