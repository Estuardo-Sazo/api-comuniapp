import { Router, Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt = require("bcrypt");
/* import Token from "../classes/token";
import { verificaToken } from "../middlewares/autentucacion"; */

const userRoutes = Router();



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
        
        res.json({
            ok: true,
            token: userDB,
        });

    }).catch(err => {
        res.json({ ok: false, err });
    });

});


userRoutes.get('/', (req: Request, res: Response) => {
    res.json({
        ok: true,
        token: 'HOLA',
    });
});

export default userRoutes;