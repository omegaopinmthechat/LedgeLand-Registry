import express from 'express';
import './config/env.js'
import authRoutes from './routes/client/auth.routes.js';

const app = express()
const auth = "/api/v1/auth"

app.use(express.json())

app.use(`${auth}`, authRoutes);

app.get('/', (req,res)=>{
    return res.send("PROJECT_9")
})

const PORT = process.env.PORT || 5500

app.listen(PORT, ()=>{
    console.log("Server of PROJECT9 is running on: ", PORT)
});
