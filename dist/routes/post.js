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
const file_system_1 = __importDefault(require("../classes/file-system"));
const auth_user_1 = require("../middlewares/auth-user");
const post_model_1 = require("../models/post.model");
const postRoutes = (0, express_1.Router)();
const fileSystem = new file_system_1.default();
//? GET POST
postRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip *= 10;
    const posts = yield post_model_1.Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('user', '-password')
        .exec();
    res.json({
        ok: true,
        pagina,
        posts
    });
}));
//? CREAR POST
postRoutes.post('/', [auth_user_1.verificaToken], [auth_user_1.verificaTokenPermis], (req, res) => {
    if (req.typeUser == 'USER') {
        res.json({
            ok: false,
            message: 'Permisos denegados'
        });
    }
    else {
        const body = req.body;
        body.user = req.user._id;
        const imagenes = fileSystem.imagenesTempPosts(req.user._id);
        body.imgs = imagenes;
        post_model_1.Post.create(body).then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
            yield postDB.populate('user', '-password').execPopulate();
            res.json({
                ok: true,
                post: postDB
            });
        })).catch(err => {
            res.json({
                ok: false,
                err
            });
        });
    }
});
//? Servicio de subida de archivos
postRoutes.post('/upload', [auth_user_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    yield fileSystem.guardarImageTemp(file, req.user._id);
    res.status(200).json({
        ok: true,
        file: file.mimetype
    });
}));
//? mostrarimages
postRoutes.get('/imagen/:userId/:img', (req, res) => {
    const userId = req.params.userId;
    const img = req.params.img;
    const pathImg = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathImg);
});
exports.default = postRoutes;
