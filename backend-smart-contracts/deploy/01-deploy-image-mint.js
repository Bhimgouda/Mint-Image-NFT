const {network, ethers} = require("hardhat");
const {developmentChains, networkConfig} = require("../helper-hardhat.config")
const {verify} = require("../utils/verify")

// hre = hardhat runtime environment gives all this arguments to deploy scripts

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log, get} = deployments
    const {deployer} = await getNamedAccounts()

    const args = []

    const ImageMint = await deploy("ImageMintTesting", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying.....")
        await verify(ImageMint.address, args)
    }
}

module.exports.tags = ["all", "imageMint", "main"]
