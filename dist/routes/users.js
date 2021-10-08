"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const bcrypt = require("bcrypt");
/* import Token from "../classes/token";
import { verificaToken } from "../middlewares/autentucacion"; */
const userRoutes = (0, express_1.Router)();
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
        res.json({
            ok: true,
            token: userDB,
        });
    }).catch(err => {
        res.json({ ok: false, err });
    });
});
userRoutes.get('/', (req, res) => {
    res.json({
        ok: true,
        token: 'HOLA',
    });
});
exports.default = userRoutes;
