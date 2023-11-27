// mutations.js
import { gql } from '@apollo/client';
// fix mutations to export each
export const LOGIN_USER = ggl`
mutation loginUser($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      username
    }
  }
}
`;

export const ADD_USER = qql`
mutation addUser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
    user {
      _id
      username
    }
  }
}`



SAVE_BOOK = gql`
  mutation SaveBook($bookToSave: bookInput) {
saveBook(bookToSave: $bookToSave) {
  _id
  username
  bookCount
  saveBooks {
    bookId
    authors
    description
    title
    image
    link
  }
}
  }`;

 export const REMOVE_BOOK = qql`
 mutation removeBook($bookId: ID!) {
  removeBook(bookId: $bookId) {
    _id
    username
    email
    bookCount
    savedBooks {
      bookId
      authors
      title
      description
      image
      link
    }
  }
 }`