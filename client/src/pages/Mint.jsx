import { useState } from "react"
import axios from "axios";

const Mint = () => {
    const [imageFile, setImageFile] = useState()

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
        if(!imageFile) return console.log("Please upload a image")
        const {name, description} = event.target

        // When sending an encoded image we need to send it as multipart formData
        const formData = new FormData();


        // Appending the Data
        formData.append("image", imageFile)
        formData.append("name", name.value)
        formData.append("description", description.value)

        const { data } = await axios.post("http://localhost:5000/api/upload-to-ipfs", formData);
        console.log(data)
    }

    return ( 
        <div>
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
                <button type="submit">Mint Your NFT</button>
            </form>
        </div>
     );
}
 
export default Mint;