const Wishlist = require('../../models/wishListModel/wishListModel');
const Product = require('../../models/productModel/productModel');

const addToWishlist = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product does not exist" });
    }

    const existing = await Wishlist.findOne({ where: { userId, productId } });
    if (existing) {
      return res.status(400).json({ success: false, message: "Product already in wishlist" });
    }

    const wishlistItem = await Wishlist.create({ userId, productId });
    res.status(201).json({ success: true, wishlistItem });
  } catch (error) {
    console.error("Add to Wishlist Error:", error);
    res.status(500).json({ success: false, message: "Server error while adding to wishlist", error: error.message });
  }
};

const getWishlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const wishlistItems = await Wishlist.findAll({
      where: { userId },
      include: [{ model: Product, as: 'Product' }], 
    });

    const wishlistCount = wishlistItems.length;

    res.status(200).json({ 
      success: true,
      wishlistCount,
      wishlist: wishlistItems 
    });
  } catch (error) {
    console.error("Get Wishlist Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while fetching wishlist",
      error: error.message 
    });
  }
};


const removeFromWishlist = async (req, res) => {
  const userId = req.user.id;
  const { wishlistIds } = req.body;

  if (!Array.isArray(wishlistIds) || wishlistIds.length === 0) {
    return res.status(400).json({ success: false, message: "Provide at least one wishlistId to remove." });
  }

  try {
    const deletedCount = await Wishlist.destroy({
      where: {
        id: wishlistIds,
        userId,
      },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ success: false, message: "No matching wishlist items found to delete." });
    }

    res.status(200).json({
      success: true,
      message: `Successfully removed ${deletedCount} wishlist item(s).`,
    });
  } catch (error) {
    console.error("Remove Wishlist Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while removing wishlist item(s)",
      error: error.message,
    });
  }
};


module.exports = { addToWishlist, getWishlist, removeFromWishlist };
