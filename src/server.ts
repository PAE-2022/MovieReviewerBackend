import app from './app';
import '@config/config';
import '@config/mongoose';
import swaggerSpec from '@config/swagger';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import 'cron-jobs/fetch-apis';
import http from 'http';
import { io } from '@socketio/socketio';

const server = http.createServer(app);

const port = process.env.PORT || 3000;

fs.writeFileSync('swagger.json', JSON.stringify(swaggerSpec));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

io.listen(server);

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
