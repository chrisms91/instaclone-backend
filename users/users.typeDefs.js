import { gql } from 'apollo-server';

export default gql`
  type User {
    id: Int!
    firstName: String!
    lastName: String
    userName: String!
    email: String!
    bio: String
    avatar: String
    createdAt: String!
    updatedAt: String!
    followings: [User]
    followers: [User]
    # computed fields
    totalFollowings: Int!
    totalFollowers: Int!
    isFollowing: Boolean!
    isMe: Boolean!
  }
`;
