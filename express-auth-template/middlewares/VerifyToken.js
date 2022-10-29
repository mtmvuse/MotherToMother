// Imports the Firebase auth 
// Splits the authorization header ("Bearer <token>") 
// into an array and takes the second element, which is the token

const auth = require("../config/firebase-config");

const VerifyToken = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
  
    try {
        // Verifies the token and decodes it to get associated user data
        // check if decoded value is same as the user sending the request
        const decodeValue = await auth.verifyIdToken(token);
        if (decodeValue) {
            req.user = decodeValue;
            return next();
        }
    } catch (e) {
        return res.json({ message: "Internal Error" });
    }
};

module.exports = VerifyToken;