import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMoralis } from "react-moralis";
import Header from "../components/Header";
import heroImage from "../images/FKx-D_CWUAMVlg8.jpeg"
import NFTCard from "../components/NftCard";
import truncateStr from "../utils/truncate";
import Overlay from "../components/Overlay";
import toast, { Toaster } from 'react-hot-toast';

const Mint = () => {
  const { isWeb3Enabled, account, chainId, web3 } = useMoralis();
  const [imageFile, setImageFile] = useState();
  const [loading, setLoading] = useState(false);
  const [nft, setNft] = useState();
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      getNft(jwtToken);
    }
  }, []);

  useEffect(() => {
    handleNetworkSwitch();
  }, [isWeb3Enabled]);

  const handleNetworkSwitch = async () => {
    // Check if the current network is already Polygon
    if (chainId === "137") {
      toast.success("Already connected to Polygon network", ({
        "position": "top-right"
      }));
      return;
    }

    // Enable Web3 if not already enabled
    if (!isWeb3Enabled) {
      return;
    }

    // Switch to Polygon network or add Polygon and then switch
    async function switchToPolygon() {
      try {
        await web3.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x89" }],
        });
      } catch (error) {
        if (error.code === 4902) {
          try {
            await web3.provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x89",
                  chainName: "Polygon Mainnet",
                  rpcUrls: [
                    "https://polygon-mainnet.g.alchemy.com/v2/v5bVu3LW84m1q_CxAJLw2yW-qZKad2p4",
                  ],
                  nativeCurrency: {
                    name: "Matic",
                    symbol: "Matic",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://polygonscan.com/"],
                },
              ],
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    }

    switchToPolygon();
  };

  const getNft = async (jwtToken) => {
    const { data } = await axios.get("https://api-image-mint.bhim.me/api/get-nft", {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    setNft(data);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const maxSizeInBytes = 1048576; // 1MB

    if (file && file.size > maxSizeInBytes) {
      return toast.error(`Image File size exceeds 1MB`, {
        position: "top-right"
      });
    }
    setImageFile(file);
    toast.success("File size within limits", {
      position: "top-right"
    });
  };

  const handleFileSubmit = async (event) => {
    event.preventDefault();
    if (!isWeb3Enabled || parseInt(chainId) !== 137) return;
    if (loading) return console.log("Loading");
    const { name, description } = event.target;
    
    if (!imageFile) return toast.error("Please upload an image",{
      position: "top-right"
    });
    else if(!name.value) return toast.error("Please Add a Name",{
      position: "top-right"
    });
    else if(!description.value) return toast.error("Please Add a Small description",{
      position: "top-right"
    });


    // When sending an encoded image, send it as multipart formData
    const formData = new FormData();

    // Append the data
    formData.append("image", imageFile);
    formData.append("name", name.value);
    formData.append("description", description.value);
    formData.append("walletAddress", account);

    setLoading(true);
    const { data } = await axios.post(
      "https://api-image-mint.bhim.me/api/mint-nft",
      formData
    );
    localStorage.setItem("jwtToken", data.jwtToken);
    setNft(data.tokenData);
    setLoading(false);
  };

  const handleDragOver = (event) => {
  event.preventDefault();
  setDragOver(true);
  };
  
  const handleDragLeave = () => {
  setDragOver(false);
  };
  
  const handleDrop = (event) => {
  event.preventDefault();
  setDragOver(false);
  const droppedFile = event.dataTransfer.files[0];
  setImageFile(droppedFile);
  };
  
  return (
    <>
      <Header />
      <Toaster />
      <div className="app">
        {isWeb3Enabled ? (
          !loading ? (
            nft ? (
              <div className="app__mint">
                <div className="hero">
                  <h2>Here is your Custom NFT</h2>
                  <div>
                    <p style={{ textAlign: "center", fontWeight: "bold", color: 'white' }}>For Wallet</p>
                    <p>{truncateStr(nft.nftOwner, 25)}</p>
                    <p style={{ textAlign: "center", fontWeight: "bold", color: 'white' }}>On Polygon Network</p>
                    <p style={{ marginTop: "50px", color: "whitesmoke" }}>
                      Now You Can, <br />
                      Add it OpenSea <br />
                      Add it to Metamask <br />
                      Using the Nft Contract Address <br />
                      & TokenId
                    </p>
                  </div>
                </div>
                <div className="nft-card-container">
                  <NFTCard nft={nft} />
                </div>
              </div>
            ) : (
              parseInt(chainId) === 137 ? (
                <div className="app__mint">
                  <div className="hero">
                    <img className="hero-image" src={heroImage} alt="" />
                    <h2 style={{fontSize: "31px", textAlign: "center"}}>Get Your Custom NFTs In Seconds</h2>
                  </div>
                  <form className="form" onSubmit={handleFileSubmit}>
                    <div className="input-wrapper">
                      <label htmlFor="name" className="input-label">Name</label>
                      <input name="name" id="name" className="input-field" />
                    </div>
                    <div className="input-wrapper">
                      <label htmlFor="description" className="input-label">Description</label>
                      <input name="description" id="description" className="input-field" />
                    </div>
                    <div
                      className={`drag-drop-area ${dragOver ? "drag-over" : ""}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <label htmlFor="image" className="file-label">
                        <span className="plus-icon">+</span>
                        {imageFile ? (
                          <span className="file-text">{imageFile.name}</span>
                        ) : (
                          <span className="file-text">No Image file</span>
                        )}
                        <input
                          accept=".jpg,.jpeg,.png"
                          type="file"
                          onChange={handleFileChange}
                          name="image"
                          id="image"
                          className="file-input"
                        />
                      </label>
                    </div>
                    <p>:Image file should be less than 1MB***</p>
                    <button className="btn" disabled={loading} type="submit">
                      Mint Your NFT
                    </button>
                  </form>
                </div>
              ) : (
                <h2 className="notice">Please Switch to Polygon network</h2>
              )
            )
          ) : (
            <Overlay loading={loading} />
          )
        ) : (
          <h2 className="notice">Please Connect your Wallet</h2>
        )}
      </div>
    </>
  );
}  
  
export default Mint;