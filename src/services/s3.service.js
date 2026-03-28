const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");
const path = require("path");

exports.uploadToS3 = async (file, folder = "products") => {
  try {
    const fileName = Date.now() + path.extname(file.originalname);
    console.log(file.buffer, "file buffer");
    console.log(file.mimetype, "file mimetype");
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folder}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    /*
    body - <Buffer ff db ff e0...></Buffer>
    contentType -  image.jpg - image/jpeg, image.png - image/png
    */

    await s3.send(new PutObjectCommand(params));
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${folder}/${fileName}`;
  } catch (error) {
    console.log("Error uploading to S3:", error);
    throw error;
  }
};
