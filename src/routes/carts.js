import express from 'express';
const router = express.Router();

// Array para almacenar los carritos
let carts = [
    {
      id: 1,
      products: [
        { productId: 1, quantity: 2 }, 
        { productId: 3, quantity: 1 }, 
        { productId: 5, quantity: 3 }  
      ]
    },
    {
      id: 2,
      products: [
        { productId: 2, quantity: 1 }, 
        { productId: 4, quantity: 4 }, 
        { productId: 6, quantity: 1 }  
      ]
    },
    {
      id: 3,
      products: [
        { productId: 7, quantity: 1 }, 
        { productId: 8, quantity: 2 }, 
        { productId: 9, quantity: 5 }  
      ]
    }
  ];

// Ruta POST /api/carts/ para crear un nuevo carrito
router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
  
    const cart = carts.find(c => c.id === parseInt(cid, 10));
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
  
    const productInCart = cart.products.find(p => p.productId === parseInt(pid, 10));
  
    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ productId: parseInt(pid, 10), quantity: 1 });
    }
  
    res.status(200).json(cart);
  });

// Ruta GET /api/carts/:cid para obtener los productos de un carrito por ID
router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const cart = carts.find(c => c.id === parseInt(cid, 10));
  
    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ message: 'Carrito no encontrado' });
    }
  });

  // Ruta PUT /api/carts/:cid para agregar productos a un carrito por ID
router.put('/:cid', (req, res) => {
    const { cid } = req.params;
    const { productId, quantity } = req.body;
  
    const cart = carts.find(c => c.id === parseInt(cid, 10));
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
  
    const existingProductIndex = cart.products.findIndex(p => p.productId === productId);
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }
  
    res.json(cart);
  });

  // Ruta DELETE /api/carts/:cid para eliminar un carrito por ID
router.delete('/:cid', (req, res) => {
    const { cid } = req.params;
    const cartIndex = carts.findIndex(c => c.id === parseInt(cid, 10));
  
    if (cartIndex === -1) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
  
    carts.splice(cartIndex, 1);
    res.status(204).send();
  });
export default router;

