import express from 'express';
import dotenv from 'dotenv';
import { DbConnection } from './db/DbConfig.js';
import { createServer } from 'http';
import routes from './routes/Routes.js';
import cors from 'cors';
import { init as initSocket } from './services/SocketService.js';
import { connect } from './services/RedisService.js';

dotenv.config();
const app = express();
const port = process.env.PORT;
const httpServer = createServer(app);
DbConnection.connect();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5250',
    credentials: true,
    exposedHeaders: ['x-auth-token']
}));

initSocket(httpServer);
connect();

app.use('/', routes);

httpServer.listen(port, () => {
    console.log(`[SERVING ON PORT]: ${port}`);
})
