import client from '../../client';

export default {
  Query: {
    seeHashtag: async (_, { hashtag }) =>
      await client.hashtag.findUnique({
        where: { hashtag },
      }),
  },
};

// need to fetch list of photos with hashtag
// and totalPhotos
