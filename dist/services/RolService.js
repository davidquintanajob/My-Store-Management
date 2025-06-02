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
exports.RolService = void 0;
const base_service_1 = require("../config/base.service");
const Rol_1 = require("../entities/Rol");
class RolService extends base_service_1.BaseService {
    constructor() {
        super(Rol_1.Rol);
    }
    // servicio para obtener todos los Rols
    findAllRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).find({ relations: ["permisos"] });
        });
    }
    findRolById(id_rol) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).findOneBy({ id_rol });
        });
    }
    // servicio para crear un Rols
    createRol(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    deleteRol(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).delete(id);
        });
    }
    // actualizar un Rols
    updateRol(id, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).update(id, infoUpdate);
        });
    }
    getPermisos(id_rol) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Rol")
                .leftJoinAndSelect("Rol.permisos", "Permiso")
                .where("Rol.id_rol=:id_rol", { id_rol })
                .getOne();
        });
    }
}
exports.RolService = RolService;
