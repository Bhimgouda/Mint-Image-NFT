// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error ImageMintTesting__MaxTokenSupplyReached();

contract ImageMintTesting is ERC721, Ownable {
    // NFT contract Metadata
    string private constant NAME = "Testing";
    string private constant SYMBOL = "TEST";

    // NFT state variables
    string[50] private s_tokenUris;
    uint256 private s_tokenCounter;

    // Events
    event NftMinted(uint256 tokenId, address tokenOwner);

    constructor() ERC721(NAME, SYMBOL) {}

    function requestNft(
        address nftOwner,
        string memory tokenUri
    ) external onlyOwner {
        uint256 tokenId = s_tokenCounter;
        if (tokenId >= 50) {
            revert ImageMintTesting__MaxTokenSupplyReached();
        }
        _safeMint(nftOwner, tokenId);
        s_tokenUris[tokenId] = tokenUri;
        emit NftMinted(tokenId, nftOwner);
        s_tokenCounter++;
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
