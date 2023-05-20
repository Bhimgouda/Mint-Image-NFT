const { uploadToIpfs } = require('../utils/uploadToIpfs');
const {ethers} = require("ethers")
const POLYGON_CONTRACT = require("../../backend-smart-contracts/deployments/polygon/ImageMint.json");
const SEPOLIA_CONTRACT = require("../../backend-smart-contracts/deployments/sepolia/ImageMint.json");
const { catchAsync } = require('../utils/catchAsync');
const { createToken } = require('../utils/createJwtToken');
const CustomError = require('../utils/customError');
const Nft = require('../model/Nft');

const PRIVATE_KEY = process.env.PRIVATE_KEY
let CONTRACT_ADDRESS;
let CONTRACT_ABI;
let RPC_URL;
const CURRENT_CHAIN_ID = process.env.CURRENT_CHAIN_ID

if(CURRENT_CHAIN_ID === "11155111"){
  RPC_URL=process.env.SEPOLIA_RPC_URL
  CONTRACT_ADDRESS = SEPOLIA_CONTRACT.address
  CONTRACT_ABI = SEPOLIA_CONTRACT.abi
}
else if(CURRENT_CHAIN_ID === "137"){
  RPC_URL=process.env.POLYGON_RPC_URL
  CONTRACT_ADDRESS = POLYGON_CONTRACT.address
  CONTRACT_ABI = POLYGON_CONTRACT.abi
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

  let tx;
  if(CURRENT_CHAIN_ID === "11155111"){
    tx = await ImageMintContract.requestNft(walletAddress, tokenURI);
  }
  else if(CURRENT_CHAIN_ID === "137"){
    const gasPrice = ethers.parseUnits('150', 'gwei'); // Set your desired gas price here
    tx = await ImageMintContract.requestNft(walletAddress, tokenURI, { gasPrice });
  }
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