const { GraphQLError } = require("graphql");
// added graphqlerror
const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  AuthenticationError: new GraphQLError("Could not authenticate user.", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }),
  authMiddleware: function (req, res, next) {
    // allows token to be sent via  req.query or headers
    let token = req.headers.authorization || req.body.token || req.query.token;



    if (!token) {
      return res.status(400).json({ message: 'You have no token!' });
    }

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      next();
      
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'invalid token!' });
    }

    return req;
  },
  // function to sign tokens
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  }
};
  // Middleware for graphql resolvers
//   graphqlAuthMiddleware: function (resolverFunction) {
//     return function (parent, args, context, info) {
//       if (!context.user) {
//         throw new Error('Authentication required for this resolver.');
//       }
//       return resolverFunction(parent, args, context, info);
//     };
//   },
// };
