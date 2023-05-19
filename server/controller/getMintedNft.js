const Nft = require("../model/Nft");
const { catchAsync } = require("../utils/catchAsync");

exports.getMintedNft = catchAsync(async(req, res)=>{
    const {walletAddress} = req;
    const nft = await Nft.findOne({nftOwner: walletAddress})
    console.log(nft)
    return res.send(nft)
})