import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

const resolverFn = async (_, { id }, { loggedInUser }) =>
  await client.room.findFirst({
    where: {
      id,
      users: {
        some: {
          id: loggedInUser.id,
        },
      },
    },
  });

export default {
  Query: {
    seeRoom: protectedResolver(resolverFn),
  },
};
