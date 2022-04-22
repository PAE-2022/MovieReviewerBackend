import Express from 'express';
import AuthRouter from '@routes/auth';

export const app = Express();

app.use('/api/auth', AuthRouter);
