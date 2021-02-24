import client from '../../client';

export default {
  Query: {
    seePhoto: async (_, { id }) =>
      await client.photo.findUnique({ where: { id } }),
  },
};
