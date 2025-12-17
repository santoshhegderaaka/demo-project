const productService = require('../../src/services/product.service');

describe('product.service', () => {
  describe('getProducts', () => {
    it('returns all products', () => {
      const products = productService.getProducts();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
      expect(products).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: '1', name: 'Laptop', price: 1200 })
      ]));
    });
  });

  describe('getProductById', () => {
    it('returns correct product when id exists', () => {
      const p = productService.getProductById('2');
      expect(p).toEqual({ id: '2', name: 'Phone', price: 800 });
    });

    it('returns undefined when id does not exist', () => {
      const p = productService.getProductById('999');
      expect(p).toBeUndefined();
    });
  });
});
