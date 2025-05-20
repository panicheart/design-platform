import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { errorHandler, notFoundHandler } from './error';
import { auth } from './auth';
import { validateResource, validateUser } from './validate';
import logger from '../utils/logger';

export const setupMiddleware = (app: express.Application) => {
  // 基础中间件
  app.use(cors());
  app.use(json());
  app.use(express.urlencoded({ extended: true }));

  // 日志中间件
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  // 错误处理中间件
  app.use(notFoundHandler);
  app.use(errorHandler);

  // 导出其他中间件供路由使用
  return {
    auth,
    validateResource,
    validateUser
  };
}; 