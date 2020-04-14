const s3 = new (require("aws-sdk").S3)();

async function write(key, dataObject) {
  return s3
    .putObject({
      Body: JSON.stringify(dataObject),
      Bucket: process.env.s3CacheBucket,
      Key: key,
    })
    .promise();
}

async function read(key) {
  try {
    const data = await s3
      .getObject({
        Bucket: process.env.s3CacheBucket,
        Key: key,
      })
      .promise();
    return JSON.parse(data["Body"].toString());
  } catch (error) {
    return null;
  }
}

module.exports = { read, write };
