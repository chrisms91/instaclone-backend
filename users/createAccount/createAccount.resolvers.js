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
        const unix = Math.floor(new Date().getTime() / 1000);
        const newUser = await client.user.create({
          data: {
            userName,
            email,
            firstName,
            lastName,
            password: hashedPassword,
            avatar: `https://www.gravatar.com/avatar/${unix}?d=identicon`,
          },
        });

        return { ok: true };
      } catch (error) {
        console.log(error);
        return { ok: false, error: "Can't create new account." };
      }
    },
  },
};
