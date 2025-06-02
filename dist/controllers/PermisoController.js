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
exports.PermisoController = void 0;
const PermisoService_1 = require("../services/PermisoService");
class PermisoController {
    constructor(permisoService = new PermisoService_1.PermisoService()) {
        this.permisoService = permisoService;
    }
    createPermiso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.permisoService.createPermiso(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getPermiso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.permisoService.findAllPermiso();
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    getPermisoById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.permisoService.findPermisoById(parseInt(ID));
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
    updatePermiso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.permisoService.updatePermiso(parseInt(ID), req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
    deletePermiso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.permisoService.deletePermiso(parseInt(ID));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ "error": e.message });
            }
        });
    }
}
exports.PermisoController = PermisoController;
