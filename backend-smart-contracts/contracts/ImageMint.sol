// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error ImageMint__MaxTokenSupplyReached();

contract ImageMint is ERC721, Ownable {
    // NFT contract Metadata
    string private constant NAME = "ImageMint";
    string private constant SYMBOL = "IMT";

    // NFT state variables
    string[50] private s_tokenUris;
    uint256 private s_tokenCounter;

    // Events
    event NftMinted(uint256 tokenId, address nftOwner);

    constructor() ERC721(NAME, SYMBOL) {}

    function requestNft(
        address nftOwner,
        string memory tokenUri
    ) external onlyOwner {
        uint256 tokenId = s_tokenCounter;
        if (tokenId >= 50) {
            revert ImageMint__MaxTokenSupplyReached();
        }
        _safeMint(nftOwner, tokenId);
        s_tokenUris[tokenId] = tokenUri;
        s_tokenCounter++;

        emit NftMinted(tokenId, nftOwner);
    }

    function tokenURI(
        uint tokenId
    ) public view override returns (string memory) {
        return s_tokenUris[tokenId];
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
