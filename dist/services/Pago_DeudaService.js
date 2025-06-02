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
exports.Pago_DeudaService = void 0;
const base_service_1 = require("../config/base.service");
const Pago_Deuda_1 = require("../entities/Pago_Deuda");
class Pago_DeudaService extends base_service_1.BaseService {
    constructor() {
        super(Pago_Deuda_1.Pago_Deuda);
    }
    // servicio para obtener todos los Pago_Deudas
    findAllPago_Deuda() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).find();
        });
    }
    findPago_DeudaById(id_pago_deuda) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).findOneBy({ id_pago_deuda });
        });
    }
    // servicio para crear un Pago_Deudas
    createPago_Deuda(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    deletePago_Deuda(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).delete(id);
        });
    }
    // actualizar un Pago_Deudas
    updatePago_Deuda(id, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).update(id, infoUpdate);
        });
    }
}
exports.Pago_DeudaService = Pago_DeudaService;
