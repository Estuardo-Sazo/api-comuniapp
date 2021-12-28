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
const image_upload_1 = __importDefault(require("../classes/image-upload"));
const fileSystem = new file_system_report_1.default();
const imageUpload = new image_upload_1.default();
const folderImagesName = 'report';
const reportRoutes = (0, express_1.Router)();
//? GET Reports
reportRoutes.get('/:id', [auth_user_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const report = yield report_model_1.Report.find({ _id: id }).populate('user', '-password').populate('type').exec();
    res.json({
        ok: true,
        report
    });
}));
//? GET Reports
reportRoutes.get('/', [auth_user_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip *= 10;
    const id = req.user._id;
    const filter = req.user.type === 'USER' ? { $and: [{ user: id }, { status: 'ACTIVE' }] } : { status: 'ACTIVE' };
    console.log('GET REPORT USER: ', req.user.type);
    const reports = yield report_model_1.Report.find(filter)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('user', '-password')
        .populate('type')
        .exec();
    res.json({
        ok: true,
        pagina,
        reports
    });
}));
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
        //const imagenes = fileSystem.imagenesTempReport(req.user._id);
        const imagenes = imageUpload.moveFileFolderTempToOrginial(req.user._id, folderImagesName);
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
    //await fileSystem.guardarImageTemp(file, req.user._id);
    yield imageUpload.saveImageTemp(file, req.user._id);
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
    //const pathImg = fileSystem.getFotoUrl(userId, img);
    const pathImg = imageUpload.getUrlFile(userId, img, folderImagesName);
    res.sendFile(pathImg);
});
//? INANCTIVE COMENT
reportRoutes.post('/delete/:id', [auth_user_1.verificaToken], (req, res) => {
    console.log('POST:  INACTIVE REPORT');
    const id = req.params.id;
    report_model_1.Report.findByIdAndUpdate({ _id: id }, { status: 'INACTIVE' }, { new: true, runValidators: true }, (err, report) => {
        if (err) {
            res.json({
                ok: false,
                Error: err,
            });
        }
        if (!report) {
            res.json({
                ok: false,
                token: 'No existe un reporte',
            });
        }
        res.json({
            ok: true,
            report: report,
        });
    });
});
exports.default = reportRoutes;
