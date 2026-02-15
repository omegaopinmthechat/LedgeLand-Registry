import express from 'express';
import './config/env.js';
import cors from "cors";
import authRoutes from './routes/client/auth.routes.js';
import registrarAuthRoutes from './routes/registrar/registrar.auth.routes.js';
import registrarPinataRoutes from './routes/registrar/registrar.pinata.routes.js';

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

app.get('/', (req,res)=>{
    return res.send("PROJECT_9")
})

const PORT = process.env.PORT || 5500

app.listen(PORT, ()=>{
    console.log("Server of PROJECT9 is running on: ", PORT)
});
