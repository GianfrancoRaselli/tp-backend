const jwt = require('jsonwebtoken');

const createJwtToken = (usuario) => {
    return jwt.sign({ _id: usuario._id }, process.env.TOKEN_SECRET || "tokentest");
}

module.exports = { createJwtToken }
