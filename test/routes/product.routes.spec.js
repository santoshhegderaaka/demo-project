const request = require('supertest');
const express = require('express');

// Mock the product service before requiring the router so the router gets the mocked module
jest.mock('../../src/services/product.service', () => ({
  getProducts: jest.fn(),
  getProductById: jest.fn(),
}));

const productService = require('../../src/services/product.service');
const router = require('../../src/routes/product.routes');

describe('product.routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/products', router);
    jest.clearAllMocks();
  });

  describe('GET /products', () => {
    it('returns products from the service', async () => {
      const products = [{ id: '1', name: 'Product A' }];
      productService.getProducts.mockReturnValue(products);

      const res = await request(app).get('/products');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(products);
      expect(productService.getProducts).toHaveBeenCalled();
    });
  });

  describe('GET /products/:id', () => {
    it('returns product when found', async () => {
      const product = { id: '1', name: 'Product A' };
      productService.getProductById.mockReturnValue(product);

      const res = await request(app).get('/products/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(product);
      expect(productService.getProductById).toHaveBeenCalledWith('1');
    });

    it('returns 404 when product not found', async () => {
      productService.getProductById.mockReturnValue(undefined);

      const res = await request(app).get('/products/999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Product not found' });
    });
  });
});
