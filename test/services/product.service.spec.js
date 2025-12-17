const productService = require('../../src/services/product.service');

describe('product.service', () => {
  describe('getProducts', () => {
    it('returns all products', () => {
      const products = productService.getProducts();
      expect(Array.isArray(products)).toBe(true);
      expect(products).toEqual([
        { id: '1', name: 'Laptop', price: 1200 },
        { id: '2', name: 'Phone', price: 800 },
        { id: '3', name: 'Headphones', price: 150 }
      ]);
    });
  });

  describe('getProductById', () => {
    it('returns the product when id exists', () => {
      expect(productService.getProductById('2')).toEqual({ id: '2', name: 'Phone', price: 800 });
    });

    it('returns undefined when id does not exist', () => {
      expect(productService.getProductById('999')).toBeUndefined();
    });
  });
});
