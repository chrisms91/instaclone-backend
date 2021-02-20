import client from '../../client';
import { protectedResolver } from '../users.utils';

const resolverFn = async (_, { userName }, { loggedInUser }) => {
  const targetUser = await client.user.findUnique({ where: { userName } });
  if (!targetUser) return { ok: false, error: 'That user does not exist.' };

  await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      followings: {
        connect: {
          // we can only connect by unique field (id, username..)
          userName,
        },
      },
    },
  });
  return { ok: true };
};

export default {
  Mutation: {
    followUser: protectedResolver(resolverFn),
  },
};
