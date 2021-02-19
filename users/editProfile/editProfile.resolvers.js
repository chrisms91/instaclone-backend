import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import client from '../../client';
import { protectedResolver } from '../users.utils';

const resolverFn = async (
  _,
  { firstName, lastName, userName, email, password: newPassword },
  { loggedInUser, protectResolver }
) => {
  try {
    console.log('currently loggedIn user');
    console.log(loggedInUser);
    let hashedPassword = null;
    if (newPassword) {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }
    const updatedUser = await client.user.update({
      where: { id: loggedInUser.id },
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
};

export default {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};
