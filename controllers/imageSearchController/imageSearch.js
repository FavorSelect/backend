const { extractLabelsFromImageS3 } = require("../../awsRekognition/awsRekognition");
const Product = require("../../models/productModel/productModel");
const { Op } = require("sequelize");

const handleImageSearch = async (req, res) => {
  try {
    if (!req.file || !req.file.key) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const s3Key = req.file.key;

    const labels = await extractLabelsFromImageS3(process.env.AWS_BUCKET_NAME, s3Key);

    if (!labels || labels.length === 0) {
      return res.status(200).json({ success: true, message: "No labels detected", products: [] });
    }

  
    const allProducts = await Product.findAll({
      where: {
        status: "approved",
        rekognitionLabels: { [Op.ne]: null } 
      }
    });

    const normalizedLabels = labels.map(l => l.toLowerCase());

    const matchedProducts = allProducts.filter(product => {
      const productLabels = Array.isArray(product.rekognitionLabels)
        ? product.rekognitionLabels.map(l => l.toLowerCase())
        : [];
      return normalizedLabels.some(label => productLabels.includes(label));
    });

    return res.status(200).json({
      success: true,
      matchedLabels: labels,
      products: matchedProducts,
    });
  } catch (err) {
    console.error("Image search error:", err);
    return res.status(500).json({
      success: false,
      message: "Image search failed",
      error: err.message,
    });
  }
};

module.exports = { handleImageSearch };
