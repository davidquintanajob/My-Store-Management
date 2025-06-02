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
exports.Rol_permisoService = void 0;
const base_service_1 = require("../config/base.service");
const Rol_permiso_1 = require("../entities/Rol_permiso");
/*ACUERDATE DE MANIPULAR GET BY ID AND DELETE BY ID*/
class Rol_permisoService extends base_service_1.BaseService {
    constructor() {
        super(Rol_permiso_1.Rol_permiso);
    }
    // servicio para obtener todos los Rol_permisos
    findAllRol_permiso() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).find();
        });
    }
    findRol_permisoById(id_rol, id_permiso) {
        return __awaiter(this, void 0, void 0, function* () {
            // return (await this.execRepository).findOneBy({ id_rol });
            return (yield this.execRepository)
                .createQueryBuilder("Rol_permiso")
                .where('id_rol = :id_rol and id_permiso = :id_permiso', { id_rol, id_permiso })
                .getOne();
        });
    }
    // servicio para crear un Rol_permisos
    createRol_permiso(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    deleteRol_permiso(id_rol, id_permiso) {
        return __awaiter(this, void 0, void 0, function* () {
            (yield this.execRepository)
                .createQueryBuilder("Rol_permiso")
                .delete()
                .where('id_rol = :id_rol and id_permiso = :id_permiso', { id_rol, id_permiso })
                .execute();
            console.log('Elemento eliminado correctamente.');
        });
    }
    // actualizar un Rol_permisos
    updateRol_permiso(id_rol, id_permiso, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Rol_permiso")
                .update(Rol_permiso_1.Rol_permiso)
                .set(infoUpdate)
                .where('id_rol = :id_rol and id_permiso = :id_permiso', { id_rol, id_permiso })
                .execute();
        });
    }
    getPermisosbyRolid(id_rol) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Rol_permiso")
                .where("id_rol=:id_rol", { id_rol })
                .getMany();
        });
    }
}
exports.Rol_permisoService = Rol_permisoService;
