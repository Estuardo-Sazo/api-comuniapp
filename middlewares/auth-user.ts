
import { Request, Response, NextFunction } from 'express';
import Token from '../classes/token';

export const verificaToken = (req: any, res: Response, next: NextFunction) => {
    const userToken = req.get('x-token') || '';
    Token.comprobarToket(userToken).
        then((decode: any) => {
            req.user = decode.user;
            next();
        })
        .catch(err => {
            res.json({
                ok: false,
                mensaje: "Token incorrect"
            });
        });
}