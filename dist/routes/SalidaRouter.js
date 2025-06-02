"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalidaRouter = void 0;
const SalidaController_1 = require("../controllers/SalidaController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class SalidaRouter extends router_1.BaseRouter {
    constructor() {
        super(SalidaController_1.SalidaController);
    }
    routes() {
        this.router.get('/Salida', [jwt_config_1.verifyToken], (req, res) => this.controller.getSalida(req, res));
        // Salida por id
        this.router.get('/Salida/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.getSalidaById(req, res));
        // adicionar Salida
        this.router.post('/Salida/createSalida', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createSalida(req, res); });
        //modificar Salida
        this.router.put('/Salida/updateSalida/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.updateSalida(req, res));
        // eliminar Salida
        this.router.delete('/Salida/deleteSalida/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteSalida(req, res));
        this.router.get('/Salida/getPaginated/:page', [jwt_config_1.verifyToken], (req, res) => this.controller.getSalidasPaginated(req, res));
        this.router.post('/Salida/ordenar/all', [jwt_config_1.verifyToken], (req, res) => this.controller.OrdenarSalida(req, res));
        this.router.post('/Salida/api/filtrar', [jwt_config_1.verifyToken], (req, res) => this.controller.filtrarSalida(req, res));
        this.router.post('/Salida/api/filtrarJT', [jwt_config_1.verifyToken], (req, res) => this.controller.filtrarSalidaJT(req, res));
    }
}
exports.SalidaRouter = SalidaRouter;
