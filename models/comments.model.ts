import { Schema, Document, model } from "mongoose";


const commentSchema = new Schema({
    created: {
        type: Date
    },
    comment: {
        type: String,
        required:true
    },
    reference: {
        type: String,
        required:true
    },
    status:{
        type: String,
        enum: ['ACTIVE','INACTIVE'],
        default: 'ACTIVE'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Debe existir una referecnia a un usuario']
    }
});

commentSchema.pre<IComment>('save', function (next) {
    this.created = new Date();
    next();
});


interface IComment extends Document {
    created: Date;
    comment: string;
    user: string;
    status?: string;
}

export const Comment = model<IComment>('Comment', commentSchema);