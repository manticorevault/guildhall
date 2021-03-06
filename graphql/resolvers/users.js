const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { validateRegisterInput, validateLoginInput } = require("../../utils/validators")
const { SECRET } = require("../../config");
const User = require("../../models/User");

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET, { expiresIn: "1h" });
}

module.exports = {
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);
            
            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }

            const user = await User.findOne({ username });

            if (!user) {
                errors.general = "User not found"
                throw new UserInputError("User not found", { errors });
            } 

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = "Wrong credentials"
                throw new UserInputError("Wrong credentials", { errors });
            }

            // Generate a token if the validation is sucessfully completed
            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }
        }, 
        async register(
            _, 
            { registerInput: { username, email, password, confirmPassword } }, 
        ) {
            // Create a user data validation
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }

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

            const token = generateToken(result);

            return {
                ...result._doc,
                id: result._id,
                token
            }
        }
    }
}