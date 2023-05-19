const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config");

exports.createToken = (walletAddress)=>{
    try {
      const result = jwt.sign({walletAddress}, JWT_KEY, { expiresIn: "7d" });
      return result;
    } catch (error) {
      console.log("Something went wrong in token creation.");
      throw error;
    }
}


