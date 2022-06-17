"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const imag_profile_1 = __importDefault(require("../classes/imag-profile"));
const bcrypt = require("bcrypt");
const token_1 = __importDefault(require("../classes/token"));
const auth_user_1 = require("../middlewares/auth-user");
const image_upload_1 = __importDefault(require("../classes/image-upload"));
const imageUpload = new image_upload_1.default();
const userRoutes = (0, express_1.Router)();
const fileSystem = new imag_profile_1.default();
//* LOGIN USUARIO
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    user_model_1.User.findOne({ $or: [{ email: body.email }, { cui: body.email }] }, (err, userDB) => {
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
userRoutes.post('/login-ad', (req, res) => {
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
        if (userDB.type != 'ADMIN') {
            return res.json({
                ok: false,
                mensaje: "Usuario Incorrecto"
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
userRoutes.post('/login-google', (req, res) => {
    const body = req.body;
    user_model_1.User.findOne({ $or: [{ email: body.email }, { cui: body.email }] }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                isregister: false,
                mensaje: "Usuario Google no existe"
            });
        }
        console.log('USER LOGIN GOOGLE: ', userDB);
        if (userDB.google === true) {
            const tokenUsuario = token_1.default.getJwtToken({
                _id: userDB._id,
                names: userDB.names,
                surnames: userDB.surnames,
                email: userDB.email,
                image: userDB.image,
                type: userDB.type,
                location: userDB.location,
                phone: userDB.phone,
                cui: userDB.cui,
                google: userDB.google
            });
            console.log('--- Login Google');
            res.json({
                ok: true,
                token: tokenUsuario,
            });
        }
        else {
            return res.json({
                ok: false,
                isregister: true,
                mensaje: "Correo de Google ya se encuentra registrado, ingresa con tu contraseña"
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
        password: req.body.password == '' ? '' : bcrypt.hashSync(req.body.password, 10),
        type: req.body.type,
        google: req.body.google
    };
    console.log("CREATED: ", user);
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
    console.log('UPDATE USER: ');
    const userUp = {
        names: req.body.names || req.user.names,
        surnames: req.body.surnames || req.user.surnames,
        phone: req.body.phone || '',
        cui: req.body.cui || '',
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
//Obtener USers
userRoutes.get('/get', [auth_user_1.verificaTokenPermis], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.typeUser == 'USER') {
        res.json({
            ok: false,
            message: 'Permisos denegados'
        });
    }
    else {
        const users = yield user_model_1.User.find()
            .sort({ _id: -1 })
            .exec();
        res.json({
            ok: true,
            users
        });
    }
}));
//Obtener USers for type
userRoutes.post('/list', [auth_user_1.verificaTokenPermis], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.typeUser != 'ADMIN') {
        res.json({
            ok: false,
            message: 'Permisos denegados'
        });
    }
    else {
        const type = req.body.type;
        const users = yield user_model_1.User.find({ type })
            .exec();
        res.json({
            ok: true,
            users
        });
    }
}));
//? Obtener USers for search
userRoutes.get('/search/:search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.params.search;
    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchRgx = rgx(search);
    const users = yield user_model_1.User.find({ $or: [{ names: { $regex: searchRgx, $options: "i" } }, { surnames: { $regex: searchRgx, $options: "i" } }] })
        .exec();
    res.json({
        ok: true,
        users
    });
}));
//? UPDATE IMAGE PROFILE
userRoutes.post('/upload', [auth_user_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('POST: UPLOAD IMG PROFILE');
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: "No subió ningun archivo"
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: "No subió ningun archivo- imagen"
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: "No subió una imagen"
        });
    }
    const userId = req.user._id;
    const repose = imageUpload.deleteFilfeTemp(userId, 'profile');
    const path = yield fileSystem.guardarImageProfile(file, req.user._id);
    console.log(repose);
    console.log('PHOTO UPDATE USER ID :' + userId);
    res.status(200).send(path);
}));
//? GET IMAGE PROFIME
userRoutes.get('/image/:userId/:img', (req, res) => {
    console.log('GET:  IMG PROFILE');
    const userId = req.params.userId;
    console.log('USER ID :', userId);
    const img = req.params.img;
    const pathImg = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathImg);
});
exports.default = userRoutes;
