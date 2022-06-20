import { model, Schema, Document } from "mongoose";
import bcrypt = require("bcrypt");


const userSchema = new Schema({
    names: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    surnames: {
        type: String,
        required: [true, 'Los apellidos son necesarios'],
    },
    image: {
        type: String,
        default: 'profile.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario'],
    },
    cui: {
        type: String,       
    },
    phone: {
        type: String,
        
    },
    location: {
        type: String
    },
    password: {
        type: String,
    },
    type:{
        type: String,
        enum: ['ADMIN','EDITOR','USER'],
        default: 'USER'
    },
    google:{
        type: Boolean,
        default: false
    }
        
});

userSchema.method('compararPassword', function (password: string = ''): boolean {
    //@ts-ignore
    if (bcrypt.compareSync(password, this.password )) {
        return true;
    } else {
        return false;
    }
});

interface IUsuario extends Document {
    names: string;
    surnames: string;
    cui?: string;
    phone?: string;
    location?: string;
    email: string;
    image?: string;
    password: string;
    type?: string;


    compararPassword(password: string): boolean;
}

export const User = model<IUsuario>('User', userSchema);