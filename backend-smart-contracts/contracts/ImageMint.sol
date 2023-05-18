// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Testing is ERC721, Ownable {
    // NFT contract Metadata
    string private constant NAME = "Testing";
    string private constant SYMBOL = "TST";

    // NFT state variables
    uint256 private s_tokenCounter;
    string[] private s_tokenUris = new string[](0);

    constructor() ERC721(NAME, SYMBOL) {}

    function requestNft(
        address nftOwner,
        string memory tokenUri
    ) external onlyOwner {
        uint256 tokenId = s_tokenCounter;
        _safeMint(nftOwner, tokenId);
        s_tokenUris.push(tokenUri);
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
