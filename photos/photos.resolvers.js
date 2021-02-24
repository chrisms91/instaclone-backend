import client from '../client';

export default {
  Photo: {
    user: async ({ userId }) =>
      await client.user.findUnique({ where: { id: userId } }),
    hashtags: async ({ id }) =>
      await client.hashtag.findMany({
        where: {
          photos: {
            some: { id },
          },
        },
      }),
  },
};
