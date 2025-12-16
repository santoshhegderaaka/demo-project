const express = require('express');
const router = express.Router();
const productService = require('../services/product.service');

router.get('/', (req, res) => {
  const products = productService.getProducts();
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = productService.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

module.exports = router;
