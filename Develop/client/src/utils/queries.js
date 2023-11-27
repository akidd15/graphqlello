import { ggl } from "@apollo/client";

export const GET_ME = ggl`
{
    user {
        _id
        username
        email
        bookCount
        savedBooks {
            bookId
            authors
            description
            title
            image
            link
        }
    }
}`;