"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccionRouter = void 0;
const AccionController_1 = require("../controllers/AccionController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class AccionRouter extends router_1.BaseRouter {
    constructor() {
        super(AccionController_1.AccionController);
    }
    routes() {
        this.router.get('/Accion', [jwt_config_1.verifyToken], (req, res) => this.controller.getAccion(req, res));
        // Accion por id
        this.router.get('/Accion/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.getAccionById(req, res));
        // adicionar Accion
        this.router.post('/Accion/createAccion', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createAccion(req, res); });
        //modificar Accion
        this.router.put('/Accion/updateAccion/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.updateAccion(req, res));
        // eliminar Accion
        this.router.delete('/Accion/deleteAccion/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteAccion(req, res));
        this.router.get('/Accion/getPaginated/:page', [jwt_config_1.verifyToken], (req, res) => this.controller.getAccionesPaginated(req, res));
        this.router.post('/Accion/api/filtrar', [jwt_config_1.verifyToken], (req, res) => this.controller.filtrarAccion(req, res));
        this.router.post('/Accion/ordenar/all', [jwt_config_1.verifyToken], (req, res) => this.controller.OrdenarAcciones(req, res));
    }
}
exports.AccionRouter = AccionRouter;
