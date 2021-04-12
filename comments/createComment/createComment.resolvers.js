import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

const resolverFn = async (_, { photoId, payload }, { loggedInUser }) => {
  try {
    const targetPhoto = await client.photo.findUnique({
      where: {
        id: photoId,
      },
      select: {
        id: true,
      },
    });

    if (!targetPhoto) return { ok: false, error: 'Photo not found' };

    const newComment = await client.comment.create({
      data: {
        payload,
        photo: {
          connect: {
            id: photoId,
          },
        },
        user: {
          connect: {
            id: loggedInUser.id,
          },
        },
      },
    });

    return { ok: true, id: newComment.id };
  } catch (error) {
    console.log(error);
    return { ok: false, error };
  }
};

export default {
  Mutation: {
    createComment: protectedResolver(resolverFn),
  },
};
