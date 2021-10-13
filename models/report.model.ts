import { model, Schema, Document } from "mongoose";


const reportSchema = new Schema({
    message: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    status:{
        type: String,
        enum: ['ACTIVE','INACTIVE'],
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
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Debe existir una referecnia a un usuario']
    },
    type: {
        type: Schema.Types.ObjectId,
        ref: 'TypeReport',
        required: [true, 'Debe existir una referecnia a un tipo de reporte']
    }

});

reportSchema.pre<IReport>('save', function (next) {
    this.created = new Date();
    next();
});

interface IReport extends Document {
    created: Date;
    message: string;
    imgs?: string[];
    coords?: string;
    user: string;
    type: string;


}

export const Report = model<IReport>('Report', reportSchema);