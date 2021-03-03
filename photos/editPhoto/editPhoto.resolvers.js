import client from '../../client';
import { protectedResolver } from '../../users/users.utils';
import { processHashtags } from '../photos.utils';

const resolverFn = async (_, { id, caption }, { loggedInUser }) => {
  try {
    const targetPhoto = await client.photo.findFirst({
      where: {
        id,
        userId: loggedInUser.id,
      },
      include: {
        hashtags: {
          select: {
            hashtag: true,
          },
        },
      },
    });
    console.log(targetPhoto);
    if (!targetPhoto) {
      return { ok: false, error: "Couldn't find the photo" };
    }

    const updatedPhoto = await client.photo.update({
      where: {
        id,
      },
      data: {
        caption,
        hashtags: {
          disconnect: targetPhoto.hashtags,
          connectOrCreate: processHashtags(caption),
        },
      },
    });

    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, error };
  }
};

export default {
  Mutation: {
    editPhoto: protectedResolver(resolverFn),
  },
};
