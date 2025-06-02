import express, { Request, Response } from "express"
import morgan from "morgan"
import cors from "cors"
import notifier from 'node-notifier';
import path from 'path';
import { spawn } from 'child_process';
import { ConfigServer } from "./config/config"
import connectDB from "./config/ormconfig"
import { AccionRouter } from "./routes/AccionRoutes"
import { ClienteRouter } from "./routes/ClienteRoutes"
import { DeudaRouter } from "./routes/DeudaRoutes"
import { EncargoRouter } from "./routes/EncargoRoutes"
import { EntradaRouter } from "./routes/EntradaRoutes"
import { GarantiaRouter } from "./routes/GarantiaRoutes"
import { ImagenRouter } from "./routes/ImagenRoutes"
import { Pago_DeudaRouter } from "./routes/Pago_DeudaRoutes"
import { PermisoRouter } from "./routes/PermisoRoutes"
import { Producto_tiendaRouter } from "./routes/Producto_tiendaRoutes"
import { ProductoRouter } from "./routes/ProductoRoutes"
import { ProveedorRouter } from "./routes/ProveedorRoutes"
import { Rol_permisoRouter } from "./routes/Rol_permisoRoutes"
import { RolRouter } from "./routes/RolRoutes"
import { ServicioRouter } from "./routes/ServicioRoutes"
import { TiendaRouter } from "./routes/TiendaRoutes"
import { Tipo_servicioRouter } from "./routes/Tipo_servicioRoutes"
import { UsuarioRouter } from "./routes/UsuarioRoutes"
import { VentaRouter } from "./routes/VentaRoutes"
import { SalidaRouter } from "./routes/SalidaRouter"
import { Tipo_accionRouter } from "./routes/Tipo_accionRoutes"
import { crearRutaSiNoExiste } from "./helpers/TrataImagen"
import { MonedaRouter } from "./routes/MonedaRoutes";
import { DiarioRouter } from "./routes/DiarioRoutes";
import { crearArchivoSiNoExiste } from "./helpers/MonedaArchivo";

class Gestion_web_Solutel extends ConfigServer {
    public app: express.Application = express();
    private port: number = 3000;

    constructor() {
        super();

        try {
            crearArchivoSiNoExiste();
            crearRutaSiNoExiste("C:\\Solutel1_web_Imagenes")
            this.app.use(express.json({ limit: '50mb' })); // Aumenta el límite del body a 50MB
            this.app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Aumenta el límite de los datos codificados en URL
            this.app.use(morgan("dev"));
            this.app.use(cors());

            this.app.use(this.routers());
            connectDB;
            this.startBuild();
        } catch (e) {
            console.log("Error");
        }
    }

    routers = () => {
        return [
            new AccionRouter().router,
            new ClienteRouter().router,
            new DeudaRouter().router,
            new EncargoRouter().router,
            new EntradaRouter().router,
            new GarantiaRouter().router,
            new ImagenRouter().router,
            new Pago_DeudaRouter().router,
            new PermisoRouter().router,
            new Producto_tiendaRouter().router,
            new ProductoRouter().router,
            new ProveedorRouter().router,
            new Rol_permisoRouter().router,
            new RolRouter().router,
            new ServicioRouter().router,
            new TiendaRouter().router,
            new Tipo_servicioRouter().router,
            new UsuarioRouter().router,
            new VentaRouter().router,
            new SalidaRouter().router,
            new Tipo_accionRouter().router,
            new MonedaRouter().router,
            new DiarioRouter().router
        ];
    }
    startBuild = () => {
        const { exec } = require('child_process'); // Solo una declaración
        const fs = require('fs');
        const path = './Imagenes';

        // Crear la carpeta "Imagenes" si no existe
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        process.stdin.resume();// Mantener la terminal abierta process.stdin.resume();
    }
}

new Gestion_web_Solutel();
//npm run start:dev