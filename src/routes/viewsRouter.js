import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// Ruta de los archivos JSON
const productsFilePath = path.resolve('./src/data/products.json');

// Función para leer los productos del archivo
const readProducts = async () => {
    try {
        const data = await fs.readFile(productsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error leyendo products.json:', error);
        return [];
    }
};

// Ruta para la vista Home
router.get('/', async (req, res) => {
    const products = await readProducts();
    res.render('home', { products });
});

// Ruta para la vista RealTimeProducts
router.get('/realtimeproducts', async (req, res) => {
    const products = await readProducts();
    res.render('realTimeProducts', { products });
});

export default router;
