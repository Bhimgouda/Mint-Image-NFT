require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const app = express()
const cors = require("cors")
const multer = require("multer");
const { uploadToIpfs } = require("./controller/uploadToIpfs")

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Multer storage Config
const storage = multer.memoryStorage()
const upload = multer({storage: storage})

app.post("/api/upload-to-ipfs", upload.single("image"), uploadToIpfs)

app.use((err,req,res,next)=>{
    console.log(err.stack)
    const {message="Something went wrong", status=500} = err
    res.status(status).send(message)
})

startServer()

function startServer(){
    mongoose.connect(MONGODB_URI)
    .then(()=>console.log("Connected to DB successfully"))
    .catch((e)=>console.log(e))

    app.listen(PORT, ()=>{
        console.log(`Server started on Port ${PORT}`)
    })
}