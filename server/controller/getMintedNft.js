const Nft = require("../model/Nft");
const { catchAsync } = require("../utils/catchAsync");

exports.getMintedNft = catchAsync(async(req, res)=>{
    const {walletAddress} = req;
    const nft = await Nft.findOne({nftOwner: walletAddress})
    return res.send(nft)
})