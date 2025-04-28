const Cart = require('../../models/cartModel/cartModel');
const CartItem = require('../../models/cartModel/cartItemModel');
const Product = require('../../models/productModel/productModel');

const handleAddToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const {  productId, quantity } = req.body;
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    // 1. Check if active cart exists for user
    let cart = await Cart.findOne({ where: { userId, status: 'active' } });

    // 2. If not, create one
    if (!cart) {
      cart = await Cart.create({ userId, productId });
    }

    // 3. Check if CartItem exists for this product in the cart
    let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });

    if (cartItem) {
      // 4. If exists, update quantity
      cartItem.quantity += quantity;
      cartItem.price = product.productDiscountPrice; // or product.productPrice if no discount
      await cartItem.save();
    } else {
      // 5. Else, create new cart item
      await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
        price: product.productDiscountPrice, // or product.productPrice
      });
    }

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Add to Cart Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const handleGetUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({
      where: { userId, status: 'active' },
      include: {
        model: CartItem,
        include: Product
      }
    });

    if (!cart) {
      return res.status(200).json({ message: "Cart is empty", cart: [] });
    }

    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving cart", error: error.message });
  }
};


const handleRemoveCartItem = async (req, res) => {
    try {
      const userId = req.user.id;
      const { itemId } = req.params;
  
      const item = await CartItem.findByPk(itemId, {
        include: {
          model: Cart,
          where: { userId }
        }
      });
  
      if (!item) {
        return res.status(404).json({ message: "Item not found or not authorized" });
      }
  
      await item.destroy();
      return res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
      return res.status(500).json({ message: "Error removing item", error: error.message });
    }
  };

  
  const updateCartItemQuantity = async (req, res) => {
    try {
      const userId = req.user.id;
      const { itemId } = req.params;
      const { quantity } = req.body;
  
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
      }
  
      const item = await CartItem.findByPk(itemId, {
        include: {
          model: Cart,
          where: { userId }
        }
      });
  
      if (!item) {
        return res.status(404).json({ message: "Item not found or not authorized" });
      }
  
      item.quantity = quantity;
      item.totalPrice = item.price * quantity;
      await item.save();
  
      return res.status(200).json({ message: "Quantity updated", item });
    } catch (error) {
      return res.status(500).json({ message: "Error updating quantity", error: error.message });
    }
  };
  
  const handleRemoveSelectedCartItems = async (req, res) => {
    try {
      const userId = req.user.id;
      const { itemIds } = req.body; // Expecting an array of itemIds
  
      if (!Array.isArray(itemIds) || itemIds.length === 0) {
        return res.status(400).json({ message: "No items selected for deletion" });
      }
  
      // Delete only items that belong to the user's cart
      const deletedCount = await CartItem.destroy({
        where: {
          id: itemIds,
        },
        include: {
          model: Cart,
          where: { userId },
        },
      });
  
      return res.status(200).json({
        message: `${deletedCount} item(s) removed from cart`,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error removing selected items",
        error: error.message,
      });
    }
  };
  
  const handleRemoveAllCartItems = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // First, find the user's cart (assuming 1 cart per user)
      const userCart = await Cart.findOne({ where: { userId } });
  
      if (!userCart) {
        return res.status(404).json({ message: "Cart not found for user" });
      }
  
      // Delete all cart items for this cart
      const deletedCount = await CartItem.destroy({
        where: {
          cartId: userCart.id
        }
      });
  
      return res.status(200).json({
        message: `${deletedCount} item(s) deleted from cart`
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to delete all cart items",
        error: error.message
      });
    }
  };
  

  const handleGetCartSummary = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const userCart = await Cart.findOne({ where: { userId } });
  
      if (!userCart) {
        return res.status(200).json({ items: [], totalItems: 0, totalPrice: 0 });
      }
  
      const cartItems = await CartItem.findAll({
        where: { cartId: userCart.id },
        include: ['Product'] // assuming relation with Product model for price
      });
  
      const totalItems = cartItems.length;
      const totalPrice = cartItems.reduce((sum, item) => {
        return sum + item.quantity * item.Product.price;
      }, 0);
  
      res.status(200).json({ items: cartItems, totalItems, totalPrice });
    } catch (error) {
      res.status(500).json({ message: "Error fetching cart summary", error: error.message });
    }
  };
  

  module.exports = {
    updateCartItemQuantity,
    handleRemoveCartItem,
    handleGetUserCart,
    handleAddToCart,
    handleRemoveSelectedCartItems,
    handleRemoveAllCartItems ,
    handleGetCartSummary
  }