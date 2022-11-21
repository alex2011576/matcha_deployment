import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import userRouter from './routes/users';
import loginRouter from './routes/login';

import testAuthRouter from './routes/testAuth';

import { globalErrorHandler, unknownEndpoint } from './errors';
import { sessionIdExtractor } from './utils/middleware';

export const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

app.use(sessionIdExtractor);

app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.use('/api/testAuth', testAuthRouter);

// Error handler for errors
app.use(globalErrorHandler);

app.use(unknownEndpoint);
