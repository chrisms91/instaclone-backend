import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

const resolverFn = async (_, { id }, { loggedInUser }) => {
  try {
    const targetPhoto = await client.photo.findUnique({
      where: {
        id,
      },
      select: {
        userId: true,
      },
    });
    if (!targetPhoto) {
      return { ok: false, error: 'Photo not found' };
    } else if (targetPhoto.userId !== loggedInUser.id) {
      return { ok: false, error: 'Not authorized' };
    } else {
      await client.photo.delete({
        where: {
          id,
        },
      });
      return { ok: true };
    }
  } catch (error) {
    console.log(error);
    return { ok: false, error };
  }
};

export default {
  Mutation: {
    deletePhoto: protectedResolver(resolverFn),
  },
};
