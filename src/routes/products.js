import express from 'express';
const router = express.Router();

let products = [
    { id: 1, name: 'Procesador Intel Core i9-12900K', price: 589 },
    { id: 2, name: 'Tarjeta Gráfica NVIDIA GeForce RTX 3080', price: 799 },
    { id: 3, name: 'Placa Base ASUS ROG Strix Z690-E', price: 299 },
    { id: 4, name: 'Memoria RAM Corsair Vengeance 16GB DDR4', price: 79 },
    { id: 5, name: 'SSD Samsung 970 EVO Plus 1TB', price: 149 },
    { id: 6, name: 'Fuente de Poder EVGA SuperNOVA 750W', price: 129 },
    { id: 7, name: 'Caja ATX NZXT H510', price: 89 },
    { id: 8, name: 'Disipador Cooler Master Hyper 212', price: 45 },
    { id: 9, name: 'Ventilador Noctua NF-P12 redux', price: 19 },
    { id: 10, name: 'Unidad de DVD ASUS DRW-24B1ST', price: 25 }
]
// Ruta GET /api/products/ para listar todos los productos
router.get('/', (req, res) => {
    res.json(products);
  });

// Ruta GET /api/products/:pid para obtener un producto por ID
router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const product = products.find(p => p.id === parseInt(pid, 10));
  
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  });

  // Ruta POST /api/products/ para agregar un nuevo producto
router.post('/', (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
  
    if (!title || !description || !code || price === undefined || stock === undefined || !category) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    // Generar un nuevo ID (se podría mejorar con una solución más robusta)
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  
    // Crear el nuevo producto
    const newProduct = {
      id: newId,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails: thumbnails || []
    };
  
    // Agregar el nuevo producto a la base de datos
    products.push(newProduct);
  
    // Devolver el nuevo producto
    res.status(201).json(newProduct);
  });

  // Ruta PUT /api/products/:pid para actualizar un producto
router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  
    // Buscar el producto por ID
    const productIndex = products.findIndex(p => p.id === parseInt(pid, 10));
  
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
  
    // Actualizar el producto con los campos proporcionados
    const updatedProduct = {
      ...products[productIndex],
      title: title !== undefined ? title : products[productIndex].title,
      description: description !== undefined ? description : products[productIndex].description,
      code: code !== undefined ? code : products[productIndex].code,
      price: price !== undefined ? price : products[productIndex].price,
      status: status !== undefined ? status : products[productIndex].status,
      stock: stock !== undefined ? stock : products[productIndex].stock,
      category: category !== undefined ? category : products[productIndex].category,
      thumbnails: thumbnails !== undefined ? thumbnails : products[productIndex].thumbnails
    };
  
    // Reemplazar el producto en la base de datos
    products[productIndex] = updatedProduct;
  
    res.json(updatedProduct);
  });
  
  // Ruta DELETE /api/products/:pid para eliminar un producto
router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const productIndex = products.findIndex(p => p.id === parseInt(pid, 10));
  
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
  
    // Eliminar el producto
    products.splice(productIndex, 1);
  
    res.status(204).send(); 
  });
  
  export default router;