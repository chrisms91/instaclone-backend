import client from '../../client';

export default {
  Query: {
    seePhotoComments: async (_, { id, page }) =>
      await client.comment.findMany({
        where: {
          photoId: id,
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: 5,
        skip: (page - 1) * 5,
      }),
  },
};
