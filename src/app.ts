import Express from 'express';
import UserRouter from '@routes/users';
import MovieRouter from '@routes/movies';
import { errorHandler } from '@utils/route-catch';
import { logErrors } from '@utils/log-error';
import cors from 'cors';
import '@config/auth';

const app = Express();
app.use(cors());
app.use(Express.json());

app.use('/api/users', UserRouter);
app.use('/api/movies', MovieRouter);
app.use(logErrors());
app.use(errorHandler());

export default app;
