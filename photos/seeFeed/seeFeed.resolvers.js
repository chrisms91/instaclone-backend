import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

const resolverFn = async (_, __, { loggedInUser }) =>
  await client.photo.findMany({
    // find photos where the owners' followers list have my id
    where: {
      OR: [
        {
          user: {
            followers: {
              some: {
                id: loggedInUser.id,
              },
            },
          },
        },
        // or current user's photos
        {
          userId: loggedInUser.id,
        },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

export default {
  Query: {
    seeFeed: protectedResolver(resolverFn),
  },
};
