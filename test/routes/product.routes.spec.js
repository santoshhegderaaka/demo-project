const request = require('supertest');
const express = require('express');

describe('src/routes/product.routes.js', () => {
  let app;
  let productService;

  beforeEach(() => {
    // Ensure a clean module cache so service mocks are applied before the router is loaded
    jest.resetModules();

    // Require the real service module so the router and tests share the same reference
    productService = require('../../src/services/product.service');

    // Replace service methods with mocks
    productService.getProducts = jest.fn();
    productService.getProductById = jest.fn();

    // Now require the router (it will use the mocked service instance)
    const router = require('../../src/routes/product.routes');

    app = express();
    app.use(express.json());
    app.use('/', router);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('GET / should return products from productService.getProducts', async () => {
    const fakeProducts = [{ id: '1', name: 'Test Product' }];
    productService.getProducts.mockReturnValue(fakeProducts);

    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeProducts);
    expect(productService.getProducts).toHaveBeenCalled();
  });

  it('GET /:id should return product when found', async () => {
    const fakeProduct = { id: '42', name: 'The Answer' };
    productService.getProductById.mockReturnValue(fakeProduct);

    const res = await request(app).get('/42');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeProduct);
    expect(productService.getProductById).toHaveBeenCalledWith('42');
  });

  it('GET /:id should return 404 when product not found', async () => {
    productService.getProductById.mockReturnValue(undefined);

    const res = await request(app).get('/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Product not found' });
    expect(productService.getProductById).toHaveBeenCalledWith('nonexistent');
  });
});
