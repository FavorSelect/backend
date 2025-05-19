const Product = require('../../../models/productModel/productModel');
const Seller = require('../../../models/authModel/sellerModel');
// PATCH /api/admin/products/:productId/approve
const handleApproveProduct = async (req, res) => {
    const { productId } = req.params;
  
    try {
      const product = await Product.findByPk(productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });
  
      product.status = 'approved';
      await product.save();
  
      return res.status(200).json({ message: 'Product approved successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error approving product', error: error.message });
    }
  };
  
  // PATCH /api/admin/products/:productId/reject
  const handleRejectProduct = async (req, res) => {
    const { productId } = req.params;
  
    try {
      const product = await Product.findByPk(productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });
  
      product.status = 'rejected';
      await product.save();
  
      return res.status(200).json({ message: 'Product rejected successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error rejecting product', error: error.message });
    }
  };

  const handleGetAllPendingProducts = async (req, res) => {
    try {
      const pendingProducts = await Product.findAll({
        where: { status: 'pending' },
        include: [
          {
            model: Seller,
            as: 'seller',
            attributes: ['id', 'sellerName', 'email', 'shopName'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
  
      return res.status(200).json({ pendingProducts });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching pending products', error: error.message });
    }
  };
  

  module.exports = {
    handleRejectProduct,
    handleApproveProduct,
    handleGetAllPendingProducts

  }
  