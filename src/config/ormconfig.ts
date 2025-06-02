import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Usuario } from "../entities/Usuario";
import { Tienda } from "../entities/Tienda";
import { Accion } from "../entities/Accion";
import { Cliente } from "../entities/Cliente";
import { Deuda } from "../entities/Deuda";
import { Encargo } from "../entities/Encargo";
import { Entrada } from "../entities/Entrada";
import { Garantia } from "../entities/Garantia";
import { Imagen } from "../entities/Imagen";
import { Pago_Deuda } from "../entities/Pago_Deuda";
import { Permiso } from "../entities/Permiso";
import { Producto_tienda } from "../entities/Producto_tienda";
import { Producto } from "../entities/Producto";
import { Proveedor } from "../entities/Proveedor";
import { Rol_permiso } from "../entities/Rol_permiso";
import { Rol } from "../entities/Rol";
import { Servicio } from "../entities/Servicio";
import { Tipo_servicio } from "../entities/Tipo_servicio";
import { Venta } from "../entities/Venta";
import { Salida } from "../entities/Salida";
import { Tipo_accion } from "../entities/Tipo_accion";
import { Moneda } from "../entities/Moneda";
import { Diario } from '../entities/Diario';

dotenv.config();
const connectDB = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    Accion,
    Cliente,
    Deuda,
    Encargo,
    Entrada,
    Garantia,
    Imagen,
    Pago_Deuda,
    Permiso,
    Producto_tienda,
    Producto,
    Proveedor,
    Rol_permiso,
    Rol,
    Servicio,
    Tienda,
    Tipo_servicio,
    Usuario,
    Venta,
    Salida,
    Tipo_accion,
    Moneda,
    Diario
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
export default connectDB;
