import jwt from 'jsonwebtoken';

export default class Token {
    private static seed: string = "app-secret";
    private static caducidad: string = "5d";

    constructor() {

    }

    static getJwtToken(payload: any): string {
        return jwt.sign({
            user: payload
        }, this.seed,
            {
                expiresIn: this.caducidad
            });
    }
    static comprobarToket(userToken: string) {
        return new Promise((resolve, reject) => {

            jwt.verify(userToken, this.seed, (err: any, decoded: any) => {
                if (err) {
                    reject();
                } else {
                    ///token valido
                    resolve(decoded);
                }
            })
        });
    }
}