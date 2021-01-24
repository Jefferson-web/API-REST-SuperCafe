const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");

/* Routes */
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const categoriesRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const imageRoutes = require('./routes/imageRoutes');

require('./config');
const path = require('path');

class Core {

    constructor() {
        this.__app = express();
        this.config();
        this.routes();
    }

    config() {
        this.__app.use(express.json());
        this.__app.use(express.urlencoded({ extended: true }));
        this.__app.use(express.static(path.join(process.cwd(), 'public')));
        this.__app.use(morgan('dev'));
        this.__app.use(helmet());
        this.__app.use(compression());
        require('./db/database');
    }

    routes() {
        this.__app.use('/auth', authRoutes);
        this.__app.use('/users', userRoutes);
        this.__app.use('/categories', categoriesRoutes);
        this.__app.use('/products', productRoutes);
        this.__app.use('/upload', uploadRoutes);
        this.__app.use('/image', imageRoutes);
    }

}

const app = new Core();
module.exports = app.__app;