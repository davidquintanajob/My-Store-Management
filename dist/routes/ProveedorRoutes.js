"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProveedorRouter = void 0;
const ProveedorController_1 = require("../controllers/ProveedorController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class ProveedorRouter extends router_1.BaseRouter {
    constructor() {
        super(ProveedorController_1.ProveedorController);
    }
    routes() {
        this.router.get('/Proveedor', [jwt_config_1.verifyToken], (req, res) => this.controller.getProveedor(req, res));
        // Proveedor por id
        this.router.get('/Proveedor/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.getProveedorById(req, res));
        // adicionar Proveedor
        this.router.post('/Proveedor/createProveedor', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createProveedor(req, res); });
        //modificar Proveedor
        this.router.put('/Proveedor/updateProveedor/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.updateProveedor(req, res));
        // eliminar Proveedor
        this.router.delete('/Proveedor/deleteProveedor/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteProveedor(req, res));
        this.router.post('/Proveedor/ordenar/all', [jwt_config_1.verifyToken], (req, res) => this.controller.OrdenarProveedor(req, res));
        this.router.post('/Proveedor/api/filtrar', [jwt_config_1.verifyToken], (req, res) => this.controller.FiltrarProveedor(req, res));
    }
}
exports.ProveedorRouter = ProveedorRouter;
