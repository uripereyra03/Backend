import express from 'express';
import { create } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import viewsRouter from './routes/viewsRouter.js'; // Importa el router de vistas

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configurar Handlebars como motor de plantillas
const hbs = create({
    extname: '.handlebars', // Cambia la extensión si lo prefieres
    defaultLayout: 'main',
});

app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Usar el router de vistas
app.use('/', viewsRouter);

// Crear el servidor HTTP
const server = http.createServer(app);

// Configurar Socket.IO
const io = new SocketIOServer(server);

// Función para emitir la lista de productos a todos los clientes
const emitProducts = async () => {
    try {
        const data = await fs.readFile('./src/data/products.json', 'utf-8');
        const products = JSON.parse(data);
        io.emit('updateProducts', products);
    } catch (error) {
        console.error('Error al emitir productos:', error);
    }
};

// Escuchar eventos de conexión
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Emitir la lista actual de productos al nuevo cliente
    emitProducts();

    // (Opcional) Escuchar eventos para agregar un producto desde el cliente
    socket.on('addProduct', async (product) => {
        try {
            const data = await fs.readFile('./src/data/products.json', 'utf-8');
            const products = JSON.parse(data);
            const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
            const newProduct = { id: newId, ...product };
            products.push(newProduct);
            await fs.writeFile('./src/data/products.json', JSON.stringify(products, null, 2));
            emitProducts(); // Emitir la lista actualizada
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });

    // Manejar la desconexión
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Ruta API para agregar productos (si usas el formulario en la vista RealTimeProducts)
app.post('/api/products', async (req, res) => {
    const { name, price, category, description } = req.body;
    if (!name || !price || !category || !description) {
        return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    try {
        const data = await fs.readFile('./src/data/products.json', 'utf-8');
        const products = JSON.parse(data);
        const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = { id: newId, name, price, category, description };
        products.push(newProduct);
        await fs.writeFile('./src/data/products.json', JSON.stringify(products, null, 2));
        emitProducts(); // Emitir la lista actualizada
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
