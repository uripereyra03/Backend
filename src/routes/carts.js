import express from 'express';
import fs from 'fs/promises'; // Módulo de FileSystem para trabajar con archivos de manera asíncrona
const router = express.Router();

// Rutas de los archivos JSON
const cartsFilePath = './src/carts.json'; // Ruta para los carritos
const productsFilePath = './src/products.json'; // Ruta para los productos

// Función para leer los carritos del archivo
const readCarts = async () => {
  try {
    const data = await fs.readFile(cartsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return []; // Si no existe el archivo, devolvemos un array vacío
  }
};

// Función para leer los productos del archivo
const readProducts = async () => {
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return []; // Si no existe el archivo, devolvemos un array vacío
  }
};

// Función para guardar los carritos en el archivo
const saveCarts = async (carts) => {
  try {
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
  } catch (error) {
    console.error('Error al guardar los carritos', error);
  }
};

// Ruta POST /api/carts para crear un carrito vacío
router.post('/', async (req, res) => {
  const carts = await readCarts();
  
  // Generar un nuevo ID único para el carrito
  const newCartId = carts.length ? Math.max(...carts.map(cart => cart.id)) + 1 : 1;

  // Crear el nuevo carrito vacío
  const newCart = {
    id: newCartId,
    products: [] // Carrito empieza vacío
  };

  // Agregar el nuevo carrito a la lista de carritos
  carts.push(newCart);

  // Guardar los carritos actualizados en el archivo
  await saveCarts(carts);

  res.status(201).json(newCart); // Devolver el carrito creado
});

// Ruta POST /api/carts/:cid/product/:pid para agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  const carts = await readCarts();
  const products = await readProducts();

  const cartIndex = carts.findIndex(cart => cart.id === parseInt(cid));
  if (cartIndex === -1) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }

  // Verificar si el producto existe
  const product = products.find(p => p.id === parseInt(pid));
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  // Verificar si el producto ya está en el carrito
  const productInCartIndex = carts[cartIndex].products.findIndex(p => p.productId === parseInt(pid));
  if (productInCartIndex !== -1) {
    // Si el producto ya está, incrementar la cantidad
    carts[cartIndex].products[productInCartIndex].quantity += 1;
  } else {
    // Si no está, agregarlo con quantity = 1
    carts[cartIndex].products.push({ productId: parseInt(pid), quantity: 1 });
  }

  // Guardar los carritos actualizados
  await saveCarts(carts);

  res.json(carts[cartIndex]); // Devolver el carrito actualizado
});

// Ruta GET /api/carts/:cid para obtener los productos de un carrito
router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  const carts = await readCarts();
  const cart = carts.find(cart => cart.id === parseInt(cid));

  if (!cart) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }

  res.json(cart.products);
});

export default router;