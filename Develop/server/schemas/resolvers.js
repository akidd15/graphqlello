const User = require('./models/User.js');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('./auth.js'); 

const resolvers = {
    Query: {
      getUser: async (_, { userId }) => {
        try {
          const user = await User.findById(userId);
          return user;
        } catch (error) {
          throw new Error('Error getting user: ' + error.message);
        }
      },
    
    },
    Mutation: {
      registerUser: async (_, { userInput }) => {
        const { username, email, password } = userInput;
  
        try {
          const existingUser = await User.findOne({ email });
  
          if (existingUser) {
            throw new Error('User with this email already exists');
          }
  
          const newUser = new User({ username, email, password });
          await newUser.save();
  
          const token = signToken(newUser);
          return { token, user: newUser };
        } catch (error) {
          throw new Error('Error registering user: ' + error.message);
        }
      },
  
      loginUser: async (_, { email, password }) => {
        try {
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
        } catch (error) {
          throw new Error('Error logging in: ' + error.message);
        }
      },
    
    },
  };
  
  module.exports = resolvers;