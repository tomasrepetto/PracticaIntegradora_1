import express from "express";
import { engine } from 'express-handlebars';
import { Server } from "socket.io";
import { dirname } from './utils.js'; 
import path from 'path'; 

import products from './routers/products.js';
import carts from './routers/carts.js';
import views from './routers/views.js';
import { dbConnection } from "./database/config.js";
import { productModel } from "./dao/models/products.js";
import { messageModel } from "./dao/models/messages.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(dirname, 'public'))); 

app.engine('handlebars', engine());
app.set('views', path.join(dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/', views);
app.use('/api/products', products);
app.use('/api/carts', carts);

await dbConnection();

const expressServer = app.listen(PORT, () => {
    console.log(`Corriendo aplicación en el puerto ${PORT}`);
});

const io = new Server(expressServer);

io.on('connection', async(socket) => {
    const productos = await productModel.find();
    socket.emit('productos', productos);

    socket.on('agregarProducto', async(producto) => {
        const newProduct = await productModel.create({...producto});
        if(newProduct){
            productos.push(newProduct)
            socket.emit('productos', producto);
        }
    });

    const messages = await messageModel.find();
    socket.emit('message', messages);

    socket.on('message', async(data) => {
        const newMessage = await messageModel.create({...data});
        if (newMessage){
            const messages = await messageModel.find();
            io.emit('messageLogs', messages);
        }
    });

    socket.broadcast.emit('nuevo_user');
});


