import bcrypt from 'bcrypt';
import client from '../client';

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, userName, email, password }
    ) => {
      const existingUser = await client.user.findFirst({
        where: {
          OR: [{ userName }, { email }],
        },
      });
      console.log(existingUser);
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
    },
  },
};
