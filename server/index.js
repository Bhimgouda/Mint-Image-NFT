require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const app = express()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)
.then(()=>console.log("Connected to DB successfully"))
.catch((e)=>console.log(e))

app.listen(PORT, ()=>{
    console.log(`Server started on Port ${PORT}`)
})