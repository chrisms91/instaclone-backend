import client from '../../client';

export default {
  Query: {
    seeFollowings: async (_, { userName, lastId }) => {
      const ok = await client.user.findUnique({
        where: { userName },
        select: { id: true },
      });
      if (!ok) {
        return { ok: false, error: 'User not found' };
      }

      const followings = await client.user
        .findUnique({ where: { userName } })
        .followings({
          take: 5,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
        });

      return {
        ok: true,
        followings,
      };
    },
  },
};
