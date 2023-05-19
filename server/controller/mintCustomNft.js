const { uploadToIpfs } = require('../utils/uploadToIpfs');
const {ethers} = require("ethers")
const CONTRACT = require("../../backend-smart-contracts/deployments/sepolia/ImageMintTesting.json");
const { catchAsync } = require('../utils/catchAsync');
const { createToken } = require('../utils/createJwtToken');
const CustomError = require('../utils/customError');
const Nft = require('../model/Nft');

const PRIVATE_KEY = process.env.PRIVATE_KEY
const CONTRACT_ADDRESS = CONTRACT.address
const CONTRACT_ABI = CONTRACT.abi
let RPC_URL;

if(process.env.CURRENT_CHAIN_ID === "11155111"){
  RPC_URL=process.env.SEPOLIA_RPC_URL
}
else if(process.env.CURRENT_CHAIN_ID === "137"){
  RPC_URL=process.env.POLYGON_RPC_URL
}

const mintCustomNft = catchAsync(async(req,res)=>{
  if(req.walletAddress) throw new CustomError(`You have already minted your free NFT`)

  const {name, description, walletAddress} = req.body
  const { buffer, originalname } = req.file;

  const {tokenIpfsHash, imageUri} = await uploadToIpfs(buffer, originalname, name, description);
  const tokenURI = `ipfs://${tokenIpfsHash}`.trim()

  // Creating instance of a network provider, wallet and Contract
  const PROVIDER = new ethers.JsonRpcProvider(RPC_URL)
  const WALLET = new ethers.Wallet(PRIVATE_KEY, PROVIDER)
  const ImageMintContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, WALLET)

  const tx = await ImageMintContract.requestNft(walletAddress, tokenURI);
  const receipt = await tx.wait()

  const events = await ImageMintContract.queryFilter("NftMinted", receipt.blockNumber);
  const event = events.find(event=> event.transactionHash === tx.hash)
  console.log(`Minted NFT with tokenId - ${parseInt(event.args[0])}`)
  
  const tokenData = {tokenId: parseInt(event.args[0]), nftOwner: event.args[1].toString(), nftAddress: CONTRACT_ADDRESS, name, description, imageUri: imageUri.replace("ipfs://", "https://ipfs.io/ipfs/")}
  
  const jwtToken = createToken(tokenData.nftOwner)
  res.send({tokenData, jwtToken})
  await Nft.create(tokenData)
})

module.exports = {
    mintCustomNft
}