const Logo = require("../../../models/advertisementModel/websiteAdvertisement/logoModel");

const handleAddLogo = async (req, res) => {
  try {
    const imageFile = req.file;
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an image" });
    }
    const imageURL = imageFile.location;
    const logo = await Logo.create({
      image: imageURL,
    });

    return res.status(201).json({
      success: true,
      message: "Image added successfully",
      logo,
    });
  } catch (error) {
    console.error("Error in handleAdding Logo:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { handleAddLogo };
