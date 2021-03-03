import jwt from 'jsonwebtoken';
import client from '../client';

export const getUser = async (token) => {
  try {
    if (!token) return null;

    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await client.user.findUnique({ where: { id } });

    if (!user) return null;

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// returning a function that it not called yet which is regular graphql resolver.
export function protectedResolver(resolver) {
  return function (parent, args, context, info) {
    if (!context.loggedInUser) {
      return {
        ok: false,
        error: 'Please login to perform this action.',
      };
    }

    return resolver(parent, args, context, info);
  };
}
