const Product = require("../../models/productModel/productModel");
const {
  getUserSearchHistory,
} = require("../searchHistoryController/userSearch");
const { Op } = require("sequelize");
const Order = require("../../models/orderModel/orderModel");
const Wishlist = require("../../models/wishListModel/wishListModel");
const CartItem = require("../../models/cartModel/cartItemModel");
const Cart = require("../../models/cartModel/cartModel");
const Category = require("../../models/categoryModel/categoryModel");
const Seller = require("../../models/authModel/sellerModel");

function prepareProductFeatures(product) {
  const tags = [
    ...(product.productTags || []),
    ...(product.rekognitionLabels || []),
  ];
  return [
    product.productName || "",
    product.productBrand || "",
    product.productCategoryId || "",
    ...tags,
  ]
    .join(" ")
    .toLowerCase();
}

const getUserRelatedProductIds = async (userId) => {
  const [orders, wishlist, cartItems] = await Promise.all([
    Order.findAll({ where: { userId }, include: ["orderItems"] }),
    Wishlist.findAll({ where: { userId } }),
    CartItem.findAll({
      include: {
        model: Cart,
        where: { userId },
      },
    }),
  ]);

  const orderProductIds = orders.flatMap((order) =>
    order.orderItems ? order.orderItems.map((item) => item.productId) : []
  );
  const wishlistProductIds = wishlist.map((w) => w.productId);
  const cartProductIds = cartItems.map((c) => c.productId);

  const allIds = [...orderProductIds, ...wishlistProductIds, ...cartProductIds];
  return [...new Set(allIds)];
};

const getSimilarProducts = (referenceProduct, allProducts) => {
  const refTags = new Set(
    [
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
      .map((tag) => tag.toLowerCase().trim())
  );

  if (!refTags.size) return [];

  return allProducts.filter((product) => {
    if (product.id === referenceProduct.id) return false;

    const productTags = new Set(
      [
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
        .map((tag) => tag.toLowerCase().trim())
    );

    const commonTags = [...refTags].filter((tag) => productTags.has(tag));
    return commonTags.length > 0;
  });
};

const recommendCombined = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      const topProducts = await Product.findAll({
        where: { status: "approved" },
        order: [["totalSoldCount", "DESC"]],
        limit: 12,
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["categoryName"],
          },
          {
            model: Seller,
            as: "seller",
            attributes: ["id", "sellerName", "shopName"],
          },
        ],
      });

      return res.json({
        success: true,
        recommended: topProducts,
      });
    }

    const allProducts = await Product.findAll({
      where: { status: "approved" },
    });

    // ----- Search-Based Recommendations -----
    const { recentSearchTexts, recentProductIds } = await getUserSearchHistory(
      userId
    );
    const searchTextsLower = recentSearchTexts
      .filter((t) => typeof t === "string")
      .map((t) => t.toLowerCase());

    const textMatchedProducts = allProducts.filter((product) =>
      searchTextsLower.some((keyword) =>
        prepareProductFeatures(product).includes(keyword)
      )
    );

    const recentProducts = allProducts.filter((p) =>
      recentProductIds.includes(p.id)
    );

    let searchRecommendations = new Set(textMatchedProducts);
    recentProducts.forEach((p) => {
      const similar = getSimilarProducts(p, allProducts);
      similar.forEach((s) => searchRecommendations.add(s));
    });

    // ----- Activity-Based Recommendations -----
    const relatedProductIds = await getUserRelatedProductIds(userId);
    const userProducts = allProducts.filter((p) =>
      relatedProductIds.includes(p.id)
    );

    let activityRecommendations = new Set(userProducts);
    userProducts.forEach((p) => {
      const similar = getSimilarProducts(p, allProducts);
      similar.forEach((s) => activityRecommendations.add(s));
    });

    // ----- Merge both sets -----
    const finalRecommendations = new Map();
    [...searchRecommendations, ...activityRecommendations].forEach(
      (product) => {
        finalRecommendations.set(product.id, product);
      }
    );

    res.json({
      success: true,
      recommended: Array.from(finalRecommendations.values()),
    });
  } catch (error) {
    console.error("Combined recommendation error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate recommendations." });
  }
};

module.exports = { recommendCombined };
