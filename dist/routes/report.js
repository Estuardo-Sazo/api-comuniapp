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
const file_system_report_1 = __importDefault(require("../classes/file-system-report"));
const auth_user_1 = require("../middlewares/auth-user");
const report_model_1 = require("../models/report.model");
const reportRoutes = (0, express_1.Router)();
const fileSystem = new file_system_report_1.default();
//? CREAR  Report
reportRoutes.post('/', [auth_user_1.verificaToken], (req, res) => {
    console.log('POST: REPORT');
    if (req.typeUser == 'USER') {
        res.json({
            ok: false,
            message: 'Permisos denegados'
        });
    }
    else {
        const body = req.body;
        body.user = req.user._id;
        const imagenes = fileSystem.imagenesTempReport(req.user._id);
        body.imgs = imagenes;
        report_model_1.Report.create(body).then((dataDB) => __awaiter(void 0, void 0, void 0, function* () {
            yield dataDB.populate('user', '-password').populate('type').execPopulate();
            res.json({
                ok: true,
                report: dataDB
            });
        })).catch(err => {
            res.json({
                ok: false,
                err
            });
        });
    }
});
//? UPLOAD IMAGES
reportRoutes.post('/upload', [auth_user_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('POST: UPLOAD IMG REPORT');
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
//? GET IMAGE REPORT
reportRoutes.get('/image/:userId/:img', (req, res) => {
    console.log('GET:  IMG REPORT');
    const userId = req.params.userId;
    const img = req.params.img;
    const pathImg = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathImg);
});
exports.default = reportRoutes;
