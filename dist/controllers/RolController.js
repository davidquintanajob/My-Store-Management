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
exports.RolController = void 0;
const RolService_1 = require("../services/RolService");
class RolController {
    constructor(rolService = new RolService_1.RolService()) {
        this.rolService = rolService;
    }
    createRol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.rolService.createRol(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getRol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.rolService.findAllRoles();
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getRolById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.rolService.findRolById(parseInt(ID));
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
    updateRol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.rolService.updateRol(parseInt(ID), req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    deleteRol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.rolService.deleteRol(parseInt(ID));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getPermisos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_rol } = req.params;
            try {
                const data = yield this.rolService.getPermisos(parseInt(id_rol));
                (data) ? res.status(200).json(data.permisos) : res.status(404).json("Rol not found");
            }
            catch (error) {
                res.status(500).json({ "error": error.message });
            }
        });
    }
}
exports.RolController = RolController;
