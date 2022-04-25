import Express from 'express';
import UserRouter from '@routes/users';
import { errorHandler } from '@utils/route-catch';
import { logErrors } from '@utils/log-error';

const app = Express();

app.use(Express.json());

app.use('/api/users', UserRouter);
app.use(logErrors());
app.use(errorHandler());

export default app;
