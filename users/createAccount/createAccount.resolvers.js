import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../../client';

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, userName, email, password }
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [{ userName }, { email }],
          },
        });

        if (existingUser) {
          throw new Error('This username/email is already taken.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await client.user.create({
          data: {
            userName,
            email,
            firstName,
            lastName,
            password: hashedPassword,
          },
        });

        return newUser;
      } catch (error) {
        return error;
      }
    },
  },
};
