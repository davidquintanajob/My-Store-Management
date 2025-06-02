"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pago_DeudaRouter = void 0;
const Pago_deudaController_1 = require("../controllers/Pago_deudaController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class Pago_DeudaRouter extends router_1.BaseRouter {
    constructor() {
        super(Pago_deudaController_1.Pago_DeudaController);
    }
    routes() {
        this.router.get('/Pago_Deuda', [jwt_config_1.verifyToken], (req, res) => this.controller.getPago_Deuda(req, res));
        // Pago_Deuda por id
        this.router.get('/Pago_Deuda/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.getPago_DeudaById(req, res));
        // adicionar Pago_Deuda
        this.router.post('/Pago_Deuda/createPago_Deuda', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createPago_Deuda(req, res); });
        //modificar Pago_Deuda
        this.router.put('/Pago_Deuda/updatePago_Deuda/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.updatePago_Deuda(req, res));
        // eliminar Pago_Deuda
        this.router.delete('/Pago_Deuda/deletePago_Deuda/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.deletePago_Deuda(req, res));
    }
}
exports.Pago_DeudaRouter = Pago_DeudaRouter;
