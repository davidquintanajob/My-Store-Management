"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tipo_servicioRouter = void 0;
const Tipo_servicioController_1 = require("../controllers/Tipo_servicioController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class Tipo_servicioRouter extends router_1.BaseRouter {
    constructor() {
        super(Tipo_servicioController_1.Tipo_servicioController);
    }
    routes() {
        this.router.get('/Tipo_servicio', [jwt_config_1.verifyToken], (req, res) => this.controller.getTipo_servicio(req, res));
        // Tipo_servicio por id
        this.router.get('/Tipo_servicio/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.getTipo_servicioById(req, res));
        // adicionar Tipo_servicio
        this.router.post('/Tipo_servicio/createTipo_servicio', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createTipo_servicio(req, res); });
        //modificar Tipo_servicio
        this.router.put('/Tipo_servicio/updateTipo_servicio/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.updateTipo_servicio(req, res));
        // eliminar Tipo_servicio
        this.router.delete('/Tipo_servicio/deleteTipo_servicio/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteTipo_servicio(req, res));
        this.router.post('/Tipo_servicio/api/filtrar', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.filtrarTipo_servicio(req, res); });
    }
}
exports.Tipo_servicioRouter = Tipo_servicioRouter;
