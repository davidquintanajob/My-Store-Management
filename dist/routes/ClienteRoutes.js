"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteRouter = void 0;
const ClienteController_1 = require("../controllers/ClienteController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class ClienteRouter extends router_1.BaseRouter {
    constructor() {
        super(ClienteController_1.ClienteController);
    }
    routes() {
        this.router.get('/Cliente', [jwt_config_1.verifyToken], (req, res) => this.controller.getCliente(req, res));
        // Cliente por id
        this.router.get('/Cliente/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.getClienteById(req, res));
        // adicionar Cliente
        this.router.post('/Cliente/createCliente', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createCliente(req, res); });
        //modificar Cliente
        this.router.put('/Cliente/updateCliente/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.updateCliente(req, res));
        // eliminar Cliente
        this.router.delete('/Cliente/deleteCliente/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteCliente(req, res));
        this.router.post('/Cliente/api/filtrar', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.filtrarCliente(req, res); });
        this.router.post('/Cliente/ordenar/all', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.OrdenarCliente(req, res); });
    }
}
exports.ClienteRouter = ClienteRouter;
