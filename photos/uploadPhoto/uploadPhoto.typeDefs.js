import { gql } from 'apollo-server';

export default gql`
  type UploadPhotoResult {
    ok: Boolean!
    error: String
    photo: Photo
  }
  type Mutation {
    uploadPhoto(file: Upload!, caption: String): UploadPhotoResult!
  }
`;
