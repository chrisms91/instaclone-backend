import client from '../../client';
import { protectedResolver } from '../users.utils';

const resolverFn = async (_, { userName }, { loggedInUser }) => {
  try {
    const targetUser = await client.user.findUnique({ where: { userName } });
    if (!targetUser) return { ok: false, error: 'That user does not exist.' };

    await client.user.update({
      where: {
        id: loggedInUser.id,
      },
      data: {
        followings: {
          disconnect: {
            userName,
          },
        },
      },
    });
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, error: 'Failed to unfollow.' };
  }
};

export default {
  Mutation: {
    unfollowUser: protectedResolver(resolverFn),
  },
};
