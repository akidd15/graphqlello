const  { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('./auth.js'); 

const resolvers = {
    Query: {
      user: async (parent, args, context) => {
       if (context.user) {
        const userData = await User.findOne({ _id: context.user._id
        }).select("-_v-password").populate("savedBooks");
        return userData;
       }
       throw AuthenticationError;
      },
    
    },
    Mutation: {
      registerUser: async (parent, { username, email, password}) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      },
  
      loginUser: async (parent, { email, password }) => {
          const user = await User.findOne({ email });
 
          if (!user) {
            throw new AuthenticationError('Invalid credentials');
          }
  
          const correctPassword = await user.isCorrectPassword(password);
  
          if (!correctPassword) {
            throw new AuthenticationError('Invalid credentials');
          }
  
          const token = signToken(user);
          return { token, user };
       
      },
      saveBook: async (parent, { bookToSave }, context) => {
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: bookToSave }},
                { new: true },
            ).populate("saved books");
            return updatedUser;
        }
        throw AuthenticationError;
      },
      removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId }}},
                { new: true },
            )
            return updatedUser;
        }
      }
    
    },
  };

  
  module.exports = resolvers;