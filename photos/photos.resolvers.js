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
    comments: ({ id }) =>
      client.comment.findMany({
        where: { photoId: id },
        include: { user: true },
      }),
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) return false;
      return userId === loggedInUser.id;
    },
    isLiked: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) return false;

      // check if loggedInUser liked this photo.
      const ok = await client.like.findUnique({
        where: {
          photoId_userId: {
            photoId: id,
            userId: loggedInUser.id,
          },
        },
        select: {
          id: true,
        },
      });

      if (ok) return true;
      return false;
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
