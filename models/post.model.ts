import { Schema, Document, model } from "mongoose";

const postSchema = new Schema({
    created: {
        type: Date
    },
    message: {
        type: String
    },
    imgs: [{
        type: String
    }],
    status:{
        type: String,
        enum: ['ACTIVE','INACTIVE'],
        default: 'ACTIVE'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Debe existir una referecnia a un usuario']
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Debe existir una referecnia a un usuario'],
        unique: true,
    }]
});

postSchema.pre<IPost>('save', function (next) {
    this.created = new Date();
    next();
});


interface IPost extends Document {
    created: Date;
    message: string;
    imgs?: string[];
    user: string;
    status?: string;
}

export const Post = model<IPost>('Post', postSchema);
