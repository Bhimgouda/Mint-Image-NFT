const axios = require('axios')
const FormData = require('form-data')
const PINATA_JWT = `Bearer ${process.env.PINATA_SECRET_ACCESS_TOKEN}`

const uploadToIpfs = async(req,res)=>{
    const {name, description} = req.body
    const { buffer, originalname } = req.file;

    const formData = new FormData();
    formData.append("file", buffer, { filename: originalname });

    const imageUploadConfig = {
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        maxBodyLength: "Infinity",
        headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: PINATA_JWT
          }
    }
    const {IpfsHash} = (await axios(imageUploadConfig)).data;

    console.log("-----Uploaded image to Ipfs-----")
    
    var tokenUriJson = JSON.stringify({
        "pinataOptions": {
          "cidVersion": 1
        },
        "pinataMetadata": {
          "name": "testing",
          "keyvalues": {
          }
        },
        "pinataContent": {
          "name": name,
          "description": description,
          "image": `ipfs://${IpfsHash}`,
          "attributes": []
        }
    });

    const jsonUploadConfig = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': PINATA_JWT
        },
        data : tokenUriJson
    };
    
    const {data: tokenUri} = await axios(jsonUploadConfig);

    console.log("-----Uploaded tokenUri JSON")
    res.send(tokenUri)
}

module.exports = {
    uploadToIpfs
}