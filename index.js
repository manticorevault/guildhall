const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

// Import the type definitions
const typeDefs = require("./graphql/typeDefs");

// Import the resolvers
const resolvers = require("./graphql/resolvers");

//Import MongoDB data from config.js
const { MONGODB } = require("./config.js");



const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: ({ req }) => ({ req })
 });

 mongoose
    .connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log("MongoDB connected!")
        return  server.listen({ port: 5000 })
    })    
    .then(res => {
        console.log(`Server running at ${res.url}`)
    })
