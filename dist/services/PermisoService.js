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
exports.PermisoService = void 0;
const base_service_1 = require("../config/base.service");
const Permiso_1 = require("../entities/Permiso");
class PermisoService extends base_service_1.BaseService {
    constructor() {
        super(Permiso_1.Permiso);
    }
    // servicio para obtener todos los Permisos
    findAllPermiso() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).find();
        });
    }
    findPermisoById(id_permiso) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).findOneBy({ id_permiso });
        });
    }
    // servicio para crear un Permisos
    createPermiso(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    deletePermiso(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).delete(id);
        });
    }
    // actualizar un Permisos
    updatePermiso(id, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).update(id, infoUpdate);
        });
    }
}
exports.PermisoService = PermisoService;
