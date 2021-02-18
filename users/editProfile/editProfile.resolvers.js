import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import client from '../../client';

export default {
  Mutation: {
    editProfile: async (
      _,
      { firstName, lastName, userName, email, password: newPassword }
    ) => {
      try {
        let hashedPassword = null;
        if (newPassword) {
          hashedPassword = await bcrypt.hash(newPassword, 10);
        }
        const updatedUser = await client.user.update({
          // TODO
          // add authentication part to get the current user's id
          where: { id: 1 },
          data: {
            firstName,
            lastName,
            userName,
            email,
            ...(hashedPassword && { password: hashedPassword }), // the spread operator unpacks iterable object
          },
        });

        return updatedUser.id
          ? { ok: true }
          : { ok: false, error: 'Could not update profile.' };
      } catch (error) {
        console.log(error);
      }
    },
  },
};
