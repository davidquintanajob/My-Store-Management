"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tipo_accionRouter = void 0;
const Tipo_accionController_1 = require("../controllers/Tipo_accionController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class Tipo_accionRouter extends router_1.BaseRouter {
    constructor() {
        super(Tipo_accionController_1.Tipo_accionController);
    }
    routes() {
        this.router.get('/Tipo_accion', [jwt_config_1.verifyToken], (req, res) => this.controller.getTipo_accion(req, res));
        // Tipo_accion por id
        this.router.get('/Tipo_accion/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.getTipo_accionById(req, res));
        // adicionar Tipo_accion
        this.router.post('/Tipo_accion/createTipo_accion', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createTipo_accion(req, res); });
        //modificar Tipo_accion
        this.router.put('/Tipo_accion/updateTipo_accion/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.updateTipo_accion(req, res));
        // eliminar Tipo_accion
        this.router.delete('/Tipo_accion/deleteTipo_accion/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteTipo_accion(req, res));
    }
}
exports.Tipo_accionRouter = Tipo_accionRouter;
