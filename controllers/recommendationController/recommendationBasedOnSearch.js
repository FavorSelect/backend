const Product = require("../../models/productModel/productModel");
const {
  getUserSearchHistory,
} = require("../searchHistoryController/userSearch");

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

const recommendBasedOnSearch = async (req, res) => {
  try {
    const userId = req.user.id;
    const allProducts = await Product.findAll({
      where: { status: "approved" },
    });

    const { recentSearchTexts, recentProductIds } = await getUserSearchHistory(
      userId
    );

    const flattenedSearchTexts = recentSearchTexts.flat();
    const searchTextsLower = flattenedSearchTexts
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

    function getSimilarProducts(referenceProduct, allProducts) {
      const refTags = new Set(
        (referenceProduct.rekognitionLabels || []).map((t) => t.toLowerCase())
      );
      return allProducts.filter((p) => {
        if (p.id === referenceProduct.id) return false;
        const tags = new Set(
          (p.rekognitionLabels || []).map((t) => t.toLowerCase())
        );
        const common = [...refTags].filter((tag) => tags.has(tag));
        return common.length > 0;
      });
    }

    let recommendedSet = new Set(textMatchedProducts);

    recentProducts.forEach((p) => {
      const similar = getSimilarProducts(p, allProducts);
      similar.forEach((s) => recommendedSet.add(s));
    });

    res.json({
      success: true,
      recommended: Array.from(recommendedSet),
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate recommendations." });
  }
};

module.exports = {
  recommendBasedOnSearch,
};
