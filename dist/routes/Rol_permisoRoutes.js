"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rol_permisoRouter = void 0;
const Rol_permisoController_1 = require("../controllers/Rol_permisoController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class Rol_permisoRouter extends router_1.BaseRouter {
    constructor() {
        super(Rol_permisoController_1.Rol_permisoController);
    }
    routes() {
        this.router.get('/Rol_permiso', [jwt_config_1.verifyToken], (req, res) => this.controller.getRol_permiso(req, res));
        // Rol_permiso por id
        this.router.get('/Rol_permisobyId/:id_rol/:id_permiso', [jwt_config_1.verifyToken], (req, res) => this.controller.getRol_permisoById(req, res));
        // adicionar Rol_permiso
        this.router.post('/Rol_permiso/createRol_permiso', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createRol_permiso(req, res); });
        //modificar Rol_permiso
        this.router.put('/Rol_permiso/updateRol_permiso', [jwt_config_1.verifyToken], (req, res) => this.controller.updateRol_permiso(req, res));
        // eliminar Rol_permiso
        this.router.delete('/Rol_permiso/deleteRol_permiso', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteRol_permiso(req, res));
        this.router.get("/Rol_permiso/getPermisosbyRol/:id_rol", [jwt_config_1.verifyToken], (req, res) => this.controller.PermisobyRol(req, res));
    }
}
exports.Rol_permisoRouter = Rol_permisoRouter;
