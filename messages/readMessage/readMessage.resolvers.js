import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

const resolverFn = async (_, { id }, { loggedInUser }) => {
  try {
    // check the message is not created by me
    // check user is in the room
    const message = await client.message.findFirst({
      where: {
        id,
        userId: {
          not: loggedInUser.id,
        },
        room: {
          users: {
            some: {
              id: loggedInUser.id,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });
    if (!message) return { ok: false, error: 'Message not found' };

    // update message
    await client.message.update({
      where: {
        id,
      },
      data: {
        read: true,
      },
    });

    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, error };
  }
};

export default {
  Mutation: {
    readMessage: protectedResolver(resolverFn),
  },
};
