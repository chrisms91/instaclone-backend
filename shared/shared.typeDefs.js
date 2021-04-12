import { gql } from 'apollo-server';

export default gql`
  type MutationResponse {
    id: Int
    ok: Boolean!
    error: String
  }
`;
