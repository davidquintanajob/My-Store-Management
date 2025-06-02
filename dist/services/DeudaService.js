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
exports.DeudaService = void 0;
const base_service_1 = require("../config/base.service");
const Deuda_1 = require("../entities/Deuda");
class DeudaService extends base_service_1.BaseService {
    constructor() {
        super(Deuda_1.Deuda);
    }
    // servicio para obtener todos los Deudas
    findAllDeudas() {
        return __awaiter(this, void 0, void 0, function* () {
            let deudas = yield (yield this.execRepository)
                .createQueryBuilder("d")
                .leftJoinAndSelect("d.pagos_deuda", "pago_deuda")
                .leftJoinAndSelect("d.servicio", "servicio")
                .leftJoinAndSelect("servicio.cliente", "c")
                .leftJoinAndSelect("servicio.tienda", "tienda")
                .leftJoinAndSelect("servicio.tipo_servicio", "tp")
                .leftJoinAndSelect("servicio.venta", "venta")
                .leftJoinAndSelect("venta.producto", "p")
                .getMany();
            deudas = deudas.map((deuda) => {
                const total_pagado = deuda.pagos_deuda.reduce((total, pago_deuda) => total += pago_deuda.pagada, 0);
                console.log(total_pagado);
                return { deuda,
                    "total_pagado": (deuda.pagos_deuda.length > 0) ? total_pagado : 0,
                    "cantidad_restante": (deuda.pagos_deuda.length > 0) ? deuda.deuda - total_pagado : deuda.deuda
                };
            });
            return deudas;
            //.find();
        });
    }
    findDeudaById(id_deuda) {
        return __awaiter(this, void 0, void 0, function* () {
            let deuda = yield (yield this.execRepository).
                createQueryBuilder("d")
                .leftJoinAndSelect("d.pagos_deuda", "pago_deuda")
                .leftJoinAndSelect("d.servicio", "servicio")
                .leftJoinAndSelect("servicio.cliente", "c")
                .leftJoinAndSelect("servicio.tienda", "tienda")
                .leftJoinAndSelect("servicio.tipo_servicio", "tp")
                .leftJoinAndSelect("servicio.venta", "venta")
                .leftJoinAndSelect("venta.producto", "p")
                .where("d.id_deuda=:id_deuda", { id_deuda })
                .getOne();
            if (deuda) {
                const total_pagado = deuda.pagos_deuda.reduce((acumulado, pago) => acumulado += pago.pagada, 0);
                return { deuda,
                    "total_pagado": (deuda.pagos_deuda.length > 0) ? total_pagado : 0,
                    "cantidad_restante": (deuda.pagos_deuda.length > 0) ? deuda.deuda - total_pagado : deuda.deuda
                };
            }
            return null;
            //findOneBy({ id_deuda });
        });
    }
    // servicio para crear un Deudas
    createDeuda(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    deleteDeuda(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).delete(id);
        });
    }
    // actualizar un Deudas
    updateDeuda(id, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).update(id, infoUpdate);
        });
    }
    filtrarDeuda(nombre_producto, nombre_cliente, id_tienda, fecha_liminf, fecha_limsup, deuda_liminf, deuda_limsup, saldada, id_tipo_servicio) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            let deudas;
            let aux = [];
            if (fecha_liminf != null && fecha_limsup == null) {
                deudas = yield (yield this.execRepository)
                    .createQueryBuilder("d")
                    .leftJoinAndSelect("d.pagos_deuda", "pago_deuda")
                    .leftJoinAndSelect("d.servicio", "servicio")
                    .leftJoinAndSelect("servicio.cliente", "c")
                    .leftJoinAndSelect("servicio.tienda", "tienda")
                    .leftJoinAndSelect("servicio.tipo_servicio", "tp")
                    .leftJoinAndSelect("servicio.venta", "venta")
                    .leftJoinAndSelect("venta.producto", "p")
                    .where("servicio.fecha>=:fecha_liminf", { fecha_liminf })
                    .getMany();
            }
            else if (fecha_limsup != null && fecha_liminf == null) {
                deudas = yield (yield this.execRepository)
                    .createQueryBuilder("d")
                    .leftJoinAndSelect("d.pagos_deuda", "pago_deuda")
                    .leftJoinAndSelect("d.servicio", "servicio")
                    .leftJoinAndSelect("servicio.cliente", "c")
                    .leftJoinAndSelect("servicio.tienda", "tienda")
                    .leftJoinAndSelect("servicio.tipo_servicio", "tp")
                    .leftJoinAndSelect("servicio.venta", "venta")
                    .leftJoinAndSelect("venta.producto", "p")
                    .where("servicio.fecha<=:fecha_limsup", { fecha_limsup })
                    .getMany();
            }
            else if (fecha_liminf && fecha_limsup) {
                deudas = yield (yield this.execRepository)
                    .createQueryBuilder("d")
                    .leftJoinAndSelect("d.pagos_deuda", "pago_deuda")
                    .leftJoinAndSelect("d.servicio", "servicio")
                    .leftJoinAndSelect("servicio.cliente", "c")
                    .leftJoinAndSelect("servicio.tienda", "tienda")
                    .leftJoinAndSelect("servicio.tipo_servicio", "tp")
                    .leftJoinAndSelect("servicio.venta", "venta")
                    .leftJoinAndSelect("venta.producto", "p")
                    .where("servicio.fecha<=:fecha_limsup and servicio.fecha>=:fecha_liminf", { fecha_limsup, fecha_liminf })
                    .getMany();
            }
            else {
                deudas = yield (yield this.execRepository)
                    .createQueryBuilder("d")
                    .leftJoinAndSelect("d.pagos_deuda", "pago_deuda")
                    .leftJoinAndSelect("d.servicio", "servicio")
                    .leftJoinAndSelect("servicio.cliente", "c")
                    .leftJoinAndSelect("servicio.tienda", "tienda")
                    .leftJoinAndSelect("servicio.tipo_servicio", "tp")
                    .leftJoinAndSelect("servicio.venta", "venta")
                    .leftJoinAndSelect("venta.producto", "p")
                    .getMany();
            }
            if (nombre_cliente) {
                const normalizedNombre = normalizeString(nombre_cliente);
                deudas = deudas.filter((deuda) => normalizeString(deuda.servicio.cliente.nombre).toLowerCase().includes(normalizedNombre));
            }
            if (deuda_liminf) {
                deudas = deudas.filter((deuda) => deuda.deuda >= deuda_liminf);
            }
            if (deuda_limsup) {
                deudas = deudas.filter((deuda) => deuda.deuda <= deuda_limsup);
            }
            if (nombre_producto) {
                let auxiliar = [];
                const normalizedNombre = normalizeString(nombre_producto);
                deudas.forEach((deuda) => {
                    const { venta } = deuda.servicio;
                    if (venta != null) {
                        if (normalizeString(venta.producto.nombre).toLowerCase().includes(normalizedNombre)) {
                            auxiliar.push(deuda);
                        }
                    }
                });
                deudas = auxiliar;
            }
            if (id_tienda) {
                deudas = deudas.filter((deuda) => deuda.servicio.tienda.id_tienda == id_tienda);
            }
            if (id_tipo_servicio) {
                deudas = deudas.filter((deuda) => deuda.servicio.tipo_servicio.id_tipo_servicio == id_tipo_servicio);
            }
            aux = deudas.map((deuda) => {
                return {
                    deuda,
                    "total_pagado": (deuda.pagos_deuda.length > 0) ? deuda.pagos_deuda.reduce((acumulado, pago) => acumulado += pago.pagada, 0) : 0,
                    "cantidad_restante": (deuda.pagos_deuda.length > 0) ? deuda.deuda - deuda.pagos_deuda.reduce((acumulado, pago) => acumulado += pago.pagada, 0) : deuda.deuda
                };
            });
            if (saldada != null) {
                aux = (saldada) ? aux.filter((deuda) => deuda.cantidad_restante == 0) : aux.filter((deuda) => deuda.cantidad_restante != 0);
            }
            return aux;
        });
    }
}
exports.DeudaService = DeudaService;
