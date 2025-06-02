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
exports.Tipo_servicioService = void 0;
const base_service_1 = require("../config/base.service");
const Tipo_servicio_1 = require("../entities/Tipo_servicio");
class Tipo_servicioService extends base_service_1.BaseService {
    constructor() {
        super(Tipo_servicio_1.Tipo_servicio);
    }
    // Tipo_servicio para obtener todos los Tipo_servicios
    findAllTipo_servicios() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).find();
        });
    }
    findTipo_servicioById(id_tipo_servicio) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).findOneBy({ id_tipo_servicio });
        });
    }
    // Tipo_servicio para crear un Tipo_servicios
    createTipo_servicio(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    deleteTipo_servicio(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).delete(id);
        });
    }
    // actualizar un Tipo_servicios
    updateTipo_servicio(id, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).update(id, infoUpdate);
        });
    }
    filtrarTipo_servicio(nombre, costo_liminf, costo_limsup) {
        return __awaiter(this, void 0, void 0, function* () {
            let tipo_servicios = yield (yield this.execRepository)
                .createQueryBuilder("tp")
                .getMany();
            const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            if (nombre) {
                const normalizedNombre = normalizeString(nombre);
                tipo_servicios = tipo_servicios.filter((tp) => normalizeString(tp.nombre).toLowerCase().includes(normalizedNombre));
            }
            if (costo_liminf) {
                tipo_servicios = tipo_servicios.filter((tp) => tp.costo >= costo_liminf);
            }
            if (costo_limsup) {
                tipo_servicios = tipo_servicios.filter((tp) => tp.costo >= costo_limsup);
            }
            return tipo_servicios;
        });
    }
}
exports.Tipo_servicioService = Tipo_servicioService;
