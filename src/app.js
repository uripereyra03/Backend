import express from 'express';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';

const app = express();
const PORT = 8080;

// Middleware para manejar datos en formato JSON
app.use(express.json());

// Configuración de rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Servidor escuchando en el puerto 8080
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });