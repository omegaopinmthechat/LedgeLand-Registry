import express from 'express';
import './config/env.js';
import cors from "cors";
import authRoutes from './routes/client/auth.routes.js';
import registrarAuthRoutes from './routes/registrar/registrar.auth.routes.js';
import registrarPinataRoutes from './routes/registrar/registrar.pinata.routes.js';
import registrarBlockchainRoutes from './routes/registrar/registrar.blockchain.routes.js';
import { ApiError } from '../utils/ApiError.js';

const app = express()
const baseUrl = "/api/v1";

app.use(express.json())

app.use(
  cors({
    origin: "*",
  }),
);

app.use(`${baseUrl}/auth`, authRoutes);
app.use(`${baseUrl}/registrar`, registrarAuthRoutes);
app.use(`${baseUrl}/registrar/pinata`, registrarPinataRoutes);
app.use(`${baseUrl}/registrar/blockchain`, registrarBlockchainRoutes);

app.get('/', (req,res)=>{
    return res.send("PROJECT_9")
})

// Global error handler - must be after all routes
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
  
  // Handle other errors
  return res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
    statusCode: 500,
  });
});

const PORT = process.env.PORT || 5500

app.listen(5500, ()=>{
    console.log("Server of PROJECT9 is running on: ", PORT)
});
