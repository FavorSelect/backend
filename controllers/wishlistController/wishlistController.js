const Wishlist = require('../../models/wishListModel/wishListModel');
const Product = require('../../models/productModel/productModel');

const addToWishlist = async (req, res) => {
  const userId = req.user.id; 
  const { productId } = req.body;

  try {
    // Check if already exists
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
      include: [{ model: Product, as: 'product' }],
    });

    res.status(200).json({ success: true, wishlist: wishlistItems });
  } catch (error) {
    console.error("Get Wishlist Error:", error);
    res.status(500).json({ success: false, message: "Server error while fetching wishlist", error: error.message });
  }
};


const removeFromWishlist = async (req, res) => {
  const userId = req.user.id;
  const { wishlistId } = req.params;

  try {
    const wishlistItem = await Wishlist.findOne({ where: { id: wishlistId, userId } });

    if (!wishlistItem) {
      return res.status(404).json({ success: false, message: "Wishlist item not found" });
    }

    await wishlistItem.destroy();
    res.status(200).json({ success: true, message: "Wishlist item removed" });
  } catch (error) {
    console.error("Remove Wishlist Error:", error);
    res.status(500).json({ success: false, message: "Server error while removing wishlist item", error: error.message });
  }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };
