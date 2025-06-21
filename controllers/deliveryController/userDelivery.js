const axios = require("axios");
const User = require("../../models/authModel/userModel");
const Product = require("../../models/productModel/productModel");
const DeliveryEstimate = require("../../models/deliveryModel/userDeliveryModel");
const Seller = require("../../models/authModel/sellerModel");
const WarehouseAddress = require("../../models/deliveryModel/adminWarehouseAdd");
const Address = require("../../models/orderModel/orderAddressModel");

const getEstimateForProductFromGoogle = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const product = await Product.findByPk(productId);
    const user = await User.findByPk(userId);

    if (!product || !user) {
      return res.status(404).json({ message: "User or product not found" });
    }

    const userPincode = user.zipCode;
    let sellerPincode = null;

    if (product.sellerId) {
      const seller = await Seller.findByPk(product.sellerId);
      sellerPincode = seller?.zipCode;
    }

    if (!sellerPincode) {
      const primaryWarehouse = await WarehouseAddress.findOne({
        where: { isPrimary: true },
      });
      sellerPincode = primaryWarehouse?.pinCode;
    }

    if (!sellerPincode || !userPincode) {
      return res.status(400).json({ message: "Missing pincode data" });
    }

    let userEstimate = await DeliveryEstimate.findOne({ where: { userId } });

    if (userEstimate?.estimates?.[productId]) {
      return res.status(200).json({
        source: "cache",
        estimate: userEstimate.estimates[productId],
      });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${sellerPincode}&destinations=${userPincode}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    const result = response.data.rows[0].elements[0];
    const distance = result.distance?.value / 1000 || 0;
    const eta = result.duration?.text || "2-4 days";

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);

    const estimateEntry = {
      distance,
      eta,
      deliveryDate: deliveryDate.toISOString().split("T")[0],
    };

    if (userEstimate) {
      userEstimate.estimates[productId] = estimateEntry;
      await userEstimate.save();
    } else {
      await DeliveryEstimate.create({
        userId,
        estimates: { [productId]: estimateEntry },
      });
    }

    return res.status(200).json({ source: "fresh", estimate: estimateEntry });
  } catch (err) {
    console.error("Delivery estimate error:", err);
    return res.status(500).json({ message: "Delivery estimate failed" });
  }
};


const getEstimateForProductFromOSRM = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const product = await Product.findByPk(productId);
    const user = await User.findByPk(userId);
    if (!product || !user) {
      return res.status(404).json({ message: "User or product not found" });
    }
    const address = await Address.findOne({ where: { userId, isDefault: true } });
    if (!address || !address.postalCode || !address.country) {
      return res.status(400).json({ message: "Default address with postalCode and country is required" });
    }

    const userPincode = address.postalCode;
    const userCountry = address.country;

    let sellerPincode = null;
    let sellerCountry = null;

    if (product.sellerId) {
      const seller = await Seller.findByPk(product.sellerId);
      sellerPincode = seller?.zipCode;
      sellerCountry = seller?.countryName;
    }

    if (!sellerPincode) {
      const warehouse = await WarehouseAddress.findOne({ where: { isPrimary: true } });
      sellerPincode = warehouse?.pinCode;
      sellerCountry = warehouse?.countryName;
    }

    if (!sellerPincode || !sellerCountry || !userPincode || !userCountry) {
      return res.status(400).json({ message: "Missing required location data" });
    }

    let userEstimate = await DeliveryEstimate.findOne({ where: { userId } });
    if (userEstimate?.estimates?.[productId]) {
      return res.status(200).json({
        source: "cache",
        estimate: userEstimate.estimates[productId],
      });
    }


    const [fromGeo, toGeo] = await Promise.all([
      axios.get(`https://nominatim.openstreetmap.org/search?postalcode=${sellerPincode}&country=${sellerCountry}&format=json`),
      axios.get(`https://nominatim.openstreetmap.org/search?postalcode=${userPincode}&country=${userCountry}&format=json`),
    ]);

    const from = fromGeo.data[0];
    const to = toGeo.data[0];

    if (!from || !to) {
      return res.status(400).json({ message: "Failed to geocode pincodes" });
    }

    const fromCoords = `${from.lon},${from.lat}`;
    const toCoords = `${to.lon},${to.lat}`;


    const osrmRes = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${fromCoords};${toCoords}?overview=false`
    );
    const route = osrmRes.data.routes?.[0];
    const distanceKm = (route?.distance || 0) / 1000;


    const estimatedHours = (distanceKm / 150) * 24;
    const days = Math.floor(estimatedHours / 24);
    const hours = Math.floor(estimatedHours % 24);
    const minutes = Math.round((estimatedHours - Math.floor(estimatedHours)) * 60);

    let etaText = "";
    if (days > 0) etaText += `${days} day${days > 1 ? "s" : ""}, `;
    if (hours > 0) etaText += `${hours} hr${hours > 1 ? "s" : ""}, `;
    etaText += `${minutes} min${minutes !== 1 ? "s" : ""}`;


    const deliveryDate = new Date();
    deliveryDate.setHours(deliveryDate.getHours() + estimatedHours);

    const estimateEntry = {
      distance: `${distanceKm.toFixed(2)} km`,
      eta: etaText,
      deliveryDate: deliveryDate.toISOString().split("T")[0],
    };


    if (userEstimate) {
      userEstimate.estimates[productId] = estimateEntry;
      await userEstimate.save();
    } else {
      await DeliveryEstimate.create({
        userId,
        estimates: { [productId]: estimateEntry },
      });
    }

    return res.status(200).json({ source: "fresh", estimate: estimateEntry });
  } catch (err) {
    console.error("Delivery estimate error:", err.message);
    return res.status(500).json({ message: "Delivery estimate failed" });
  }
};



module.exports = {
  getEstimateForProductFromGoogle,
  getEstimateForProductFromOSRM,
};
