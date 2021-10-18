import { FileUpload } from "../interfaces/file-upload";
import path from "path";
import fs from "fs";
import uniqid from "uniqid";

export default class FileSystemProfile {
    constructor() {

    }

    guardarImageProfile(file: FileUpload, userId: string) {

        return new Promise((resolve, reject) => {

            //CREAR CARPETA
            const path = this.crearCarpetaUser(userId);

            //Nombre de archivo
            const nombreArchivo = this.generarNombreUnico(file.name);

            //Mover archivo del Temp a la CARPETA
            file.mv(`${path}/${nombreArchivo}`, (err: any) => {
                if (err) {
                    //No se pudo mover
                    reject(err);
                } else {
                    resolve(nombreArchivo);
                }
            });
        });

    }

    private generarNombreUnico(nombreOrg: string) {
        const nombreArr = nombreOrg.split('.');
        const extension = nombreArr[nombreArr.length - 1];

        const idUnico = uniqid();
        return `${idUnico}.${extension}`;

    }

    private crearCarpetaUser(userId: string) {
        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathProfile = pathUser + '/profile';

        const existeUser = fs.existsSync(pathUser);
        const existeRep = fs.existsSync(pathProfile);

        if (!existeUser) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathProfile);
        }
        if (!existeRep) {
            fs.mkdirSync(pathProfile);
        }

        return pathProfile;

    }


    getFotoUrl(userId: string, img: string) {
        //path de posts
        const pathFoto = path.resolve(__dirname, '../uploads', userId, 'profile', img);

        //img existe
        const existe = fs.existsSync(pathFoto);
        if (!existe) {
            return path.resolve(__dirname, '../assets/400x250.jpg')
        }

        return pathFoto;
    }
}


