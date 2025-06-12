const express = require("express");
const {
  handleAddHomepageBanner,
  getHomepageBanners,
  handleAddWeeklyPromotionBanner,
  handleAddThePopularBanner,
  handleAddBrandAdsPosterBanner,
  handleAddProductPosterAdsBanner,
  getWeeklyPromotionBanners,
  getThePopularBanners,
  getBrandPosterBanners,
  getProductPosterAdsBanners,
} = require("../../controllers/advertiseController/websiteAdvertisement/Banner");
const router = express.Router();
const checkForAuthenticationCookie = require("../../authMiddleware/authMiddleware");
const { authorizeRoles } = require("../../authMiddleware/roleMiddleware");
const upload = require('../../awsS3Connection/awsUploadMiddleware')

router.post(
  "/add-homepage-banners",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  upload.single('image'),
  handleAddHomepageBanner
);
router.post(
  "/add-weekly-banners",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  upload.single('image'),
  handleAddWeeklyPromotionBanner
);
router.post(
  "/add-popular-banners",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  upload.single('image'),
 handleAddThePopularBanner
);
router.post(
  "/add-brand-banners",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  upload.single('image'),
 handleAddBrandAdsPosterBanner
);
router.post(
  "/add-product-banners",
  checkForAuthenticationCookie("token"),
  authorizeRoles(["admin", "admin+", "superadmin"]),
  upload.single('image'),
  handleAddProductPosterAdsBanner
);
router.get("/homepage-banners", getHomepageBanners);
router.get("/weekly-banners", getWeeklyPromotionBanners);
router.get("/popular-banners", getThePopularBanners);
router.get("/brands-banners", getBrandPosterBanners);
router.get("/products-banners", getProductPosterAdsBanners);
module.exports = router;
