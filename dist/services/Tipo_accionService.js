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
exports.Tipo_accionService = void 0;
const base_service_1 = require("../config/base.service");
const Tipo_accion_1 = require("../entities/Tipo_accion");
class Tipo_accionService extends base_service_1.BaseService {
    constructor() {
        super(Tipo_accion_1.Tipo_accion);
    }
    // Tipo_accion para obtener todos los Tipo_accions
    findAllTipo_accions() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).find();
        });
    }
    findTipo_accionById(id_tipo_accion) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).findOneBy({ id_tipo_accion });
        });
    }
    // Tipo_accion para crear un Tipo_accions
    createTipo_accion(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    deleteTipo_accion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).delete(id);
        });
    }
    // actualizar un Tipo_accions
    updateTipo_accion(id, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).update(id, infoUpdate);
        });
    }
}
exports.Tipo_accionService = Tipo_accionService;
