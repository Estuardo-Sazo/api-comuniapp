"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const mongoose_1 = require("mongoose");
const reportSchema = new mongoose_1.Schema({
    message: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    },
    created: {
        type: Date
    },
    imgs: [{
            type: String
        }],
    coords: {
        type: String
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Debe existir una referecnia a un usuario']
    },
    type: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'TypeReport',
        required: [true, 'Debe existir una referecnia a un tipo de reporte']
    }
});
reportSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Report = (0, mongoose_1.model)('Report', reportSchema);
