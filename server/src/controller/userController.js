const User = require('../model/User');
const bcrypt = require('bcryptjs');

async function findUsers(req, res, next) {
    let page = req.query['page'] || 0;
    page = Number(page);
    let limit = req.query['limit'] || 5;
    limit = Number(limit);
    await User
        .find({}, 'nombre email google role img estado')
        .skip(page)
        .limit(limit)
        .exec((err, users) => {
            if (err) throw err;
            User.count({ estado: true }, (err, amount) => {
                return res.status(200).json({
                    "users": users,
                    "amount": amount
                });
            });
        });
}

async function findUserById(req, res, next) {
    const id = req.params['id'];
    await User.findById(id, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.status(404).json({
                "title": "Resource not found",
                "status": 404,
                "detail": `User with id ${id} not found`,
                "timestamp": Date.now()
            });
        }
        return res.status(200).json(user);
    });
}

async function createUser(req, res, next) {
    let payload = req.body;
    const user = new User(payload);
    user.password = encode(payload.password);
    await user.save((err, newUser) => {
        if (err) {
            return res.status(400).json({
                "title": "Bad Request",
                "status": 400,
                "detail": err,
                "timestamp": Date.now()
            });
        }
        return res.status(201).json({
            "message": "User successfully created.",
            "user": newUser
        });
    });
}

function encode(password, saltRounds = 10) {
    return bcrypt.hashSync(password, saltRounds);
}

async function updateUser(req, res, next) {
    const id = req.params['id'];
    const payload = req.body;
    await User.findByIdAndUpdate({ "_id": id }, payload, { new: true, runValidators: true }, (err, user) => {
        if (err) {
            return res.status(400).json({
                "title": "Bad Request",
                "status": 400,
                "detail": err,
                "timestamp": Date.now()
            });
        }
        if (!user) {
            return res.status(404).json({
                "title": "Resource not found",
                "status": 404,
                "detail": `User with id ${id} not found`,
                "timestamp": Date.now()
            });
        }
        return res.status(200).json({
            "message": "User successfully updated",
            "updated_user": user
        });
    });
}

async function deleteUser(req, res, next) {
    const id = req.params['id'];
    await User.findOneAndUpdate({ "_id": id }, { estado: false }, { new: true }, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.status(404).json({
                "title": "Resource not found",
                "status": 404,
                "detail": `User with id ${id} not found`,
                "timestamp": Date.now()
            });
        }
        return res.status(200).json({
            "message": "User successfully deleted",
            "deleted_user": user
        })
    });
}

module.exports = {
    findUsers,
    findUserById,
    createUser,
    updateUser,
    deleteUser
}