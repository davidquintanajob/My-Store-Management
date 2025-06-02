"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonedaRouter = void 0;
const MonedaController_1 = require("../controllers/MonedaController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class MonedaRouter extends router_1.BaseRouter {
    constructor() {
        super(MonedaController_1.MonedaController);
    }
    routes() {
        this.router.get('/Moneda/obtener/USD', [jwt_config_1.verifyToken], (req, res) => this.controller.getMonedaByArchivo(req, res));
        this.router.put('/Moneda/cambiar/USD/:valor', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.updateMonedaByArchivo(req, res); });
    }
}
exports.MonedaRouter = MonedaRouter;
