const SearchHistory = require("../../models/searchHistory/userSearchHistory");
const { Op } = require("sequelize");

const handleTrackSearch = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    if (!userId) {
      console.log("User not logged in, skipping tracking");
      return next();
    }

    const searchText = req.query.query;
    if (!searchText) {
      return res.status(400).json({ success: false, message: "Search text required." });
    }

    let record = await SearchHistory.findOne({ where: { userId } });

    if (record) {
      let existingSearchText = record.searchText || [];
      if (!Array.isArray(existingSearchText)) existingSearchText = [];

      if (!existingSearchText.includes(searchText)) {
        existingSearchText.push(searchText);
      }

      await record.update({ searchText: existingSearchText });
    } else {
      await SearchHistory.create({
        userId,
        searchText: [searchText], 
        productId: null,
      });
    }

    next();
  } catch (error) {
    console.error("Error tracking search:", error);
    next();
  }
};



const handleTrackProductClick = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    if (!userId) {
      console.log("User not logged in, skipping product click tracking");
      return next();
    }

    const productId = req.params.productId || req.query.productId;
    const searchText = req.query.searchText || null;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID required." });
    }

    const existingEntry = await SearchHistory.findOne({
      where: { userId, productId },
    });

    if (existingEntry) {
      existingEntry.searchText = searchText ? (existingEntry.searchText ? existingEntry.searchText + ',' + searchText : searchText) : existingEntry.searchText;
      await existingEntry.save();
    } else {
      await SearchHistory.create({
        userId,
        productId,
        searchText,
      });
    }

    next();
  } catch (error) {
    console.error("Error tracking product click:", error);
    next();
  }
};




const getUserSearchHistory = async (userId, limit = 10) => {
  const searches = await SearchHistory.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
    limit,
  });

  const recentSearchTexts = searches.map((s) => s.searchText).filter(Boolean);

  const recentProductIds = searches.map((s) => s.productId).filter(Boolean);

  return { recentSearchTexts, recentProductIds };
};

module.exports = {
  handleTrackSearch,
  handleTrackProductClick,
  getUserSearchHistory,
};
