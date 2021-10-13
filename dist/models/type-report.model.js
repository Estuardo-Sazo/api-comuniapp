"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeReport = void 0;
const mongoose_1 = require("mongoose");
const typeReportSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    }
});
exports.TypeReport = (0, mongoose_1.model)('TypeReport', typeReportSchema);
