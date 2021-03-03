import AWS from 'aws-sdk';

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});
// upload photo to s3 bucket and returl url
export const uploadToS3 = async (file, userId, folderName) => {
  const { filename, createReadStream } = await file;
  const newFileName = `${folderName}/${userId}-${Date.now()}-${filename}`;
  const readStream = createReadStream();
  const { Location } = await new AWS.S3()
    .upload({
      Bucket: 'instaclone-image-uploads',
      Key: newFileName,
      ACL: 'public-read',
      Body: readStream,
    })
    .promise();
  return Location;
};
