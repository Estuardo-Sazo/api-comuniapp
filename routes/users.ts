import { Router, Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt = require("bcrypt");
import Token from "../classes/token";
import { verificaToken } from "../middlewares/auth-user"; 

const userRoutes = Router();

//LOGIN USUARIO
userRoutes.post('/login', (req: Request, res: Response) => {
    const body = req.body;

    User.findOne({ email: body.email }, (err: any, userDB: any) => {
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

    console.log(user);
    
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
    console.log(req.user);
    
  

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
    })
});

export default userRoutes;