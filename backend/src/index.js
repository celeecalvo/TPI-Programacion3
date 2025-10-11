import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { port, sequelize } from './config/db.js';
import './models/Book.js';
import './models/User.js';
import './models/Review.js';
import './models/Club.js';
import './models/Activity.js';
import './models/ReviewRating.js';
import './models/relation.js';

import BookRoutes from './routes/books.routes.js';
import AuthRoutes from './routes/auth.routes.js';
import ReviewRoutes from './routes/review.routes.js';
import ClubRoutes from './routes/club.routes.js';
import ActivityRoutes from './routes/activity.routes.js';
import ReviewRatingRoutes from './routes/reviewRating.routes.js'

dotenv.config();
const app = express();

const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = isProduction
  ? [
      "https://tudominio.com",   // configurar DuckDNS
      "https://www.tudominio.com",
    ]
  : ["http://localhost:5173"];

// CORS dinámico
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Bloqueado por CORS: ${origin}`);
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
}));


app.use(express.json());

try {
    await sequelize.sync();

    app.use('/api', BookRoutes);
    app.use('/api', AuthRoutes);
    app.use('/api', ReviewRoutes);
    app.use('/api', ClubRoutes);
    app.use('/api', ActivityRoutes);
    app.use('/api', ReviewRatingRoutes);
    app.listen(port, "127.0.0.1", () => {
        console.log(`Corriendo servidor en puerto ${port}`);
    });

} catch (error) {
    console.error('Error al inicializar servidor: ', error);
}
