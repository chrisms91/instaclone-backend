import client from '../../client';

const PAGE_SIZE = 5;
export default {
  Query: {
    // find target user and fetch follower records from it
    seeFollowers: async (_, { userName, page }) => {
      const ok = await client.user.findUnique({
        where: { userName },
        select: { id: true },
      });
      if (!ok) {
        return { ok: false, error: 'User not found' };
      }

      const followers = await client.user
        .findUnique({ where: { userName } })
        .followers({
          take: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE,
        });

      return {
        ok: true,
        followers,
      };
    },
  },
};
