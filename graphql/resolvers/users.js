const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { SECRET } = require("../../config");
const User = require("../../models/User");


module.exports = {
    Mutation: {
        async register(
            _, 
            { registerInput: { username, email, password, confirmPassword } }, 
        ) {
            // Create a user data validation

            // Checks if the user already exists
            const user = await User.findOne({ username });

            if (user) {
                throw new UserInputError("This username is already taken", {
                    errors: {
                        username: "This username is already taken"
                    }
                })
            }

            // Hashes the password before storage and create authtoken
            password = await bcrypt.hash(password, 12);

            const newUser = new User ({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const result = await newUser.save();

            const token = jwt.sign({
                id: result.id,
                email: result.email,
                username: result.username
            }, SECRET, { expiresIn: "1h" });

            return {
                ...result._doc,
                id: result._id,
                token
            }
        }
    }
}