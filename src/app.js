const express = require('express');
const productRoutes = require('./routes/product.routes');

const app = express();
app.use(express.json());

app.use('/api/products', productRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`E-commerce API running on port ${PORT}`);
});

module.exports = app;
