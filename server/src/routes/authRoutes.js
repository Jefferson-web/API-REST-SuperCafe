const Router = require('express');
const {login, googleSignIn} = require('../controller/authController');

class AuthRoutes {

    constructor(){
        this.__router = Router();
        this.config();
    }

    config(){
        this.__router.post('/login', login);
        this.__router.post('/google', googleSignIn);
    }

}

const authRoutes = new AuthRoutes();
module.exports = authRoutes.__router;