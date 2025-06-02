"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GarantiaRouter = void 0;
const GarantiaController_1 = require("../controllers/GarantiaController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class GarantiaRouter extends router_1.BaseRouter {
    constructor() {
        super(GarantiaController_1.GarantiaController);
    }
    routes() {
        this.router.get('/Garantia', [jwt_config_1.verifyToken], (req, res) => this.controller.getGarantia(req, res));
        // Garantia por id
        this.router.get('/Garantia/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.getGarantiaById(req, res));
        // adicionar Garantia
        this.router.post('/Garantia/createGarantia', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createGarantia(req, res); });
        //modificar Garantia
        this.router.put('/Garantia/updateGarantia/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.updateGarantia(req, res));
        // eliminar Garantia
        this.router.delete('/Garantia/deleteGarantia/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteGarantia(req, res));
        this.router.post('/Garantia/api/filtrar', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.filtrarGarantia(req, res); });
    }
}
exports.GarantiaRouter = GarantiaRouter;
