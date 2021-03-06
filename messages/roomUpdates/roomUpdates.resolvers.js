import { withFilter } from 'apollo-server';
import { NEW_MESSAGE } from '../../constants';
import pubsub from '../../pubsub';
import client from '../../client';

export default {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        const room = await client.room.findFirst({
          where: {
            id: args.id,
            users: {
              some: {
                id: context.loggedInUser.id,
              },
            },
          },
          select: {
            id: true,
          },
        });
        if (!room) {
          throw new Error('You shall not see this');
        }

        return withFilter(
          // you can only see the messages of the room that you are listening to
          () => pubsub.asyncIterator(NEW_MESSAGE),
          async ({ roomUpdates }, { id }, { loggedInUser }) => {
            if (roomUpdates.roomId === id) {
              const room = await client.room.findFirst({
                where: {
                  id,
                  users: {
                    some: {
                      id: loggedInUser.id,
                    },
                  },
                },
                select: {
                  id: true,
                },
              });
              if (!room) return false;
              return true;
            }
            return false;
          }
        )(root, args, context, info);
      },
    },
  },
};
