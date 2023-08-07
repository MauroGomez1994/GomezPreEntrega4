const express = require('express');
const fs = require('fs');
 const app = express();
const PORT = 8080;
 // Middleware para parsear el body de las peticiones
app.use(express.json());
 // Ruta para manejar los productos
const productsRouter = express.Router();
 // Ruta raíz GET /api/products/
productsRouter.get('/', (req, res) => {
  // Leer el archivo "productos.json" y devolver los productos
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  res.json(products);
});
 // Ruta GET /api/products/:pid
productsRouter.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  // Leer el archivo "productos.json" y buscar el producto por su id
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const product = products.find((p) => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});
 // Ruta POST /api/products/
productsRouter.post('/', (req, res) => {
  const newProduct = req.body;
  // Leer el archivo "productos.json" y agregar el nuevo producto
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  products.push(newProduct);
  fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));
  res.status(201).json(newProduct);
});
 // Ruta PUT /api/products/:pid
productsRouter.put('/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;
  // Leer el archivo "productos.json" y buscar el producto por su id
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex !== -1) {
    // Actualizar el producto
    products[productIndex] = { ...products[productIndex], ...updatedProduct };
    fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));
    res.json(products[productIndex]);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});
 // Ruta DELETE /api/products/:pid
productsRouter.delete('/:pid', (req, res) => {
  const productId = req.params.pid;
  // Leer el archivo "productos.json" y eliminar el producto por su id
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const updatedProducts = products.filter((p) => p.id !== productId);
  fs.writeFileSync('productos.json', JSON.stringify(updatedProducts, null, 2));
  res.json({ message: 'Producto eliminado' });
});
 // Ruta para manejar los carritos
const cartsRouter = express.Router();
 // Ruta raíz POST /api/carts/
cartsRouter.post('/', (req, res) => {
  const newCart = req.body;
  // Leer el archivo "carrito.json" y agregar el nuevo carrito
  const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf-8'));
  carts.push(newCart);
  fs.writeFileSync('carrito.json', JSON.stringify(carts, null, 2));
  res.status(201).json(newCart);
});
 // Ruta GET /api/carts/:cid
cartsRouter.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  // Leer el archivo "carrito.json" y buscar el carrito por su id
  const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf-8'));
  const cart = carts.find((c) => c.id === cartId);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});
 // Ruta POST /api/carts/:cid/product/:pid
cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;
  // Leer el archivo "carrito.json" y buscar el carrito por su id
  const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf-8'));
  const cartIndex = carts.findIndex((c) => c.id === cartId);
  if (cartIndex !== -1) {
    // Buscar el producto por su id
    const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
    const product = products.find((p) => p.id === productId);
    if (product) {
      // Verificar si el producto ya existe en el carrito
      const existingProductIndex = carts[cartIndex].products.findIndex(
        (p) => p.product === productId
      );
      if (existingProductIndex !== -1) {
        // Incrementar la cantidad del producto existente
        carts[cartIndex].products[existingProductIndex].quantity += quantity;
      } else {
        // Agregar el producto al carrito
        carts[cartIndex].products.push({ product: productId, quantity });
      }
      fs.writeFileSync('carrito.json', JSON.stringify(carts, null, 2));
      res.json(carts[cartIndex]);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});
 // Asociar los routers a las rutas correspondientes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
 // Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});