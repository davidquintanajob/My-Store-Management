"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeudaRouter = void 0;
const DeudaController_1 = require("../controllers/DeudaController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class DeudaRouter extends router_1.BaseRouter {
    constructor() {
        super(DeudaController_1.DeudaController);
    }
    routes() {
        this.router.get('/Deuda', [jwt_config_1.verifyToken], (req, res) => this.controller.getDeuda(req, res));
        // Deuda por id
        this.router.get('/Deuda/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.getDeudaById(req, res));
        // adicionar Deuda
        this.router.post('/Deuda/createDeuda', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createDeuda(req, res); });
        //modificar Deuda
        this.router.put('/Deuda/updateDeuda/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.updateDeuda(req, res));
        // eliminar Deuda
        this.router.delete('/Deuda/deleteDeuda/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteDeuda(req, res));
        this.router.post('/Deuda/api/filtrar', [jwt_config_1.verifyToken], (req, res) => this.controller.filtrarDeuda(req, res));
    }
}
exports.DeudaRouter = DeudaRouter;
