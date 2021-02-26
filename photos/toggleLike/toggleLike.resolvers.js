import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

const resolverFn = async (_, { id }, { loggedInUser }) => {
  try {
    const targetPhoto = await client.photo.findUnique({ where: { id } });
    if (!targetPhoto) {
      return { ok: false, error: 'Photo not found' };
    }

    const like = await client.like.findUnique({
      where: {
        photoId_userId: {
          userId: loggedInUser.id,
          photoId: id,
        },
      },
    });

    if (like) {
      // delete
      await client.like.delete({
        where: {
          photoId_userId: {
            userId: loggedInUser.id,
            photoId: id,
          },
        },
      });
    } else {
      // create new like
      await client.like.create({
        data: {
          user: {
            connect: {
              id: loggedInUser.id,
            },
          },
          photo: {
            connect: {
              id: targetPhoto.id,
            },
          },
        },
      });
    }
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, error: 'ToggleLike failed' };
  }
};

export default {
  Mutation: {
    toggleLike: protectedResolver(resolverFn),
  },
};
