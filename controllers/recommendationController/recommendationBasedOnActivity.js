const { Op } = require("sequelize");
const Order = require("../../models/orderModel/orderModel");
const Wishlist = require("../../models/wishListModel/wishListModel");
const CartItem = require("../../models/cartModel/cartItemModel");
const Product = require("../../models/productModel/productModel");
const Cart = require("../../models/cartModel/cartModel");

const getUserRelatedProductIds = async (userId) => {
  const [orders, wishlist, cartItems] = await Promise.all([
    Order.findAll({
      where: { userId },
      include: ["orderItems"], 
    }),
    Wishlist.findAll({ where: { userId } }),
    CartItem.findAll({
      include: {
        model: Cart,
        where: { userId },
      },
    }),
  ]);

  const orderProductIds = orders.flatMap(order =>
    order.orderItems ? order.orderItems.map(item => item.productId) : []
  );
  const wishlistProductIds = wishlist.map(w => w.productId);
  const cartProductIds = cartItems.map(c => c.productId);

  const allIds = [...orderProductIds, ...wishlistProductIds, ...cartProductIds];
  const uniqueIds = [...new Set(allIds)];

  return uniqueIds;
};

const getSimilarProducts = (referenceProduct, allProducts) => {
  const refTags = new Set([
    ...(referenceProduct.rekognitionLabels || []),
    ...(referenceProduct.productTags
      ? typeof referenceProduct.productTags === "string"
        ? referenceProduct.productTags.split(",")
        : Array.isArray(referenceProduct.productTags)
        ? referenceProduct.productTags
        : []
      : []),
    referenceProduct.productBrand,
    String(referenceProduct.productCategoryId),
  ]
    .filter(Boolean)
    .map(tag => tag.toLowerCase().trim()));

  if (!refTags.size) return [];

  return allProducts.filter(product => {
    if (product.id === referenceProduct.id) return false;

    const productTags = new Set([
      ...(product.rekognitionLabels || []),
      ...(product.productTags
        ? typeof product.productTags === "string"
          ? product.productTags.split(",")
          : Array.isArray(product.productTags)
          ? product.productTags
          : []
        : []),
      product.productBrand,
      String(product.productCategoryId),
    ]
      .filter(Boolean)
      .map(tag => tag.toLowerCase().trim()));

    const commonTags = [...refTags].filter(tag => productTags.has(tag));
    return commonTags.length > 0;
  });
};

const recommendBasedOnActivity = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const relatedProductIds = await getUserRelatedProductIds(userId);

    if (!relatedProductIds.length) {
      console.log(" No related products found.");
      return res.json({ success: true, recommended: [] });
    }

    const allProducts = await Product.findAll({ where: { status: "approved" } });

    if (!allProducts.length) {
      console.log(" No approved products found.");
      return res.json({ success: true, recommended: [] });
    }

  
    const userProducts = allProducts.filter(product =>
      relatedProductIds.includes(product.id)
    );

    console.log(" User interacted products:", userProducts.map(p => p.productName));

    const recommendedMap = new Map();

    
    userProducts.forEach(product => {
      recommendedMap.set(product.id, product);
    });

    userProducts.forEach(userProduct => {
      const similarProducts = getSimilarProducts(userProduct, allProducts);
      console.log(
        ` Found ${similarProducts.length} similar products for "${userProduct.productName}"`
      );

      similarProducts.forEach(product => {
        if (!recommendedMap.has(product.id)) {
          recommendedMap.set(product.id, product);
        }
      });
    });

    const recommended = Array.from(recommendedMap.values());

    console.log(" Final recommended products:", recommended.map(p => p.id));

    res.json({
      success: true,
      recommended,
    });
  } catch (error) {
    console.error(" Recommendation error:", error);
    res.status(500).json({ success: false, message: "Failed to generate recommendations." });
  }
};

module.exports = { recommendBasedOnActivity };
