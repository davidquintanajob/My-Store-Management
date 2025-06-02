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
exports.Rol_permisoController = void 0;
const Rol_permisoService_1 = require("../services/Rol_permisoService");
class Rol_permisoController {
    constructor(rol_permisoService = new Rol_permisoService_1.Rol_permisoService()) {
        this.rol_permisoService = rol_permisoService;
    }
    createRol_permiso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.rol_permisoService.createRol_permiso(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getRol_permiso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.rol_permisoService.findAllRol_permiso();
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getRol_permisoById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_rol, id_permiso } = req.params;
            try {
                const data = yield this.rol_permisoService.findRol_permisoById(parseInt(id_rol), parseInt(id_permiso));
                if (data)
                    res.status(200).json(data);
                else
                    res.status(404).json();
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    updateRol_permiso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_rol, id_permiso } = req.body;
            try {
                const data = yield this.rol_permisoService.updateRol_permiso(parseInt(id_rol), parseInt(id_permiso), req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    deleteRol_permiso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_rol, id_permiso } = req.body;
            try {
                const data = yield this.rol_permisoService.deleteRol_permiso(parseInt(id_rol), (parseInt(id_permiso)));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    PermisobyRol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_rol } = req.params;
            try {
                const data = yield this.rol_permisoService.getPermisosbyRolid(parseInt(id_rol));
                (data) ? res.status(200).json(data) : res.status(404).json("Rol no encontrado");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
}
exports.Rol_permisoController = Rol_permisoController;
