// Libraries and frameworks
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

// Import router
import authRouter from './routes/auth-route.js'; 
import updateRouter from './routes/update-route.js';
import transitonRouter from './routes/transition-route.js'

import {connectDb } from "./db/db.js"

// Middlewares and CORS setup
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.urlencoded({ extended: true }));

// Use the imported auth router
app.use('/api/user', authRouter);
app.use('/api/update',updateRouter);
app.use('/api/transfer',transitonRouter);


connectDb().then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }).catch(err => {
    console.error('Failed to connect to the database:', err);
  });