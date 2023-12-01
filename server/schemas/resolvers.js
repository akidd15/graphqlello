const { User, Book } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');


const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({
          _id: context.user._id
        }).select("-__v -password").populate("savedBooks");
        return userData;
      }
      throw AuthenticationError('Error message');
    },

  },
  Mutation: {
    //loginUser
    login: async (parent, { email, password }) => {
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
  addUser: async (parent, { username, email, password }) => {
    const user = await User.create({ username, email, password });
    const token = signToken(user);
    return { token, user };
  },


  saveBook: async (parent, { bookToSave }, context) => {
    if (context.user) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: bookToSave } },
        { new: true },
      ).populate("savedBooks");
      return updatedUser;
    }
    throw AuthenticationError;
  },
  removeBook: async (parent, { bookId }, context) => {
    if (context.user) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true },
      )
      return updatedUser;
    } else {
      throw new UserInputError('Book is already saved.');
    }
  },
}

};
module.exports = resolvers;