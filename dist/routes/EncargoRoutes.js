"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncargoRouter = void 0;
const EncargoController_1 = require("../controllers/EncargoController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class EncargoRouter extends router_1.BaseRouter {
    constructor() {
        super(EncargoController_1.EncargoController);
    }
    routes() {
        this.router.get('/Encargo', [jwt_config_1.verifyToken], (req, res) => this.controller.getEncargo(req, res));
        // Encargo por id
        this.router.get('/Encargo/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.getEncargoById(req, res));
        // adicionar Encargo
        this.router.post('/Encargo/createEncargo', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createEncargo(req, res); });
        //modificar Encargo
        this.router.put('/Encargo/updateEncargo/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.updateEncargo(req, res));
        // eliminar Encargo
        this.router.delete('/Encargo/deleteEncargo/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteEncargo(req, res));
    }
}
exports.EncargoRouter = EncargoRouter;
