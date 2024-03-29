
const { gql } = require('graphql-tag');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int!
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input bookInput {
    authors: [String]
    description: String
    title: String
    bookId: String
    image: String
    link: String
}

  type Query {
    user: User
   
  }
  
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookToSave: bookInput): User
    removeBook(bookId: ID!): User
  }
  
`;

module.exports = typeDefs;
