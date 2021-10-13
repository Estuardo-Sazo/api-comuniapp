import { model, Schema, Document } from "mongoose";


const typeReportSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    status:{
        type: String,
        enum: ['ACTIVE','INACTIVE'],
        default: 'ACTIVE'
    }

});

interface ITypeReport extends Document {
    name: string;
    status: string;

}

export const TypeReport = model<ITypeReport>('TypeReport', typeReportSchema);