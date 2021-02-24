import client from '../../client';

export default {
  Query: {
    searchUsers: async (_, { keyword, page }, { pageSize }) => {
      const users = await client.user.findMany({
        where: {
          userName: {
            startsWith: keyword.toLowerCase(),
          },
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

      return users;
    },
  },
};
