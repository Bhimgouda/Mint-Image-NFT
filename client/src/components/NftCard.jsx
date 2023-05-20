

const NFTCard = ({ nft }) => {
  return (
    <div className="nft-card">
        <p className="nft-name">{nft.name}</p>
        <p className="nft-description">{nft.description}</p>
      <div className="nft-image-container">
        <img src={nft.imageUri} alt="" className="nft-image" />
      </div>
      <div className="nft-details">
        <div className="nft-info">
          <p className="nft-info-label">NFT Contract Address:</p>
          <p className="nft-info-value">{nft.nftAddress}</p>
        </div>
        <div className="nft-info">
          <p className="nft-info-label">Token ID:</p>
          <p className="nft-info-value">{nft.tokenId}</p>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
