const Nft = require("../model/Nft");
const { catchAsync } = require("../utils/catchAsync");

exports.getMintedNft = catchAsync(async(req, res)=>{
    const {walletAddress} = req;
    const nft = await Nft.findOne({tokenId: 1})
    console.log(nft)
    return res.send(nft)
})