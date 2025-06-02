"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolRouter = void 0;
const RolController_1 = require("../controllers/RolController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class RolRouter extends router_1.BaseRouter {
    constructor() {
        super(RolController_1.RolController);
    }
    routes() {
        this.router.get('/Rol', [jwt_config_1.verifyToken], (req, res) => this.controller.getRol(req, res));
        // Rol por id
        this.router.get('/Rol/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.getRolById(req, res));
        // adicionar Rol
        this.router.post('/Rol/createRol', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createRol(req, res); });
        //modificar Rol
        this.router.put('/Rol/updateRol/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.updateRol(req, res));
        // eliminar Rol
        this.router.delete('/Rol/deleteRol/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteRol(req, res));
        this.router.get("/Rol/getPermisos/:id_rol", [jwt_config_1.verifyToken], (req, res) => this.controller.getPermisos(req, res));
    }
}
exports.RolRouter = RolRouter;
