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

const handleAddWeeklyPromotionBanner = async (req, res) => {
  try {
    const { title } = req.body;
    const imageFile = req.file;
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an image" });
    }
    const imageURL = imageFile.location;

    const banner = await WeeklyPromotion.create({
      title,
      image: imageURL,
    });

    return res.status(201).json({
      success: true,
      message: "Image added successfully",
      banner,
    });
  } catch (error) {
    console.error("Error in handleAddWeeklyPromotionBanner:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const handleAddThePopularBanner = async (req, res) => {
  try {
    const { title } = req.body;
    const imageFile = req.file;
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an image" });
    }
    const imageURL = imageFile.location;

    const banner = await ThePopular.create({
      title,
      image: imageURL,
    });

    return res.status(201).json({
      success: true,
      message: "Image added successfully",
      banner,
    });
  } catch (error) {
    console.error("Error in handleAddThePopularBanner:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const handleAddBrandAdsPosterBanner = async (req, res) => {
  try {
    const { title } = req.body;
    const imageFile = req.file;
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an image" });
    }
    const imageURL = imageFile.location;

    const banner = await BrandPoster.create({
      title,
      image: imageURL,
    });

    return res.status(201).json({
      success: true,
      message: "Image added successfully",
      banner,
    });
  } catch (error) {
    console.error("Error in handleAddBrandPosterBanner:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const handleAddProductPosterAdsBanner = async (req, res) => {
  try {
    const { title } = req.body;
    const imageFile = req.file;
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an image" });
    }
    const imageURL = imageFile.location;

    const banner = await ProductPosterAds.create({
      title,
      image: imageURL,
    });

    return res.status(201).json({
      success: true,
      message: "Image added successfully",
      banner,
    });
  } catch (error) {
    console.error("Error in handleAddProductPosterAdsBanner:", error);
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
      message: "Last 5 Homepage banners fetched successfully",
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

const getWeeklyPromotionBanners = async (req, res) => {
  try {
    const banners = await WeeklyPromotion.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    return res.status(200).json({
      success: true,
      message: "Last 5 Weekly Promotion banners fetched successfully",
      banners,
    });
  } catch (error) {
    console.error("Error in getWeeklyPromotionBanners:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const getThePopularBanners = async (req, res) => {
  try {
    const banners = await ThePopular.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    return res.status(200).json({
      success: true,
      message: "Last 5 The Popular banners fetched successfully",
      banners,
    });
  } catch (error) {
    console.error("Error in getThePopularBanners:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getBrandPosterBanners = async (req, res) => {
  try {
    const banners = await BrandPoster.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    return res.status(200).json({
      success: true,
      message: "Last 5 Brand Poster banners fetched successfully",
      banners,
    });
  } catch (error) {
    console.error("Error in getBrandPosterBanners:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const getProductPosterAdsBanners = async (req, res) => {
  try {
    const banners = await ProductPosterAds.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    return res.status(200).json({
      success: true,
      message: "Last 5 Product Poster Ads banners fetched successfully",
      banners,
    });
  } catch (error) {
    console.error("Error in getProductPosterAdsBanners:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




module.exports = {
  handleAddHomepageBanner,
  handleAddWeeklyPromotionBanner,
  handleAddThePopularBanner,
  handleAddBrandAdsPosterBanner,
  handleAddProductPosterAdsBanner,
    getProductPosterAdsBanners,
      getHomepageBanners,
        getThePopularBanners,
         getWeeklyPromotionBanners,
          getBrandPosterBanners,
};
