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
exports.DiarioService = void 0;
const base_service_1 = require("../config/base.service");
const Diario_1 = require("../entities/Diario");
class DiarioService extends base_service_1.BaseService {
    constructor() {
        super(Diario_1.Diario);
    }
    findAllDiaros() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Diario")
                .leftJoinAndSelect("Diario.tienda", "tienda")
                .leftJoinAndSelect("tienda.usuarios", "usuarios")
                .leftJoinAndSelect("Diario.servicios", "servicios")
                .leftJoinAndSelect("servicios.tipo_servicio", "tipo_servicio")
                .getMany();
        });
    }
    findDiarioById(id_diario) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Diario")
                .where("Diario.id_diario = :id_diario", { id_diario })
                .leftJoinAndSelect("Diario.tienda", "tienda")
                .leftJoinAndSelect("tienda.usuarios", "usuarios")
                .leftJoinAndSelect("Diario.servicios", "servicios")
                .leftJoinAndSelect("servicios.tipo_servicio", "tipo_servicio")
                .getOne();
        });
    }
    createDiario(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    deleteDiario(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).delete(id);
        });
    }
    updateDiario(id, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).update(id, infoUpdate);
        });
    }
}
exports.DiarioService = DiarioService;
