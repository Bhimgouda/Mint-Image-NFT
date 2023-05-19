require("dotenv").config()

module.exports = {
    JWT_KEY: process.env.JWT_KEY,
    JWT_SECRET: process.env.JWT_SECRET
}