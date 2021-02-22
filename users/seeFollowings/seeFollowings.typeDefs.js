import { gql } from 'apollo-server';

export default gql`
  type SeeFollowingsResult {
    ok: Boolean!
    error: String
    followings: [User]
  }
  type Query {
    seeFollowings(userName: String!, lastId: Int): SeeFollowingsResult!
  }
`;
