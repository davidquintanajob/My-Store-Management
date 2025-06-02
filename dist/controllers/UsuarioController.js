"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
const UsuarioService_1 = require("../services/UsuarioService");
const jwt_config_1 = require("../config/jwt.config");
const Ordenar_criterios_1 = require("../helpers/Ordenar_criterios");
const bcryptjs = require("bcryptjs");
class UsuarioController {
    constructor(usuarioService = new UsuarioService_1.UsuarioService()) {
        this.usuarioService = usuarioService;
    }
    createUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.usuarioService.createUsuario(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    getUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.usuarioService.findAllUsuarios();
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    getUsuarioById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.usuarioService.findUsuarioById(parseInt(ID));
                if (data)
                    res.status(200).json(data);
                else
                    res.status(404).json();
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    updateUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const body = Object.assign({}, req.body); // Crear una copia del req.body
                if (body.carnet_identidad === "") {
                    delete body.carnet_identidad; // Eliminar el parámetro si es vacío
                }
                const data = yield this.usuarioService.updateUsuario(parseInt(ID), body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    deleteUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.usuarioService.deleteUsuario(parseInt(ID));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    authUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre_usuario } = req.body;
            const { contrasenna } = req.body;
            console.log(nombre_usuario);
            try {
                const data = yield this.usuarioService.findUsuariobyUserName(nombre_usuario);
                if (data) {
                    const { contrasenna: encrypt_password } = data;
                    bcryptjs.compare(contrasenna, encrypt_password, (error, result) => {
                        if (error) {
                            console.log("Ha ocurrido un error Usuario o contraseña incorrecta", error);
                        }
                        else if (result && data.activo) {
                            const token = (0, jwt_config_1.generarJsonWebToken)({
                                id_usuario: data.id_usuario,
                                nombre: data.nombre,
                            });
                            console.log(data.rol);
                            return res.status(200).json({
                                id_usuario: data.id_usuario,
                                nombre: data.nombre,
                                nombre_usuario: data.nombre_usuario,
                                msg: "Usuario encontrado",
                                token: token,
                                rol: data.rol,
                                tienda: data.tienda,
                            });
                        }
                        return res.status(404).json({
                            msg: "Ha ocurrido un error Usuario o contraseña incorrecta",
                        });
                    });
                }
                else {
                    res.status(404).json({
                        msg: "Usuario o contraseña incorrecto",
                    });
                }
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    getPermisosEspeciales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario } = req.params;
            try {
                const data = yield this.usuarioService.PermisosbyUsuario(parseInt(id_usuario));
                data
                    ? res
                        .status(200)
                        .json({ "Permisos especiales": data.permisos_especiales })
                    : res.status(404).json("usuario no encontrado");
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    PermisoEspecialUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario, id_permiso } = req.params;
            try {
                const data = yield this.usuarioService.PermisoEspecialUsuario(parseInt(id_usuario), parseInt(id_permiso));
                data != null
                    ? res.status(200).json({ tiene: data })
                    : res.status(404).json("Not found");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { contrasenna_vieja, contrasenna_nueva1, contrasenna_nueva2, nombre_usuario, } = req.body;
            try {
                const data = yield this.usuarioService.ChangePassword(contrasenna_vieja, contrasenna_nueva1, contrasenna_nueva2, nombre_usuario);
                data
                    ? res.status(200).json({ sucess: data })
                    : res.status(404).json({ sucess: data });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    filtrarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre_usuario, email, telefono, id_rol, id_tienda } = req.body;
            try {
                const data = yield this.usuarioService.filtrarUsuario(nombre_usuario, email, telefono, id_rol, id_tienda);
                data
                    ? res.status(200).json(data.map((usuario) => {
                        return {
                            id_usuario: usuario.id_usuario,
                            nombre: usuario.nombre,
                            carnet_identidad: usuario.carnet_identidad,
                            nombre_usuario: usuario.nombre_usuario,
                            email: usuario.email,
                            telefono: usuario.telefono,
                            direccion: usuario.direccion,
                            detalles_bancarios: usuario.detalles_bancarios,
                            rol: usuario.rol,
                            tienda: usuario.tienda,
                        };
                    }))
                    : res.status(404).json("Not found");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    OrdenarUsuarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { items, criterio, ascendente } = req.body;
            try {
                console.log(typeof ascendente);
                const data = (0, Ordenar_criterios_1.OrdenarUsuario)(ascendente, items, criterio);
                data
                    ? res.status(200).json(data)
                    : res.status(404).json("no se puede ordenar");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    obtenerUsuarioPermiso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario, id_permiso } = req.params;
            try {
                const data = yield this.usuarioService.obtenerUsuarioPermiso(parseInt(id_usuario), parseInt(id_permiso));
                data != null
                    ? res.status(200).json({ tiene: data })
                    : res.status(404).json("Not found");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    recuperarContrasenna(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre_usuario } = req.params;
            try {
                const data = yield this.usuarioService.recuperarContrasenna(nombre_usuario);
                data != null
                    ? res.status(200).json({ enviado: data })
                    : res.status(404).json("Usuario not found");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.UsuarioController = UsuarioController;
