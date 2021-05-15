const { GraphQLSchema, GraphQLObjectType } = require('graphql');

// Import queries
const { perfil } = require('./queries');

// Import mutations
const { signUp, signIn } = require('./mutations');

// Define QueryType
const QueryType = new GraphQLObjectType({
    name: "QueryType",
    description: "Queries",
    fields: { perfil }
})

// Define MutationType
const MutationType = new GraphQLObjectType({
    name: "MutationType",
    description: "Mutations",
    fields: { signUp, signIn }
})

module.exports = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
})
