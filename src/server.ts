import app from './app';
import '@config/config';
import '@config/mongoose';
import swaggerSpec from '@config/swagger';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import 'cron-jobs/fetch-apis';
import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer(app);

const io = new Server(server);

const port = process.env.PORT || 3000;

fs.writeFileSync('swagger.json', JSON.stringify(swaggerSpec));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
