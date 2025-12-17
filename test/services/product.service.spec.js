const productService = require('../../src/services/product.service');

describe('product.service', () => {
  describe('getProducts', () => {
    it('returns an array of products', () => {
      const products = productService.getProducts();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
      // basic shape check for first product
      expect(products[0]).toHaveProperty('id');
      expect(products[0]).toHaveProperty('name');
      expect(products[0]).toHaveProperty('price');
    });

    it('returns the full product list', () => {
      const products = productService.getProducts();
      // The service currently exposes 3 products
      expect(products).toHaveLength(3);
      expect(products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: '1', name: 'Laptop', price: 1200 }),
          expect.objectContaining({ id: '2', name: 'Phone', price: 800 }),
          expect.objectContaining({ id: '3', name: 'Headphones', price: 150 })
        ])
      );
    });
  });

  describe('getProductById', () => {
    it('returns the matching product for an existing id', () => {
      const product = productService.getProductById('2');
      expect(product).toEqual({ id: '2', name: 'Phone', price: 800 });
    });

    it('returns undefined for a non-existing id', () => {
      const product = productService.getProductById('non-existent');
      expect(product).toBeUndefined();
    });
  });
});
