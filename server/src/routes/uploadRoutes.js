const { Router } = require("express");
const {uploadImg} = require('../controller/uploadController');

class UploadRoutes {

    constructor(){
        this.__router = Router();
        this.config();
    }

    config(){
        this.__router.put('/:document/:id', uploadImg);
    }

}

const uploadRoutes = new UploadRoutes();
module.exports = uploadRoutes.__router;