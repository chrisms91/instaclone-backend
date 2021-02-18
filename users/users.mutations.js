import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../client';

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

    login: async (_, { userName, password }) => {
      try {
        const user = await client.user.findFirst({ where: { userName } });
        if (!user) {
          return { ok: false, error: 'User not found.' };
        }

        const passwordOk = await bcrypt.compare(password, user.password);
        if (!passwordOk) {
          return { ok: false, error: 'Incorrect Password.' };
        }

        // issue a token and send it to the user
        const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
        return { ok: true, token };
      } catch (error) {
        console.log(error);
      }
    },
  },
};
