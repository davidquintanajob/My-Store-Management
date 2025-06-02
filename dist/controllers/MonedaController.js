"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonedaController = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt((_a = process.env.DB_PORT) !== null && _a !== void 0 ? _a : '5432', 10),
});
class MonedaController {
    getMonedaByArchivo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultado = yield pool.query("SELECT valor FROM moneda WHERE nombre = $1", ["USD"]);
                if (resultado.rows.length === 0) {
                    throw new Error(`Moneda no encontrada`);
                }
                res.status(200).json(resultado.rows[0].valor);
            }
            catch (error) {
                res.status(404).json({ error: "Moneda no encontrada" });
            }
        });
    }
    updateMonedaByArchivo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const valor = parseInt(req.params.valor);
                const resultado = yield pool.query("UPDATE moneda SET valor = $1 WHERE nombre = $2", [valor, "USD"]);
                if (resultado.rowCount === 0) {
                    throw new Error(`Moneda no encontrada`);
                }
                res.status(200).json({ message: "Moneda actualizada" });
            }
            catch (error) {
                res.status(404).json({ error: "Moneda no encontrada" });
            }
        });
    }
}
exports.MonedaController = MonedaController;
