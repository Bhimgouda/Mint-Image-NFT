
const { assert, expect } = require("chai")
const {network, deployments, ethers} = require("hardhat");
const {developmentChains} = require("../../helper-hardhat.config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("ImageMintTesting", function () {
        let imageMintTesting
        let deployer
        let addr1
      
        beforeEach(async function () {
            [deployer, addr1] = await ethers.getSigners();
            await deployments.fixture(["imageMint"])
            imageMintTesting = await ethers.getContract("ImageMintTesting");
        });
      
        it("should mint an NFT", async function () {
          const tokenUri = "https://example.com/token-uri";
          const requestTx = await imageMintTesting.requestNft(addr1.address, tokenUri);
          await requestTx.wait();
      
          const tokenCounter = await imageMintTesting.getTokenCounter();
          const tokenOwner = await imageMintTesting.ownerOf(tokenCounter - 1);
          assert.equal(tokenOwner, addr1.address)
      
          const tokenURI = await imageMintTesting.tokenURI(tokenCounter - 1);
          assert.equal(tokenURI, tokenUri)
        });
      
        it("should revert when exceeding max token supply", async function () {
          const tokenUri = "https://example.com/token-uri";
      
          // Mint 50 tokens
          for (let i = 0; i < 50; i++) {
            await imageMintTesting.requestNft(addr1.address, tokenUri);
          }
      
          // Attempt to mint one more token
          await expect(
            imageMintTesting.requestNft(addr1.address, tokenUri)
          ).to.be.revertedWith("ImageMintTesting__MaxTokenSupplyReached");
        });
      });