"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const Usuario_1 = require("../entities/Usuario");
const Tienda_1 = require("../entities/Tienda");
const Accion_1 = require("../entities/Accion");
const Cliente_1 = require("../entities/Cliente");
const Deuda_1 = require("../entities/Deuda");
const Encargo_1 = require("../entities/Encargo");
const Entrada_1 = require("../entities/Entrada");
const Garantia_1 = require("../entities/Garantia");
const Imagen_1 = require("../entities/Imagen");
const Pago_Deuda_1 = require("../entities/Pago_Deuda");
const Permiso_1 = require("../entities/Permiso");
const Producto_tienda_1 = require("../entities/Producto_tienda");
const Producto_1 = require("../entities/Producto");
const Proveedor_1 = require("../entities/Proveedor");
const Rol_permiso_1 = require("../entities/Rol_permiso");
const Rol_1 = require("../entities/Rol");
const Servicio_1 = require("../entities/Servicio");
const Tipo_servicio_1 = require("../entities/Tipo_servicio");
const Venta_1 = require("../entities/Venta");
const Salida_1 = require("../entities/Salida");
const Tipo_accion_1 = require("../entities/Tipo_accion");
const Moneda_1 = require("../entities/Moneda");
const Diario_1 = require("../entities/Diario");
dotenv_1.default.config();
const connectDB = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt((_a = process.env.DB_PORT) !== null && _a !== void 0 ? _a : '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        Accion_1.Accion,
        Cliente_1.Cliente,
        Deuda_1.Deuda,
        Encargo_1.Encargo,
        Entrada_1.Entrada,
        Garantia_1.Garantia,
        Imagen_1.Imagen,
        Pago_Deuda_1.Pago_Deuda,
        Permiso_1.Permiso,
        Producto_tienda_1.Producto_tienda,
        Producto_1.Producto,
        Proveedor_1.Proveedor,
        Rol_permiso_1.Rol_permiso,
        Rol_1.Rol,
        Servicio_1.Servicio,
        Tienda_1.Tienda,
        Tipo_servicio_1.Tipo_servicio,
        Usuario_1.Usuario,
        Venta_1.Venta,
        Salida_1.Salida,
        Tipo_accion_1.Tipo_accion,
        Moneda_1.Moneda,
        Diario_1.Diario
    ],
    migrations: [
        __dirname + "./../Migrations/*.js", // Cambia a .js si estás en producción
    ],
    synchronize: true,
    logging: false,
});
connectDB
    .initialize()
    .then(() => {
    console.log(`Conectado a la Base de Datos`);
})
    .catch((err) => {
    console.error(`Error al conectar a la Base de Datos`, err);
});
exports.default = connectDB;
