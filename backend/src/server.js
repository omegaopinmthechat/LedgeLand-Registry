import express from 'express';
import './config/env.js'

const app = express()

app.use(express.json())


app.use('/', (req,res)=>{
    res.send("Hello")
})

const PORT = process.env.PORT || 5500

app.listen(PORT, ()=>{
    console.log("Server of PROJECT9 is running on: ", PORT)
});
