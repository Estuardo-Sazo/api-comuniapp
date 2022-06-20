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
const type_report_model_1 = require("../models/type-report.model");
const typeReportRoutes = (0, express_1.Router)();
//? GET REPORTS
typeReportRoutes.get('/', [auth_user_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('GET: TYPE REPORT');
    const typeReports = yield type_report_model_1.TypeReport.find({ status: { $ne: 'INACTIVE' } }).exec();
    res.json({
        ok: true,
        typeReports
    });
}));
//? GET REPORTS ID
typeReportRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const typeReport = yield type_report_model_1.TypeReport.find({ _id: id }).exec();
    res.json({
        ok: true,
        typeReport
    });
}));
//? CREAR Type Report
typeReportRoutes.post('/', [auth_user_1.verificaToken], [auth_user_1.verificaTokenPermis], (req, res) => {
    console.log('POST: TYPE REPORT');
    if (req.typeUser == 'USER') {
        res.json({
            ok: false,
            message: 'Permisos denegados'
        });
    }
    else {
        const body = req.body;
        type_report_model_1.TypeReport.create(body).then((dataDB) => __awaiter(void 0, void 0, void 0, function* () {
            res.json({
                ok: true,
                typeReport: dataDB
            });
        })).catch(err => {
            res.json({
                ok: false,
                err
            });
        });
    }
});
//? UPDATE TYPE REPORT
typeReportRoutes.post('/update', [auth_user_1.verificaToken], [auth_user_1.verificaTokenPermis], (req, res) => {
    console.log('UPDATE: TYPE REPORT');
    const body = req.body;
    if (req.typeUser == 'USER') {
        res.json({
            ok: false,
            message: 'Permisos denegados'
        });
    }
    else {
        const body = req.body;
        type_report_model_1.TypeReport.findByIdAndUpdate(body._id, body, { new: true, runValidators: true }, (err, dataDB) => {
            res.json({
                ok: true,
                typeReport: dataDB
            });
        }).catch(err => {
            res.json({
                ok: false,
                err
            });
        });
    }
});
//! DELETE TYPE REPORT
typeReportRoutes.post('/update/delete', [auth_user_1.verificaToken], [auth_user_1.verificaTokenPermis], (req, res) => {
    console.log('DELETE: TYPE REPORT');
    const body = req.body;
    body.status = 'INACTIVE';
    if (req.typeUser == 'USER') {
        res.json({
            ok: false,
            message: 'Permisos denegados'
        });
    }
    else {
        const body = req.body;
        type_report_model_1.TypeReport.findByIdAndUpdate(body._id, body, { new: true, runValidators: true }, (err, dataDB) => {
            res.json({
                ok: true,
                typeReport: dataDB
            });
        }).catch(err => {
            res.json({
                ok: false,
                err
            });
        });
    }
});
exports.default = typeReportRoutes;
