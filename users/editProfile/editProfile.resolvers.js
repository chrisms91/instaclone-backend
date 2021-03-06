import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import client from '../../client';
import fs from 'fs';
import { protectedResolver } from '../users.utils';
import { uploadToS3 } from '../../shared/shared.utils';

const resolverFn = async (
  _,
  { firstName, lastName, userName, email, password: newPassword, bio, avatar },
  { loggedInUser }
) => {
  try {
    let avatarUrl = null;
    if (avatar) {
      // upload photo to s3 bucket
      avatarUrl = await uploadToS3(avatar, loggedInUser.id, 'avatars');

      /* const { filename, mimetype, createReadStream } = await avatar;
      const newFileName = `${loggedInUser.id}-${Date.now()}-${filename}`;
      const readStream = createReadStream();
      const writeStream = fs.createWriteStream(
        process.cwd() + '/uploads/' + newFileName
      );
      // it will be stored in the cloud on production.
      await readStream.pipe(writeStream);
      avatarUrl = `http://localhost:4000/static/${newFileName}`; */
    }

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
        bio,
        // check if hashedPassword exists then ... operator unpacks object
        ...(hashedPassword && { password: hashedPassword }),
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    });

    return updatedUser.id
      ? { ok: true }
      : { ok: false, error: 'Could not update profile.' };
  } catch (error) {
    console.log(error);
    return { ok: false, error: 'Could not update profile.' };
  }
};

export default {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};
