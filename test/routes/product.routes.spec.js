jest.mock('../../src/services/product.service', () => ({
  getProducts: jest.fn(),
  getProductById: jest.fn(),
}));

const request = require('supertest');
const express = require('express');
const productService = require('../../src/services/product.service');
const router = require('../../src/routes/product.routes');

describe('src/routes/product.routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/products', router);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('GET / should return list of products', async () => {
    const products = [{ id: '1', name: 'Product A' }];
    productService.getProducts.mockReturnValue(products);

    const res = await request(app).get('/products');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(products);
  });

  it('GET /:id should return a product when found', async () => {
    const product = { id: '1', name: 'Product A' };
    productService.getProductById.mockReturnValue(product);

    const res = await request(app).get('/products/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(product);
  });

  it('GET /:id should return 404 when product not found', async () => {
    productService.getProductById.mockReturnValue(undefined);

    const res = await request(app).get('/products/nonexistent');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Product not found' });
  });
});
