import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import roleRequestsRouter from './routes/roleRequests.js';
import quizRouter from './routes/quiz.js';
import chatbotRouter from './routes/chatbot.js';
import facultyModulesRouter from './routes/facultyModules.js';
import challengesRouter from './routes/challenges.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initializeGameSocket } from './services/gameSocket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(helmet());
// CORS: allow specific origins for production security
const corsOptions = {
  origin: [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'https://cybered.netlify.app',           // Netlify production domain
    'https://cybered-backend.onrender.com',  // Backend domain
    /\.netlify\.app$/                         // Allow Netlify preview deploys
  ],
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Serve static frontend files
const frontendPath = path.join(__dirname, '../../frontend');
app.use('/assets', express.static(path.join(frontendPath, 'assets')));
app.use('/css', express.static(path.join(frontendPath, 'src/css')));
app.use('/js', express.static(path.join(frontendPath, 'src/js')));
app.use('/html', express.static(path.join(frontendPath, 'src/html')));
app.use('/games', express.static(path.join(frontendPath, 'games')));

// Simple root route to avoid confusion when visiting http://localhost:PORT
app.get('/', (req, res) => {
  res.type('text/plain').send('CyberEd API is running. Try /api/health');
});

app.get('/api/health', (req, res) => {
  const conn = mongoose.connection;
  res.json({
    ok: true,
    service: 'cybered-backend',
    time: new Date().toISOString(),
    db: {
      name: conn?.name,
      host: conn?.host,
      readyState: conn?.readyState // 1 = connected
    }
  });
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/role-requests', roleRequestsRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/chatbot', chatbotRouter);
app.use('/api/faculty-modules', facultyModulesRouter);
app.use('/api/challenges', challengesRouter);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/CyberEdCapstone';

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, { 
      dbName: undefined // accept database in URI
    });
    console.log('[db] connected');
    
    // Initialize game socket
    initializeGameSocket(io);
    console.log('[socket.io] game socket initialized');
    
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`[server] listening on http://localhost:${PORT}`);
      console.log(`[server] accessible from network at http://<your-ip>:${PORT}`);
      console.log(`[socket.io] ready for multiplayer connections`);
    });
  } catch (err) {
    console.error('[db] connection error', err);
    process.exit(1);
  }
})();
