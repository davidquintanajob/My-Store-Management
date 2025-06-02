"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiendaRouter = void 0;
const TiendaController_1 = require("../controllers/TiendaController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class TiendaRouter extends router_1.BaseRouter {
    constructor() {
        super(TiendaController_1.TiendaController);
    }
    routes() {
        this.router.get('/Tienda', [jwt_config_1.verifyToken], (req, res) => this.controller.getTienda(req, res));
        // Tienda por id
        this.router.get('/Tienda/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.getTiendaById(req, res));
        // adicionar Tienda
        this.router.post('/Tienda/createTienda', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createTienda(req, res); });
        //modificar Tienda
        this.router.put('/Tienda/updateTienda/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.updateTienda(req, res));
        // eliminar Tienda
        this.router.delete('/Tienda/deleteTienda/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteTienda(req, res));
        this.router.get("/Tienda/getServicios/:id_tienda", [jwt_config_1.verifyToken], (req, res) => this.controller.ServiciosbyTienda(req, res));
        this.router.get("/Tienda/getTiendas/noUsuarios/:id_usuario", [jwt_config_1.verifyToken], (req, res) => this.controller.NoTiendasUsuario(req, res));
    }
}
exports.TiendaRouter = TiendaRouter;
