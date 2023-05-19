// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// Minting a custom NFT (using requestNFT) is 3x cheaper than the decentralized version
// As this contract is dependent on external server fo storing the mapping of tokenId to tokenURI

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ImageMintCentralized is ERC721, Ownable {
    using Strings for uint256;

    // NFT contract Metadata
    string private constant NAME = "ImageMintCentralized";
    string private constant SYMBOL = "IMC";

    // NFT state variables
    uint256 private s_tokenCounter;

    constructor() ERC721(NAME, SYMBOL) {}

    function requestNft(address nftOwner) external onlyOwner {
        _safeMint(nftOwner, s_tokenCounter);
        s_tokenCounter++;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "xyz.com/token/";
    }

    function tokenURI(
        uint tokenId
    ) public view override returns (string memory) {
        _requireMinted(tokenId);

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString()))
                : "";
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}