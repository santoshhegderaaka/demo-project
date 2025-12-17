// Mocks express and the product routes, then requires the app to assert wiring
jest.mock('express', () => {
  const json = jest.fn(() => 'json-middleware');
  const app = {
    use: jest.fn(),
    get: jest.fn((path, handler) => {
      if (path === '/health') {
        app._healthHandler = handler;
      }
    }),
    listen: jest.fn((port, cb) => cb && cb()),
  };
  const express = jest.fn(() => app);
  express.json = json;
  return express;
});

jest.mock('../src/routes/product.routes', () => 'PRODUCT_ROUTES');

describe('src/app.js', () => {
  let app;
  let expressMock;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    // require the mocked express and the app after mocks are in place
    expressMock = require('express');
    app = require('../src/app');
  });

  afterEach(() => {
    if (console.log.mockRestore) console.log.mockRestore();
  });

  it('uses express.json() middleware', () => {
    expect(expressMock.json).toHaveBeenCalled();
    expect(app.use).toHaveBeenCalledWith('json-middleware');
  });

  it('mounts product routes on /api/products', () => {
    expect(app.use).toHaveBeenCalledWith('/api/products', 'PRODUCT_ROUTES');
  });

  it('registers a /health GET handler that returns status UP', () => {
    // handler was captured by the mocked get method
    const handler = app._healthHandler;
    expect(typeof handler).toBe('function');

    const req = {};
    const res = { status: jest.fn(() => res), json: jest.fn() };

    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'UP' });
  });

  it('starts listening on port 3000 and logs a message', () => {
    expect(app.listen).toHaveBeenCalledWith(3000, expect.any(Function));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('E-commerce API running on port 3000'));
  });
});
