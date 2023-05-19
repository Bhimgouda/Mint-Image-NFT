const mongoose = require("mongoose")
const {Schema} = mongoose;

const nftSchema = new Schema({
    nftOwner : String,
    nftAddress: String,
    tokenId: Number,
    name: String,
    description: String,
    imageUri: String
})

const Nft = mongoose.model("Nft", nftSchema)
module.exports = Nft