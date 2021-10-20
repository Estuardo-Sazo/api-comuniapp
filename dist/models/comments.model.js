"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    comment: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Debe existir una referecnia a un usuario']
    }
});
commentSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Comment = (0, mongoose_1.model)('Comment', commentSchema);
