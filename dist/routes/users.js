"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const bcrypt = require("bcrypt");
const token_1 = __importDefault(require("../classes/token"));
const auth_user_1 = require("../middlewares/auth-user");
const userRoutes = (0, express_1.Router)();
//* LOGIN USUARIO
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    user_model_1.User.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: "Usuario/Contraseña son incorrectos"
            });
        }
        if (userDB.compararPassword(body.password)) {
            const tokenUsuario = token_1.default.getJwtToken({
                _id: userDB._id,
                names: userDB.names,
                surnames: userDB.surnames,
                email: userDB.email,
                image: userDB.image,
                type: userDB.type,
                location: userDB.location,
                phone: userDB.phone,
                cui: userDB.cui
            });
            console.log('--- Login');
            res.json({
                ok: true,
                token: tokenUsuario,
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: "Usuario/Contraseña son incorrectos "
            });
        }
    });
});
//TODO: Create User
userRoutes.post('/create', (req, res) => {
    const user = {
        names: req.body.names,
        surnames: req.body.surnames,
        phone: req.body.phone,
        cui: req.body.cui,
        location: req.body.location,
        email: req.body.email,
        image: req.body.image,
        password: bcrypt.hashSync(req.body.password, 10),
        type: req.body.type
    };
    console.log(user);
    user_model_1.User.create(user).then(userDB => {
        const tokenUsuario = token_1.default.getJwtToken({
            _id: userDB._id,
            names: userDB.names,
            surnames: userDB.surnames,
            email: userDB.email,
            image: userDB.image,
            type: userDB.type,
            location: userDB.location,
            phone: userDB.phone,
            cui: userDB.cui
        });
        res.json({
            ok: true,
            token: tokenUsuario,
        });
    }).catch(err => {
        res.json({ ok: false, err });
    });
});
//UPDATE
userRoutes.post('/update', auth_user_1.verificaToken, (req, res) => {
    const userUp = {
        names: req.body.names || req.user.names,
        surnames: req.body.surnames || req.user.surnames,
        phone: req.body.phone || req.user.phone,
        cui: req.body.cui || req.user.cui,
        location: req.body.location || req.user.location,
        email: req.body.email || req.user.email,
        image: req.body.image || req.user.image,
        type: req.body.type || req.user.type
    };
    user_model_1.User.findByIdAndUpdate(req.user._id, userUp, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            res.json({
                ok: false,
                Error: err,
            });
        }
        if (!userDB) {
            res.json({
                ok: false,
                token: 'No existe un usuario',
            });
        }
        const tokenUsuario = token_1.default.getJwtToken({
            _id: userDB._id,
            names: userDB.names,
            surnames: userDB.surnames,
            email: userDB.email,
            image: userDB.image,
            type: userDB.type,
            location: userDB.location,
            phone: userDB.phone,
            cui: userDB.cui
        });
        res.json({
            ok: true,
            token: tokenUsuario,
        });
    });
});
//Obtener USer
userRoutes.get('/', auth_user_1.verificaToken, (req, res) => {
    const usuario = req.user;
    res.json({
        ok: true,
        usuario
    });
});
exports.default = userRoutes;
