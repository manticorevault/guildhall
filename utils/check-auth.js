const { AuthenticationError } = require("apollo-server");

const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");

module.exports = (context) => {
    const authHeader = context.req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split("Bearer ")[1];
        
        if(token) {
            try {
                const user = jwt.verify(token, SECRET);

                return user;
            } catch (err) {
                throw new AuthenticationError("The token is not valid anymore.")
            }
        }
        
        throw new Error("Authentication token should be properly formatted")
    }

    throw new Error ("Authorization header should be provided")
}