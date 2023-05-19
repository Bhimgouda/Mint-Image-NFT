require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const app = express()
const cors = require("cors")
const multer = require("multer");
const { mintCustomNft } = require("./controller/mintCustomNft")
const { decryptUser } = require("./utils/decryptUser")
const { getMintedNft } = require("./controller/getMintedNft")

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(decryptUser)

// Multer storage Config
const storage = multer.memoryStorage()
const upload = multer({storage: storage})

app.get("/api/get-nft", getMintedNft)
app.post("/api/mint-nft", upload.single("image"), mintCustomNft)

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