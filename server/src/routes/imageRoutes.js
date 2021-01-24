const { Router } = require("express");
const { getImage } = require('../controller/imageController');
const { verifyTokenImg } = require('../utils/authorization');

class ImageRoutes {

    constructor() {
        this.__router = Router();
        this.config();
    }

    config() {
        this.__router.get('/:document/:img', [verifyTokenImg, getImage]);
    }

}

const imageRoutes = new ImageRoutes();
module.exports = imageRoutes.__router;