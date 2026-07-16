import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Standard Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming JSON body payloads

// Mount Routes
app.use('/api/auth', authRoutes);

// Quick Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'PLAKA Server running smoothly.' });
});

app.listen(PORT, () => {
    console.log(`🐸 PLAKA database engine spinning on: http://localhost:${PORT}`);
});