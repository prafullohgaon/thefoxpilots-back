const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "48h" });
    return token;
};

const getUserIdFromToken = (token) => {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken.userId;
};

module.exports = { generateToken, getUserIdFromToken };



// --------------------------------------------------------------------------------



// const jwt = require("jsonwebtoken")

// const SECRET_KEY="ksdjlkselkmalkmlkamlkmalmw"

// const generateToken = (userId)=>{
//     const token= jwt.sign({userId}, SECRET_KEY, {expiresIn: "48h"})
//     return token;
// }

// const getUserIdFromToken = (token)=>{
//     const decodedToken = jwt.verify(token, SECRET_KEY)
//     return decodedToken.userId;
// }

// module.exports = {generateToken, getUserIdFromToken}