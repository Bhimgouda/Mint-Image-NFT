const { mintCustomNft } = require('../utils/mintCustomNft');
const { uploadToIpfs } = require('../utils/uploadToIpfs');
const {ethers} = require("ethers")
const CONTRACT = require("../../backend-smart-contracts/deployments/sepolia/ImageMintTesting.json")

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

const uploadToIpfsAndMint = async(req,res)=>{
    const {name, description} = req.body
    const { buffer, originalname } = req.file;
    const {IpfsHash} = await uploadToIpfs(buffer, originalname, name, description);

    const tokenURI = `ipfs://${IpfsHash}`.trim()

    console.log("tokenURI is - ",  tokenURI);

    // Creating instance of a network provider and wallet
    const PROVIDER = new ethers.JsonRpcProvider(RPC_URL)
    const WALLET = new ethers.Wallet(PRIVATE_KEY, PROVIDER)

    // Creating a contract instance
    const ImageMint = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, WALLET)

    const tx = await ImageMint.requestNft("0x1f28d959C574c6e568e62489E688625AE8291FCa", tokenURI);
    const data = await waitForNftMintedEvent(ImageMint, tx.hash)
    res.send(data)
}


const waitForNftMintedEvent = async (contract, txHash) => {
  return new Promise((resolve, reject) => {
    contract.on("NftMinted", (tokenId, tokenOwner, event) => {
      console.log("event hash", event.transactionHash)
        if(event.log.transactionHash === txHash) resolve({tokenId: parseInt(tokenId), tokenOwner: tokenOwner.toString()})
    });
  });
};



module.exports = {
    uploadToIpfsAndMint
}