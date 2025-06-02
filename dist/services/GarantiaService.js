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
exports.GarantiaService = void 0;
const base_service_1 = require("../config/base.service");
const Garantia_1 = require("../entities/Garantia");
class GarantiaService extends base_service_1.BaseService {
    constructor() {
        super(Garantia_1.Garantia);
    }
    // servicio para obtener todos los Garantias
    findAllGarantia() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("garantia")
                .leftJoinAndSelect("garantia.servicio", "servicio")
                .leftJoinAndSelect("servicio.cliente", "c")
                .leftJoinAndSelect("servicio.tienda", "tienda")
                .leftJoinAndSelect("servicio.tipo_servicio", "tp")
                .leftJoinAndSelect("servicio.venta", "venta")
                .leftJoinAndSelect("venta.producto", "p")
                .getMany();
            //.find();
        });
    }
    findGarantiaById(id_garantia) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id_garantia);
            return (yield this.execRepository)
                .createQueryBuilder("garantia")
                .leftJoinAndSelect("garantia.servicio", "servicio")
                .leftJoinAndSelect("servicio.cliente", "c")
                .leftJoinAndSelect("servicio.tienda", "tienda")
                .leftJoinAndSelect("servicio.tipo_servicio", "tp")
                .leftJoinAndSelect("servicio.venta", "venta")
                .leftJoinAndSelect("venta.producto", "p")
                .where("garantia.id_garantia=:id_garantia", { id_garantia })
                .getOne();
        });
    }
    // servicio para crear un Garantias
    createGarantia(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    deleteGarantia(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).delete(id);
        });
    }
    // actualizar un Garantias
    updateGarantia(id, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).update(id, infoUpdate);
        });
    }
    filtrarGarantias(nombre_cliente, fecha_liminf, fecha_limsup, nombre_producto, duracion_liminf, duracion_limsup, id_tienda) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            let garantias;
            if (fecha_liminf != null && fecha_limsup == null) {
                garantias = yield (yield this.execRepository)
                    .createQueryBuilder("garantia")
                    .leftJoinAndSelect("garantia.servicio", "servicio")
                    .leftJoinAndSelect("servicio.cliente", "c")
                    .leftJoinAndSelect("servicio.tienda", "tienda")
                    .leftJoinAndSelect("servicio.venta", "venta")
                    .leftJoinAndSelect("venta.producto", "p")
                    .leftJoinAndSelect("servicio.tipo_servicio", "tp")
                    .where("servicio.fecha>=:fecha_liminf", { fecha_liminf })
                    .getMany();
            }
            else if (fecha_limsup != null && fecha_liminf == null) {
                garantias = yield (yield this.execRepository)
                    .createQueryBuilder("garantia")
                    .leftJoinAndSelect("garantia.servicio", "servicio")
                    .leftJoinAndSelect("servicio.cliente", "c")
                    .leftJoinAndSelect("servicio.tienda", "tienda")
                    .leftJoinAndSelect("servicio.venta", "venta")
                    .leftJoinAndSelect("venta.producto", "p")
                    .leftJoinAndSelect("servicio.tipo_servicio", "tp")
                    .where("servicio.fecha<=:fecha_limsup", { fecha_limsup })
                    .getMany();
            }
            else if (fecha_liminf && fecha_limsup) {
                garantias = yield (yield this.execRepository)
                    .createQueryBuilder("garantia")
                    .leftJoinAndSelect("garantia.servicio", "servicio")
                    .leftJoinAndSelect("servicio.cliente", "c")
                    .leftJoinAndSelect("servicio.tienda", "tienda")
                    .leftJoinAndSelect("servicio.venta", "venta")
                    .leftJoinAndSelect("servicio.tipo_servicio", "tp")
                    .leftJoinAndSelect("venta.producto", "p")
                    .where("servicio.fecha<=:fecha_limsup and servicio.fecha>=:fecha_liminf", { fecha_limsup, fecha_liminf })
                    .getMany();
            }
            else {
                garantias = yield (yield this.execRepository)
                    .createQueryBuilder("garantia")
                    .leftJoinAndSelect("garantia.servicio", "servicio")
                    .leftJoinAndSelect("servicio.cliente", "c")
                    .leftJoinAndSelect("servicio.venta", "venta")
                    .leftJoinAndSelect("servicio.tienda", "tienda")
                    .leftJoinAndSelect("servicio.tipo_servicio", "tp")
                    .leftJoinAndSelect("venta.producto", "p")
                    .getMany();
            }
            if (nombre_cliente) {
                const normalizedNombre = normalizeString(nombre_cliente);
                garantias = garantias.filter((garantia) => normalizeString(garantia.servicio.cliente.nombre).toLowerCase().includes(normalizedNombre));
            }
            if (duracion_liminf) {
                garantias = garantias.filter((garantia) => garantia.duracion >= duracion_liminf);
            }
            if (duracion_limsup) {
                garantias = garantias.filter((garantia) => garantia.duracion <= duracion_limsup);
            }
            if (nombre_producto) {
                let auxiliar = [];
                const normalizedNombre = normalizeString(nombre_producto);
                garantias.forEach((garantia) => {
                    const { venta } = garantia.servicio;
                    if (venta != null) {
                        if (normalizeString(venta.producto.nombre).toLowerCase().includes(normalizedNombre)) {
                            auxiliar.push(garantia);
                        }
                    }
                });
                garantias = auxiliar;
            }
            if (id_tienda) {
                garantias = garantias.filter((garantia) => garantia.servicio.tienda.id_tienda == id_tienda);
            }
            return garantias;
        });
    }
}
exports.GarantiaService = GarantiaService;
