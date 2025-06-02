"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config/config");
const ormconfig_1 = __importDefault(require("./config/ormconfig"));
const AccionRoutes_1 = require("./routes/AccionRoutes");
const ClienteRoutes_1 = require("./routes/ClienteRoutes");
const DeudaRoutes_1 = require("./routes/DeudaRoutes");
const EncargoRoutes_1 = require("./routes/EncargoRoutes");
const EntradaRoutes_1 = require("./routes/EntradaRoutes");
const GarantiaRoutes_1 = require("./routes/GarantiaRoutes");
const ImagenRoutes_1 = require("./routes/ImagenRoutes");
const Pago_DeudaRoutes_1 = require("./routes/Pago_DeudaRoutes");
const PermisoRoutes_1 = require("./routes/PermisoRoutes");
const Producto_tiendaRoutes_1 = require("./routes/Producto_tiendaRoutes");
const ProductoRoutes_1 = require("./routes/ProductoRoutes");
const ProveedorRoutes_1 = require("./routes/ProveedorRoutes");
const Rol_permisoRoutes_1 = require("./routes/Rol_permisoRoutes");
const RolRoutes_1 = require("./routes/RolRoutes");
const ServicioRoutes_1 = require("./routes/ServicioRoutes");
const TiendaRoutes_1 = require("./routes/TiendaRoutes");
const Tipo_servicioRoutes_1 = require("./routes/Tipo_servicioRoutes");
const UsuarioRoutes_1 = require("./routes/UsuarioRoutes");
const VentaRoutes_1 = require("./routes/VentaRoutes");
const SalidaRouter_1 = require("./routes/SalidaRouter");
const Tipo_accionRoutes_1 = require("./routes/Tipo_accionRoutes");
const TrataImagen_1 = require("./helpers/TrataImagen");
const MonedaRoutes_1 = require("./routes/MonedaRoutes");
const DiarioRoutes_1 = require("./routes/DiarioRoutes");
const MonedaArchivo_1 = require("./helpers/MonedaArchivo");
class Gestion_web_Solutel extends config_1.ConfigServer {
    constructor() {
        super();
        this.app = (0, express_1.default)();
        this.port = 3000;
        this.routers = () => {
            return [
                new AccionRoutes_1.AccionRouter().router,
                new ClienteRoutes_1.ClienteRouter().router,
                new DeudaRoutes_1.DeudaRouter().router,
                new EncargoRoutes_1.EncargoRouter().router,
                new EntradaRoutes_1.EntradaRouter().router,
                new GarantiaRoutes_1.GarantiaRouter().router,
                new ImagenRoutes_1.ImagenRouter().router,
                new Pago_DeudaRoutes_1.Pago_DeudaRouter().router,
                new PermisoRoutes_1.PermisoRouter().router,
                new Producto_tiendaRoutes_1.Producto_tiendaRouter().router,
                new ProductoRoutes_1.ProductoRouter().router,
                new ProveedorRoutes_1.ProveedorRouter().router,
                new Rol_permisoRoutes_1.Rol_permisoRouter().router,
                new RolRoutes_1.RolRouter().router,
                new ServicioRoutes_1.ServicioRouter().router,
                new TiendaRoutes_1.TiendaRouter().router,
                new Tipo_servicioRoutes_1.Tipo_servicioRouter().router,
                new UsuarioRoutes_1.UsuarioRouter().router,
                new VentaRoutes_1.VentaRouter().router,
                new SalidaRouter_1.SalidaRouter().router,
                new Tipo_accionRoutes_1.Tipo_accionRouter().router,
                new MonedaRoutes_1.MonedaRouter().router,
                new DiarioRoutes_1.DiarioRouter().router
            ];
        };
        this.startBuild = () => {
            const { exec } = require('child_process'); // Solo una declaración
            const fs = require('fs');
            const path = './Imagenes';
            // Crear la carpeta "Imagenes" si no existe
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
            process.stdin.resume(); // Mantener la terminal abierta process.stdin.resume();
        };
        try {
            (0, MonedaArchivo_1.crearArchivoSiNoExiste)();
            (0, TrataImagen_1.crearRutaSiNoExiste)("C:\\Solutel1_web_Imagenes");
            this.app.use(express_1.default.json({ limit: '50mb' })); // Aumenta el límite del body a 50MB
            this.app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' })); // Aumenta el límite de los datos codificados en URL
            this.app.use((0, morgan_1.default)("dev"));
            this.app.use((0, cors_1.default)());
            this.app.use(this.routers());
            ormconfig_1.default;
            this.startBuild();
        }
        catch (e) {
            console.log("Error");
        }
    }
}
new Gestion_web_Solutel();
//npm run start:dev
