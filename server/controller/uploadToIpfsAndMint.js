const { mintCustomNft } = require('../utils/mintCustomNft');
const { uploadToIpfs } = require('../utils/uploadToIpfs');
const {ethers} = require("ethers")
const CONTRACT = require("../../backend-smart-contracts/deployments/sepolia/ImageMintTesting.json")

const uploadToIpfsAndMint = async(req,res)=>{
    const {name, description} = req.body
    const { buffer, originalname } = req.file;
    const {IpfsHash} = await uploadToIpfs(buffer, originalname, name, description);

    const tokenURI = `ipfs://${IpfsHash}`.trim()

    console.log("tokenURI is - ",  tokenURI);

    // RPC url
    let RPC_URL
    if(process.env.CURRENT_CHAIN_ID === "11155111"){
      RPC_URL=process.env.SEPOLIA_RPC_URL
    }
    else if(process.env.CURRENT_CHAIN_ID === "137"){
      RPC_URL=process.env.POLYGON_RPC_URL
    }

    console.log(RPC_URL)

    // To interact with deployed contract we need
    const CONTRACT_ADDRESS = CONTRACT.address
    const CONTRACT_ABI = CONTRACT.abi
    const PROVIDER = new ethers.JsonRpcApiProvider()
    const SIGNER = process.env.PRIVATE_KEY
    
    // await mintCustomNft()

    res.send()
}
  



module.exports = {
    uploadToIpfsAndMint
}