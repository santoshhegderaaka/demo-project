// Jest tests for src/app.js

describe('app', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('sets up middleware and product routes and starts server without launching real network', () => {
    const productRoutesMock = { mocked: 'routes' };

    // Mock product routes before requiring app
    jest.doMock('../src/routes/product.routes', () => productRoutesMock);

    // Create an express mock that records handlers and doesn't open a real server
    const handlers = {};
    const mockApp = {
      use: jest.fn(),
      get: jest.fn((path, handler) => { handlers[path] = handler; }),
      listen: jest.fn((port, cb) => { if (cb) cb(); }),
      __handlers: handlers,
    };

    const expressMock = jest.fn(() => mockApp);
    expressMock.json = jest.fn(() => 'json-middleware');

    // Mock express before requiring app
    jest.doMock('express', () => expressMock);

    // Spy on console.log to avoid noisy output
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const app = require('../src/app'); // require after mocks

    // Retrieve the instance returned when app called express()
    const createdApp = expressMock.mock.results[0].value;

    // Assertions about express usage
    expect(expressMock).toHaveBeenCalled();
    expect(expressMock.json).toHaveBeenCalled();
    expect(createdApp.use).toHaveBeenCalledWith('json-middleware');
    expect(createdApp.use).toHaveBeenCalledWith('/api/products', productRoutesMock);

    // Ensure listen was called with port 3000 and callback executed
    expect(createdApp.listen).toHaveBeenCalledWith(3000, expect.any(Function));
    expect(logSpy).toHaveBeenCalledWith('E-commerce API running on port 3000');

    // Clean up
    logSpy.mockRestore();
  });

  it('registers a /health handler that responds with status UP', () => {
    const productRoutesMock = { mocked: 'routes' };
    jest.doMock('../src/routes/product.routes', () => productRoutesMock);

    const handlers = {};
    const mockApp = {
      use: jest.fn(),
      get: jest.fn((path, handler) => { handlers[path] = handler; }),
      listen: jest.fn((port, cb) => { if (cb) cb(); }),
      __handlers: handlers,
    };

    const expressMock = jest.fn(() => mockApp);
    expressMock.json = jest.fn(() => 'json-middleware');
    jest.doMock('express', () => expressMock);

    // require after mocks
    require('../src/app');
    const createdApp = expressMock.mock.results[0].value;

    expect(createdApp.get).toHaveBeenCalledWith('/health', expect.any(Function));

    const handler = createdApp.__handlers['/health'];
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn();

    // Call the registered handler
    handler({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'UP' });
  });
});
