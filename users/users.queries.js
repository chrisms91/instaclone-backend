export default {
  Query: {
    seeProfile: (_, { userName }) => {
      console.log(userName);
      return true;
    },
  },
};
