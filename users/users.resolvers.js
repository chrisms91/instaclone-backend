import client from '../client';

export default {
  User: {
    // count how many users have my id on their followers list.
    totalFollowings: ({ id }) =>
      client.user.count({
        where: {
          followers: {
            some: { id },
          },
        },
      }),
    // count how many users have my id on their followings list
    totalFollowers: ({ id }) =>
      client.user.count({
        where: {
          followings: {
            some: { id },
          },
        },
      }),
    // is current user following this user?
    isFollowing: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) return false;

      // get current loggedIn user's following list and check if the user's id taht we're looking at is on the list.
      const exists = await client.user.count({
        where: {
          userName: loggedInUser.userName,
          followings: {
            some: { id },
          },
        },
      });

      return exists !== 0;
    },
    // check if the user's id that we are looking at (parent) is same as loggedIn user's id (context)
    isMe: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) return false;
      return id === loggedInUser.id;
    },
  },
};
