"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermisoRouter = void 0;
const PermisoController_1 = require("../controllers/PermisoController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class PermisoRouter extends router_1.BaseRouter {
    constructor() {
        super(PermisoController_1.PermisoController);
    }
    routes() {
        this.router.get('/Permiso', [jwt_config_1.verifyToken], (req, res) => this.controller.getPermiso(req, res));
        // Permiso por id
        this.router.get('/Permiso/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.getPermisoById(req, res));
        // adicionar Permiso
        this.router.post('/Permiso/createPermiso', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createPermiso(req, res); });
        //modificar Permiso
        this.router.put('/Permiso/updatePermiso/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.updatePermiso(req, res));
        // eliminar Permiso
        this.router.delete('/Permiso/deletePermiso/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.deletePermiso(req, res));
    }
}
exports.PermisoRouter = PermisoRouter;
