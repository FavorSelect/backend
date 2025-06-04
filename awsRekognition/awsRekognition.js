const AWS = require("aws-sdk");

const rekognition = new AWS.Rekognition({
  region: process.env.AWS_REGION_REKOGNITION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

/**
 * Extract labels from an image stored in S3 using AWS Rekognition.
 * @param {string} bucketName - The S3 bucket name.
 * @param {string} imageKey - The S3 object key (file path).
 * @returns {Promise<Array<string>>} - Returns an array of label names detected in the image.
 */
async function extractLabelsFromImageS3(bucketName, imageKey) {
  try {
    const params = {
      Image: {
        S3Object: {
          Bucket: bucketName,
          Name: imageKey,
        },
      },
      MaxLabels: 10,
      MinConfidence: 70,
    };

    const response = await rekognition.detectLabels(params).promise();

 
    const labels = response.Labels.map(label => label.Name);

    return labels;
  } catch (error) {
    console.error("Error extracting labels from image:", error);
    throw error;
  }
}

module.exports = {
  extractLabelsFromImageS3,
};
