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
const image_upload_1 = __importDefault(require("../classes/image-upload"));
const fileSystem = new file_system_1.default();
const imageUpload = new image_upload_1.default();
const folderImagesName = 'posts';
const postRoutes = (0, express_1.Router)();
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
        //const imagenes = fileSystem.imagenesTempPosts(req.user._id);
        const imagenes = imageUpload.moveFileFolderTempToOrginial(req.user._id, folderImagesName);
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
//? UPLOAD  IMAGE POST
postRoutes.post('/upload', [auth_user_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('POST: UPLOAD IMG POST');
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
    //await fileSystem.guardarImageTemp(file, req.user._id);
    yield imageUpload.saveImageTemp(file, req.user._id);
    res.status(200).json({
        ok: true,
        file: file.mimetype
    });
}));
//? mGET IMAGE POST
postRoutes.get('/imagen/:userId/:img', (req, res) => {
    console.log('GET:  IMG POST');
    const userId = req.params.userId;
    const img = req.params.img;
    const pathImg = imageUpload.getUrlFile(userId, img, folderImagesName);
    res.sendFile(pathImg);
});
//! DELETE FILES TEMP
postRoutes.post('/clearTemp/:userId', (req, res) => {
    console.log('GET:  CLEAR IMG TEMP POST');
    const userId = req.params.userId;
    const img = req.params.img;
    const repose = imageUpload.deleteFilfeFolderTemp(userId);
    res.status(200).json({
        ok: true,
        repose
    });
});
//! POSST LIKE
postRoutes.get('/:postId/like', [auth_user_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    console.log('POST ID:', postId);
    const userId = req.user._id;
    const likeIs = yield post_model_1.Post.find({ $and: [{ _id: postId }, { likes: userId }] }).exec();
    if (likeIs.length > 0) {
        res.json({
            ok: false,
            erro: 'Is liked',
            postId
        });
    }
    else {
        post_model_1.Post.findByIdAndUpdate({ _id: postId }, { $push: { likes: userId } }, { new: true, runValidators: true }, (err, postDB) => {
            if (err) {
                res.json({
                    ok: false,
                    Error: err,
                });
            }
            if (!postDB) {
                res.json({
                    ok: false,
                    token: 'No existe un post',
                });
            }
            res.json({
                ok: true,
                post: postDB,
            });
        });
    }
}));
//! POSST DISLIKE
postRoutes.get('/:postId/dislike', [auth_user_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const userId = req.user._id;
    const likeIs = yield post_model_1.Post.find({ likes: userId }).exec();
    if (likeIs.length === 0) {
        res.json({
            ok: false,
            erro: 'Desliked'
        });
    }
    else {
        post_model_1.Post.findByIdAndUpdate({ _id: postId }, { $pull: { likes: userId } }, { new: true, runValidators: true }, (err, postDB) => {
            if (err) {
                res.json({
                    ok: false,
                    Error: err,
                });
            }
            if (!postDB) {
                res.json({
                    ok: false,
                    token: 'No existe un post',
                });
            }
            res.json({
                ok: true,
                message: 'liked',
                post: postDB,
            });
        });
    }
}));
exports.default = postRoutes;
