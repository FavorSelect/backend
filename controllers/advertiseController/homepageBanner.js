const HomepageBanner = require("../../models/advertisementModel/homepageBanner");

const handleAddHomepageBanner = async (req, res) => {
  try {
    const { title } = req.body;
    const imageFile = req.file;
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an image" });
    }
    const imageURL = imageFile.location;

    const banner = await HomepageBanner.create({
      title,
      image: imageURL,
    });

    return res.status(201).json({
      success: true,
      message: "Image added successfully",
      banner,
    });
  } catch (error) {
    console.error("Error in handleAddHomepageBanner:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getHomepageBanners = async (req, res) => {
  try {
    const banners = await HomepageBanner.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    return res.status(200).json({
      success: true,
      message: "last 5 banners Homepage banners fetched successfully",
      banners,
    });
  } catch (error) {
    console.error("Error in getHomepageBanners:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { handleAddHomepageBanner, getHomepageBanners };
