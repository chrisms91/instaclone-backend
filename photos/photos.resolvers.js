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
    totalLikes: async ({ id }) =>
      await client.like.count({ where: { photoId: id } }),
    totalComments: async ({ id }) =>
      await client.comment.count({ where: { photoId: id } }),
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) return false;
      return userId === loggedInUser.id;
    },
  },

  Hashtag: {
    photos: async ({ id }, { page }) => {
      return await client.hashtag
        .findUnique({
          where: {
            id,
          },
        })
        .photos({
          take: 5,
          skip: (page - 1) * 5,
        });
    },
    totalPhotos: async (parent) =>
      await client.photo.count({
        where: {
          hashtags: {
            some: {
              id: parent.id,
            },
          },
        },
      }),
  },
};
