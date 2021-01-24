const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

const validRoles = {
    "values": ['ROLE_ADMIN', "ROLE_USER"],
    "message": '{VALUE} is not a valid role'
};

const UserSchema = new mongoose.Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, unique: true, required: [true, 'El email es obligatorio'] },
    password: { type: String, required: [true, 'El password es obligatorio'] },
    google: { type: Boolean, default: false },
    role: { type: String, enum: validRoles, default: 'ROLE_USER' },
    img: { type: String, require: false },
    estado: { type: Boolean, default: true }
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = mongoose.model('User', UserSchema);