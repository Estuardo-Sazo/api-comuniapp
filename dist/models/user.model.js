"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose_1.Schema({
    names: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    surnames: {
        type: String,
        required: [true, 'Los apellidos son necesarios'],
    },
    image: {
        type: String,
        default: 'profile.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario'],
    },
    cui: {
        type: String,
        unique: true,
    },
    phone: {
        type: String,
        unique: true,
    },
    location: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    type: {
        type: String,
        enum: ['ADMIN', 'EDITOR', 'USER'],
        default: 'USER'
    }
});
userSchema.method('compararPassword', function (password = '') {
    if (bcrypt.compareSync(password, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
exports.User = (0, mongoose_1.model)('User', userSchema);
