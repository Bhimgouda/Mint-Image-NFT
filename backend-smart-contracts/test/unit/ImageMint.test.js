
const { assert, expect } = require("chai")
const {network, deployments, ethers} = require("hardhat");
const {developmentChains} = require("../../helper-hardhat.config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("ImageMint", function () {
        let imageMint
        let deployer
        let addr1
      
        beforeEach(async function () {
            [deployer, addr1] = await ethers.getSigners();
            await deployments.fixture(["imageMint"])
            imageMint = await ethers.getContract("ImageMint");
        });
      
        it("should mint an NFT", async function () {
          const tokenUri = "https://example.com/token-uri";
          const requestTx = await imageMint.requestNft(addr1.address, tokenUri);
          await requestTx.wait();
      
          const tokenCounter = await imageMint.getTokenCounter();
          const nftOwner = await imageMint.ownerOf(tokenCounter - 1);
          assert.equal(nftOwner, addr1.address)
      
          const tokenURI = await imageMint.tokenURI(tokenCounter - 1);
          assert.equal(tokenURI, tokenUri)
        });
      
        it("should revert when exceeding max token supply", async function () {
          const tokenUri = "https://example.com/token-uri";
      
          // Mint 50 tokens
          for (let i = 0; i < 50; i++) {
            await imageMint.requestNft(addr1.address, tokenUri);
          }
      
          // Attempt to mint one more token
          await expect(
            imageMint.requestNft(addr1.address, tokenUri)
          ).to.be.revertedWith("ImageMint__MaxTokenSupplyReached");
        });
      });