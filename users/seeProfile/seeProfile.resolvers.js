import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../../client';

export default {
  Query: {
    seeProfile: async (_, { userName }) =>
      await client.user.findUnique({
        where: {
          userName,
        },
      }),
  },
};
