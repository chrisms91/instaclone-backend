import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

const resolverFn = async (_, { offset }, { loggedInUser }) =>
  await client.photo.findMany({
    take: 2,
    skip: offset,
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
