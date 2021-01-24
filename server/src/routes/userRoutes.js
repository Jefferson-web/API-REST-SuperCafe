const Router = require('express');
const { findUsers, findUserById, createUser, deleteUser, updateUser } = require('../controller/userController');
const { verifyToken, verifyRole } = require('../utils/authorization');

class UserRoutes {

    constructor() {
        this.__router = Router();
        this.config();
    }

    config() {
        this.__router.get('/', [verifyToken, findUsers]);
        this.__router.get('/:id', [verifyToken, verifyRole, findUserById]);
        this.__router.post('/', [verifyToken, verifyRole, createUser]);
        this.__router.put('/:id', [verifyToken, verifyRole, updateUser]);
        this.__router.delete('/:id', [verifyToken, verifyRole, deleteUser]);
    }

}

const userRoutes = new UserRoutes();
module.exports = userRoutes.__router;