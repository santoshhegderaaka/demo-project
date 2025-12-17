/* eslint-env jest */

describe('src/app.js', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('initializes express, registers middleware and routes, and starts listening', () => {
    jest.resetModules();

    const productRoutesMock = 'PRODUCT_ROUTES_MOCK';
    jest.mock('../src/routes/product.routes', () => productRoutesMock);

    jest.mock('express', () => {
      const use = jest.fn();
      const handlers = {};
      const app = {
        use,
        get: (path, handler) => { handlers[path] = handler; },
        listen: jest.fn((port, cb) => cb && cb()),
        _handlers: handlers,
      };
      const express = jest.fn(() => app);
      express.json = jest.fn(() => 'json-middleware');
      return express;
    });

    const express = require('express');
    const app = require('../src/app');

    // app should be the mocked app returned by our express mock
    expect(typeof app).toBe('object');

    // express() was called to create the app and express.json() was used
    expect(express).toHaveBeenCalled();
    expect(express.json).toHaveBeenCalled();

    // json middleware and product routes were registered
    expect(app.use).toHaveBeenCalledWith('json-middleware');
    expect(app.use).toHaveBeenCalledWith('/api/products', productRoutesMock);

    // listen was invoked (callback executed)
    expect(app.listen).toHaveBeenCalled();
  });

  it('registers a /health route that responds with status UP', () => {
    jest.resetModules();

    jest.mock('../src/routes/product.routes', () => 'PRODUCT_ROUTES_MOCK');

    jest.mock('express', () => {
      const use = jest.fn();
      const handlers = {};
      const app = {
        use,
        get: (path, handler) => { handlers[path] = handler; },
        listen: jest.fn((port, cb) => cb && cb()),
        _handlers: handlers,
      };
      const express = jest.fn(() => app);
      express.json = jest.fn(() => 'json-middleware');
      return express;
    });

    const app = require('../src/app');

    const handler = app._handlers && app._handlers['/health'];
    expect(typeof handler).toBe('function');

    const res = { status: jest.fn(() => res), json: jest.fn() };
    handler({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'UP' });
  });
});
