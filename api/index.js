import express from 'express';
import cors from 'cors';
import projectRoutes from '../backend/api/projects.js';
import messageRoutes from '../backend/api/messages.js';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);

export default app;
