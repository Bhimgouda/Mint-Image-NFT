import { useEffect, useState } from "react"
import axios from "axios";
import {useMoralis} from "react-moralis"
import Header from "../components/Header";

const Mint = () => {
    const {isWeb3Enabled, account, chainId} = useMoralis()
    const [imageFile, setImageFile] = useState()
    const [loading, setLoading] = useState(false)
    const [nft, setNft] = useState()

    useEffect(()=>{
        const jwtToken = localStorage.getItem("jwtToken")
        if(jwtToken){
            getNft(jwtToken)
        }
    }, [])

    const getNft = async (jwtToken)=>{
        const {data} = await axios.get("http://localhost:5000/api/get-nft",{
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        setNft(data)
    }

    const handleFileChange = (event)=>{
        const file = event.target.files[0]
        const maxSizeInBytes = 1048576; //1MB

        if(file && file.size > maxSizeInBytes){
            return console.log("File size exceeds")
        }
        setImageFile(file)
        console.log("File size within limits")
    }

    const handleFileSubmit = async(event)=>{
        event.preventDefault()
        if(loading) return console.log("loading")

        if(!imageFile) return console.log("Please upload a image")
        const {name, description} = event.target

        // When sending an encoded image we need to send it as multipart formData
        const formData = new FormData();

        // Appending the Data
        formData.append("image", imageFile)
        formData.append("name", name.value)
        formData.append("description", description.value)
        formData.append("walletAddress", account)

        setLoading(true)
        const { data } = await axios.post("http://localhost:5000/api/mint-nft", formData);
        localStorage.setItem("jwtToken", data.jwtToken)
        setNft(data.tokenData)
        setLoading(false)
    }

    return ( 
        <div>
            <Header />
            {nft? <div>
                <p>{nft.address}</p>
                <p>{nft.name}</p>
                <p>{nft.description}</p>
                <p>{nft.nftAddress}</p>
                <p>{nft.tokenId}</p>
                <img src={nft.imageUri} alt="" />
            </div>
            :   
            isWeb3Enabled ?             
            <form onSubmit={handleFileSubmit}>
            <div>
                <label htmlFor="image">Upload image files:less than 1mb</label>
                <input accept=".jpg,.jpeg,.png" type="file" onChange={handleFileChange} name="image" id="image" />
            </div>
            <div>
                <label htmlFor="name">Name</label>
                <input name="name" id="name" />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <input name="description" id="description" />
            </div>
            <button disabled={loading} type="submit">Mint Your NFT</button>
            </form> : null
            }
        </div>
     );
}
 
export default Mint;