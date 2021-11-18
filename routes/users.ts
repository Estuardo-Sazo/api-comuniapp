import { Router, Request, Response } from "express";
import { User } from "../models/user.model";
import { FileUpload } from "../interfaces/file-upload";
import FileSystemProfile from "../classes/imag-profile";
import bcrypt = require("bcrypt");
import Token from "../classes/token";
import { verificaToken,verificaTokenPermis } from "../middlewares/auth-user"; 

const userRoutes = Router();
const fileSystem = new FileSystemProfile();

//* LOGIN USUARIO
userRoutes.post('/login', (req: Request, res: Response) => {
    const body = req.body;

    User.findOne({ $or:[{email: body.email },{cui:body.email}]}, (err: any, userDB: any) => {
        if (err) throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: "Usuario/Contraseña son incorrectos"
            });
        }

        if (userDB.compararPassword(body.password)) {
            const tokenUsuario = Token.getJwtToken({
                _id: userDB._id,
                names: userDB.names,
                surnames: userDB.surnames,
                email: userDB.email,
                image: userDB.image,
                type: userDB.type,
                location: userDB.location,
                phone: userDB.phone,
                cui: userDB.cui
            });
           console.log('--- Login');
           
            res.json({
                ok: true,
                token: tokenUsuario,
            });
        } else {
            return res.json({
                ok: false,
                mensaje: "Usuario/Contraseña son incorrectos "
            });
        }

    })
});

userRoutes.post('/login-ad', (req: Request, res: Response) => {
    const body = req.body;

    User.findOne({ email: body.email }, (err: any, userDB: any) => {
        if (err) throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: "Usuario/Contraseña son incorrectos"
            });
        }
        if(userDB.type!='ADMIN'){
            return res.json({
                ok: false,
                mensaje: "Usuario Incorrecto"
            });
        }

        if (userDB.compararPassword(body.password)) {
            const tokenUsuario = Token.getJwtToken({
                _id: userDB._id,
                names: userDB.names,
                surnames: userDB.surnames,
                email: userDB.email,
                image: userDB.image,
                type: userDB.type,
                location: userDB.location,
                phone: userDB.phone,
                cui: userDB.cui
            });
           console.log('--- Login');
           
            res.json({
                ok: true,
                token: tokenUsuario,
            });
        } else {
            return res.json({
                ok: false,
                mensaje: "Usuario/Contraseña son incorrectos "
            });
        }

    })
});

//TODO: Create User
userRoutes.post('/create', (req: Request, res: Response) => {
    const user = {
        names: req.body.names,
        surnames: req.body.surnames,
        phone: req.body.phone,
        cui: req.body.cui,
        location:req.body.location,
        email: req.body.email,
        image: req.body.image,
        password:  bcrypt.hashSync(req.body.password, 10),
        type: req.body.type
       
    };

    
    User.create(user).then(userDB => {
        const tokenUsuario = Token.getJwtToken({
            _id: userDB._id,
            names: userDB.names,
            surnames: userDB.surnames,
            email: userDB.email,
            image: userDB.image,
            type: userDB.type,
            location: userDB.location,
            phone: userDB.phone,
            cui: userDB.cui
        });
       
        res.json({
            ok: true,
            token: tokenUsuario,
        });

    }).catch(err => {
        res.json({ ok: false, err });
    });

});

//UPDATE
userRoutes.post('/update', verificaToken, (req: any, res: Response) => {
    const userUp = {        
        names: req.body.names || req.user.names,
        surnames: req.body.surnames || req.user.surnames,
        phone: req.body.phone || req.user.phone,
        cui: req.body.cui || req.user.cui,
        location:req.body.location || req.user.location,
        email: req.body.email || req.user.email,
        image: req.body.image || req.user.image,
        type: req.body.type || req.user.type
    };
     

    User.findByIdAndUpdate(req.user._id, userUp, { new: true, runValidators: true}, (err: any, userDB: any) => {
        if (err) {
            res.json({
                ok: false,
                Error: err,
            });
        }
        if (!userDB) {
            res.json({
                ok: false,
                token: 'No existe un usuario',
            });
        }

        const tokenUsuario = Token.getJwtToken({
            _id: userDB._id,
            names: userDB.names,
            surnames: userDB.surnames,
            email: userDB.email,
            image: userDB.image,
            type: userDB.type,
            location: userDB.location,
            phone: userDB.phone,
            cui: userDB.cui
        });
        res.json({
            ok: true,
            token: tokenUsuario,
        });

    });

});


//Obtener USer
userRoutes.get('/', verificaToken, (req: any, res: Response) => {
    const usuario = req.user;

    res.json({
        ok: true,
        usuario
    });
});


//Obtener USers
userRoutes.get('/get',[verificaTokenPermis], async (req: any, res: Response) => {
    if(req.typeUser=='USER'){
        res.json({
            ok: false,
            message: 'Permisos denegados'
        });
    }else{        
        const users = await User.find()
        .sort({ _id: -1 })
        .exec();
        res.json({
            ok: true,
            users
        });
    }
});


//Obtener USers for type
userRoutes.post('/list',[verificaTokenPermis], async (req: any, res: Response) => {
    if(req.typeUser!='ADMIN'){
        res.json({
            ok: false,
            message: 'Permisos denegados'
        });
    }else{     
        const type = req.body.type;   
        const users = await User.find({ type })
                                .exec();
        res.json({
            ok: true,
            users
        });
    }
});


//? Obtener USers for search
userRoutes.get('/search/:search', async (req: any, res: Response) => {
    const search = req.params.search;
    console.log('SEARCH: ',search);
    
        const users = await User.find({$or:[{ names:"/"+search+"/" },{ surnames:"/"+search+"/"}]})
                                .exec();
        res.json({
            ok: true,
            users
        });
    
});

//? UPDATE IMAGE PROFILE
userRoutes.post('/upload', [verificaToken], async (req: any, res: Response) => {
    
    console.log('POST: UPLOAD IMG PROFILE');


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: "No subió ningun archivo"
        });
    }

    const file: FileUpload = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: "No subió ningun archivo- imagen"
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: "No subió una imagen"
        });
    }

    const path =await fileSystem.guardarImageProfile(file, req.user._id);
    const userId = req.user._id
    
    console.log(path);
    console.log('USER ID :', userId);
    
    res.status(200).send(
       path
    );

});

//? GET IMAGE REPORT
userRoutes.get('/image/:userId/:img', (req: any, res: Response) => {
    console.log('GET:  IMG PROFILE');
    
    
    const userId = req.params.userId;
    console.log('USER ID :', userId);
    const img = req.params.img;
    const pathImg = fileSystem.getFotoUrl(userId, img);

    res.sendFile(pathImg);
});


export default userRoutes;