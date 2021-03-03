import client from '../../client';
import { uploadToS3 } from '../../shared/shared.utils';
import { protectedResolver } from '../../users/users.utils';
import { processHashtags } from '../photos.utils';

const resolverFn = async (_, { file, caption }, { loggedInUser }) => {
  try {
    let hashtagObjs = [];
    if (caption) {
      // parse hashtag from caption
      hashtagObjs = processHashtags(caption);
    }
    const fileUrl = await uploadToS3(file, loggedInUser.id, 'uploads');
    // get or create Hashtags
    const newPhoto = await client.photo.create({
      data: {
        file: fileUrl,
        caption,
        user: {
          connect: {
            id: loggedInUser.id,
          },
        },
        ...(hashtagObjs.length > 0 && {
          hashtags: { connectOrCreate: hashtagObjs },
        }),
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
