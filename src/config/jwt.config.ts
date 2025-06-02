import { NextFunction, Request,Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const secretKey = '02030672924hfzrttuiejaiwjiadkamzijfaofkaslfk'; // Cambia esto por tu clave secreta

export const generarJsonWebToken=(payload: any): string => {
    const token = jwt.sign(payload, secretKey, {
        expiresIn: '5h' // El token expirará en 5 horas
    });
    return token;
}
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"] as string; // Especifica el tipo de token como string
    if (!token) {
        return res.status(403).send("Token requerido");
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send("Token inválido");
        }
        req.user = decoded as string | JwtPayload; // Guarda la información decodificada en el request
        next();
    });
};