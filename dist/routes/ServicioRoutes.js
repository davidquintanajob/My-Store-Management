"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioRouter = void 0;
const ServicioController_1 = require("../controllers/ServicioController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class ServicioRouter extends router_1.BaseRouter {
    constructor() {
        super(ServicioController_1.ServicioController);
    }
    routes() {
        this.router.get('/Servicio', [jwt_config_1.verifyToken], (req, res) => this.controller.getServicio(req, res));
        // Servicio por id
        this.router.get('/Servicio/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.getServicioById(req, res));
        // adicionar Servicio
        this.router.post('/Servicio/createServicio', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createServicio(req, res); });
        //modificar Servicio
        this.router.put('/Servicio/updateServicio/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.updateServicio(req, res));
        // eliminar Servicio
        this.router.delete('/Servicio/deleteServicio/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteServicio(req, res));
        this.router.get('/Servicio/getPaginated/:page', [jwt_config_1.verifyToken], (req, res) => this.controller.getServiciosPaginated(req, res));
        this.router.get("/Servicio/gananciastotales/xd", [jwt_config_1.verifyToken], (req, res) => this.controller.getAllGanancia(req, res));
        this.router.get("/Servicio/filtrarTipo_servicio/:id_tipo_servicio", [jwt_config_1.verifyToken], (req, res) => this.controller.getServiciosPorTipo_servicio(req, res));
        this.router.post('/Servicio/api/filtrar', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.filtrarServicios(req, res); });
        this.router.post('/Servicio/ordenar/all', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.OrdenarServicios(req, res); });
        this.router.post('/Servicio/api/filtrarJT', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.filtrarServiciosJT(req, res); });
    }
}
exports.ServicioRouter = ServicioRouter;
