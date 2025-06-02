"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentaRouter = void 0;
const VentaController_1 = require("../controllers/VentaController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class VentaRouter extends router_1.BaseRouter {
    constructor() {
        super(VentaController_1.VentaController);
    }
    routes() {
        this.router.get('/Venta', [jwt_config_1.verifyToken], (req, res) => this.controller.getVenta(req, res));
        // Venta por id
        this.router.get('/VentabyId/:id_producto/:id_servicio', [jwt_config_1.verifyToken], (req, res) => this.controller.getVentaById(req, res));
        // adicionar Venta
        this.router.post('/Venta/createVenta', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createVenta(req, res); });
        //modificar Venta
        this.router.put('/Venta/updateVenta', [jwt_config_1.verifyToken], (req, res) => this.controller.updateVenta(req, res));
        // eliminar Venta
        this.router.delete('/Venta/deleteVenta/:id_producto/:id_servicio', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteVenta(req, res));
        this.router.get("/Venta/getProductosMasVendidos/all", [jwt_config_1.verifyToken], (req, res) => this.controller.listaVendidos(req, res));
        this.router.get("/Venta/getProductosMasVendidos/porFecha", [jwt_config_1.verifyToken], (req, res) => this.controller.listaVendidosPorFecha(req, res));
        this.router.get("/Venta/getbyProducto/:id_producto", [jwt_config_1.verifyToken], (req, res) => this.controller.findVentabyId_producto(req, res));
        this.router.get("/Venta/getbyServicio/:id_servicio", [jwt_config_1.verifyToken], (req, res) => this.controller.findVentabyId_servicio(req, res));
    }
}
exports.VentaRouter = VentaRouter;
