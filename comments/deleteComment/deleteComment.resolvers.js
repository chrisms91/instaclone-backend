import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

const resolverFn = async (_, { id }, { loggedInUser }) => {
  try {
    const targetComment = await client.comment.findUnique({
      where: {
        id,
      },
      select: {
        userId: true,
      },
    });

    if (!targetComment) {
      return { ok: false, error: 'Comment not found' };
    } else if (targetComment.userId !== loggedInUser.id) {
      return { ok: false, error: 'Not authorized' };
    } else {
      // delete
      await client.comment.delete({
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
    deleteComment: protectedResolver(resolverFn),
  },
};
