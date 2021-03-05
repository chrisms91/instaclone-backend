import client from '../../client';
import { NEW_MESSAGE } from '../../constants';
import pubsub from '../../pubsub';
import { protectedResolver } from '../../users/users.utils';

const resolverFn = async (_, { payload, roomId, userId }, { loggedInUser }) => {
  let room = null;
  if (userId) {
    // sending message to a person for the first time (no roomId), so
    // check if user exists and create new room with the user
    const user = await client.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) return { ok: false, error: 'This user does not exist.' };

    room = await client.room.create({
      data: {
        users: {
          connect: [
            {
              id: userId,
            },
            {
              id: loggedInUser.id,
            },
          ],
        },
      },
    });
  } else if (roomId) {
    // I have already sent message to this person, no need to create a new room
    // find the existing room
    room = await client.room.findUnique({
      where: { id: roomId },
      select: { id: true },
    });
    if (!room) return { ok: false, error: 'Room not found' };
  }

  // create message
  const newMessage = await client.message.create({
    data: {
      payload,
      room: {
        connect: {
          id: room.id,
        },
      },
      user: {
        connect: {
          id: loggedInUser.id,
        },
      },
    },
  });

  // publish new message
  pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...newMessage } });
  return { ok: true };
};

export default {
  Mutation: {
    sendMessage: protectedResolver(resolverFn),
  },
};
