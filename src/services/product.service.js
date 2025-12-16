const products = [
  { id: '1', name: 'Laptop', price: 1200 },
  { id: '2', name: 'Phone', price: 800 },
  { id: '3', name: 'Headphones', price: 150 }
];

function getProducts() {
  return products;
}

function getProductById(id) {
  return products.find(p => p.id === id);
}

module.exports = {
  getProducts,
  getProductById
};
