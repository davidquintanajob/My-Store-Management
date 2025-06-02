"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRouter = void 0;
const UsuarioController_1 = require("../controllers/UsuarioController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class UsuarioRouter extends router_1.BaseRouter {
    constructor() {
        super(UsuarioController_1.UsuarioController);
    }
    routes() {
        this.router.get('/Usuario', [jwt_config_1.verifyToken], (req, res) => this.controller.getUsuario(req, res));
        // Usuario por id
        this.router.get('/Usuario/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.getUsuarioById(req, res));
        // adicionar Usuario
        this.router.post('/Usuario/createUsuario', [jwt_config_1.verifyToken], (req, res) => this.controller.createUsuario(req, res));
        //modificar Usuario
        this.router.put('/Usuario/updateUsuario/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.updateUsuario(req, res));
        // eliminar Usuario
        this.router.delete('/Usuario/deleteUsuario/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteUsuario(req, res));
        this.router.post("/Usuario/auth", (req, res) => this.controller.authUser(req, res));
        this.router.get("/Usuario/permisos_especiales/:id_usuario", [jwt_config_1.verifyToken], (req, res) => this.controller.getPermisosEspeciales(req, res));
        this.router.get("/Usuario/permiso_especial/:id_usuario/:id_permiso", [jwt_config_1.verifyToken], (req, res) => this.controller.PermisoEspecialUsuario(req, res));
        this.router.post("/Usuario/change/pass", [jwt_config_1.verifyToken], (req, res) => this.controller.changePassword(req, res));
        this.router.post("/Usuario/api/filtrar", [jwt_config_1.verifyToken], (req, res) => this.controller.filtrarUsuario(req, res));
        this.router.post("/Usuario/ordenar/all", [jwt_config_1.verifyToken], (req, res) => this.controller.OrdenarUsuarios(req, res));
        this.router.get("/Usuario/tiene_permiso/:id_usuario/:id_permiso", [jwt_config_1.verifyToken], (req, res) => this.controller.obtenerUsuarioPermiso(req, res));
        this.router.get("/Usuario/recupearContrasenna/:nombre_usuario", [jwt_config_1.verifyToken], (req, res) => this.controller.recuperarContrasenna(req, res));
    }
}
exports.UsuarioRouter = UsuarioRouter;
