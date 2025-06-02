"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generarJsonWebToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = '02030672924hfzrttuiejaiwjiadkamzijfaofkaslfk'; // Cambia esto por tu clave secreta
const generarJsonWebToken = (payload) => {
    const token = jsonwebtoken_1.default.sign(payload, secretKey, {
        expiresIn: '5h' // El token expirará en 5 horas
    });
    return token;
};
exports.generarJsonWebToken = generarJsonWebToken;
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]; // Especifica el tipo de token como string
    if (!token) {
        return res.status(403).send("Token requerido");
    }
    jsonwebtoken_1.default.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send("Token inválido");
        }
        req.user = decoded; // Guarda la información decodificada en el request
        next();
    });
};
exports.verifyToken = verifyToken;
