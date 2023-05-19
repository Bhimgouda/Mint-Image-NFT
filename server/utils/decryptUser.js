const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// This middleware is on each and every request to append user to request object
exports.decryptUser = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return next(); // req.userId will stay undefined
    try {
      const { walletAddress } = jwt.decode(token.split(" ")[1], JWT_SECRET);
      req.walletAddress = walletAddress;
      next();
    } catch (ex) {
      res.status(400).send("Invalid token.");
    }
};