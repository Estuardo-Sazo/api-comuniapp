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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_user_1 = require("../middlewares/auth-user");
const comments_model_1 = require("../models/comments.model");
const commentRoutes = (0, express_1.Router)();
//? CREAR POST
commentRoutes.post('/:reference', [auth_user_1.verificaToken], (req, res) => {
    const reference = req.params.reference;
    const body = req.body;
    body.user = req.user._id;
    body.reference = reference;
    comments_model_1.Comment.create(body).then((commenetDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield commenetDB.populate('user', '-password').execPopulate();
        res.json({
            ok: true,
            comment: commenetDB
        });
    })).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
//? GET COMENT
commentRoutes.get('/:reference', [auth_user_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reference = req.params.reference;
    const comments = yield comments_model_1.Comment.find({ $and: [{ reference }, { status: 'ACTIVE' }] }).populate('user', '-password').exec();
    res.json({
        ok: true,
        comments
    });
}));
//? INANCTIVE COMENT
commentRoutes.post('/delete/:id', [auth_user_1.verificaToken], (req, res) => {
    const id = req.params.id;
    comments_model_1.Comment.findByIdAndUpdate({ _id: id }, { status: 'INACTIVE' }, { new: true, runValidators: true }, (err, commenetDB) => {
        if (err) {
            res.json({
                ok: false,
                Error: err,
            });
        }
        if (!commenetDB) {
            res.json({
                ok: false,
                token: 'No existe un Comentario',
            });
        }
        res.json({
            ok: true,
            comment: commenetDB,
        });
    });
});
//? UPDATE COMENT
commentRoutes.post('/update/:id', [auth_user_1.verificaToken], (req, res) => {
    const id = req.params.id;
    const body = req.body;
    comments_model_1.Comment.findByIdAndUpdate({ _id: id }, body, { new: true, runValidators: true }, (err, commenetDB) => {
        if (err) {
            res.json({
                ok: false,
                Error: err,
            });
        }
        if (!commenetDB) {
            res.json({
                ok: false,
                token: 'No existe un usuario',
            });
        }
        res.json({
            ok: true,
            comment: commenetDB,
        });
    });
});
exports.default = commentRoutes;
