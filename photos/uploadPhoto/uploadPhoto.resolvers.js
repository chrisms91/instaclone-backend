import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

const resolverFn = async (_, { file, caption }, { loggedInUser }) => {
  try {
    let hashtagObjs = null;
    if (caption) {
      // parse hashtag from caption
      const hashtags = caption.match(/#[\w]+/g);
      hashtagObjs = hashtags?.map((hashtag) => ({
        where: { hashtag },
        create: { hashtag },
      }));
    }
    // get or create Hashtags
    const newPhoto = await client.photo.create({
      data: {
        file,
        caption,
        user: {
          connect: {
            id: loggedInUser.id,
          },
        },
        ...(hashtagObjs && { hashtags: { connectOrCreate: hashtagObjs } }),
      },
    });

    return { ok: true, photo: newPhoto };
  } catch (error) {
    console.log(error);
    return { ok: false, error: 'Could not upload photo' };
  }
};

export default {
  Mutation: {
    uploadPhoto: protectedResolver(resolverFn),
  },
};
