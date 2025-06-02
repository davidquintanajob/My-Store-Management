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
exports.ServicioService = void 0;
const base_service_1 = require("../config/base.service");
const Servicio_1 = require("../entities/Servicio");
class ServicioService extends base_service_1.BaseService {
    constructor() {
        super(Servicio_1.Servicio);
    }
    // servicio para obtener todos los Servicios
    findAllServicios() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Servicio")
                .leftJoinAndSelect("Servicio.cliente", "c")
                .leftJoinAndSelect("Servicio.tienda", "tienda")
                .leftJoinAndSelect("Servicio.tipo_servicio", "ts")
                .leftJoinAndSelect("Servicio.deuda", "deuda")
                .leftJoinAndSelect("Servicio.garantia", "garantia")
                .leftJoinAndSelect("Servicio.venta", "venta")
                .leftJoinAndSelect("Servicio.encargo", "encargo")
                .leftJoinAndSelect("venta.producto", "p")
                .leftJoinAndSelect("Servicio.diario", "diario")
                .getMany();
            //.find({relations:["cliente","tienda","tipo_servicio","deuda","garantia"]});
        });
    }
    findServicioById(id_servicio) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Servicio")
                .leftJoinAndSelect("Servicio.cliente", "c")
                .leftJoinAndSelect("Servicio.tienda", "tienda")
                .leftJoinAndSelect("Servicio.tipo_servicio", "ts")
                .leftJoinAndSelect("Servicio.deuda", "deuda")
                .leftJoinAndSelect("Servicio.garantia", "garantia")
                .leftJoinAndSelect("Servicio.venta", "venta")
                .leftJoinAndSelect("Servicio.encargo", "encargo")
                .leftJoinAndSelect("venta.producto", "p")
                .leftJoinAndSelect("Servicio.diario", "diario")
                .where("Servicio.id_servicio=:id_servicio", { id_servicio })
                .getOne();
            //.findOneBy({ id_servicio });
        });
    }
    // servicio para crear un Servicios
    createServicio(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    deleteServicio(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).delete(id);
        });
    }
    // actualizar un Servicios
    updateServicio(id, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).update(id, infoUpdate);
        });
    }
    GananciaTotalServicio() {
        return __awaiter(this, void 0, void 0, function* () {
            const ganancia_total = yield this.findAllServicios();
            return ganancia_total.reduce((acumulador, servicio) => acumulador + servicio.precio, 0);
        });
    }
    getServiciosPaginated(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const limite = 20;
            const offset = (page - 1) * limite;
            const servicios = yield (yield this.execRepository)
                .createQueryBuilder("s")
                .leftJoinAndSelect("s.tienda", "t")
                .leftJoinAndSelect("s.tipo_servicio", "ts")
                .leftJoinAndSelect("s.cliente", "c")
                .take(limite)
                .skip(offset)
                .getMany();
            const cantidad_total_servicios = yield (yield this.execRepository)
                .createQueryBuilder("s")
                .getCount();
            return {
                servicios: servicios,
                pagina: page,
                cantidad_total_servicios: cantidad_total_servicios,
            };
        });
    }
    getServiciosbyTipo_servicio(id_tipo_servicio) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Servicio")
                .innerJoinAndSelect("Servicio.tipo_servicio", "tipo_servicio")
                .leftJoinAndSelect("Servicio.cliente", "c")
                .leftJoinAndSelect("Servicio.deuda", "deuda")
                .leftJoinAndSelect("Servicio.garantia", "garantia")
                .leftJoinAndSelect("Servicio.venta", "venta")
                .leftJoinAndSelect("Servicio.encargo", "encargo")
                .leftJoinAndSelect("venta.producto", "p")
                .leftJoinAndSelect("Servicio.tienda", "tienda")
                .leftJoinAndSelect("Servicio.diario", "diario")
                .where("tipo_servicio.id_tipo_servicio=:id_tipo_servicio", {
                id_tipo_servicio,
            })
                .getMany();
        });
    }
    filtrarServicio(nombre_cliente, precio_liminf, precio_limsup, fecha_liminf, fecha_limsup, id_tipo_servicio, id_tienda, nombre_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            let servicios;
            const normalizeString = (str) => str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
            if (fecha_liminf && fecha_limsup == null) {
                servicios = yield (yield this.execRepository)
                    .createQueryBuilder("servicio")
                    .leftJoinAndSelect("servicio.cliente", "c")
                    .leftJoinAndSelect("servicio.tienda", "tienda")
                    .leftJoinAndSelect("servicio.tipo_servicio", "ts")
                    .leftJoinAndSelect("servicio.venta", "venta")
                    .leftJoinAndSelect("servicio.encargo", "encargo")
                    .leftJoinAndSelect("venta.producto", "p")
                    .leftJoinAndSelect("servicio.diario", "diario")
                    .where("servicio.fecha>=:fecha_liminf", { fecha_liminf })
                    .getMany();
            }
            else if (fecha_liminf == null && fecha_limsup) {
                servicios = yield (yield this.execRepository)
                    .createQueryBuilder("servicio")
                    .leftJoinAndSelect("servicio.cliente", "c")
                    .leftJoinAndSelect("servicio.tienda", "tienda")
                    .leftJoinAndSelect("servicio.tipo_servicio", "ts")
                    .leftJoinAndSelect("servicio.venta", "venta")
                    .leftJoinAndSelect("servicio.encargo", "encargo")
                    .leftJoinAndSelect("venta.producto", "p")
                    .leftJoinAndSelect("servicio.diario", "diario")
                    .where("servicio.fecha<=:fecha_limsup", { fecha_limsup })
                    .getMany();
            }
            else if (fecha_liminf && fecha_limsup) {
                servicios = yield (yield this.execRepository)
                    .createQueryBuilder("servicio")
                    .leftJoinAndSelect("servicio.cliente", "c")
                    .leftJoinAndSelect("servicio.tienda", "tienda")
                    .leftJoinAndSelect("servicio.tipo_servicio", "ts")
                    .leftJoinAndSelect("servicio.venta", "venta")
                    .leftJoinAndSelect("servicio.encargo", "encargo")
                    .leftJoinAndSelect("venta.producto", "p")
                    .leftJoinAndSelect("servicio.diario", "diario")
                    .where("servicio.fecha<=:fecha_limsup and servicio.fecha>=:fecha_liminf ", { fecha_limsup, fecha_liminf })
                    .getMany();
            }
            else {
                servicios = yield (yield this.execRepository)
                    .createQueryBuilder("servicio")
                    .leftJoinAndSelect("servicio.cliente", "c")
                    .leftJoinAndSelect("servicio.tienda", "tienda")
                    .leftJoinAndSelect("servicio.tipo_servicio", "ts")
                    .leftJoinAndSelect("servicio.venta", "venta")
                    .leftJoinAndSelect("servicio.encargo", "encargo")
                    .leftJoinAndSelect("venta.producto", "p")
                    .leftJoinAndSelect("servicio.diario", "diario")
                    .getMany();
            }
            if (nombre_cliente) {
                const normalizedNombre = normalizeString(nombre_cliente);
                servicios = servicios.filter((servicio) => normalizeString(servicio.cliente.nombre)
                    .toLowerCase()
                    .includes(normalizedNombre));
            }
            if (precio_liminf) {
                servicios = servicios.filter((servicio) => servicio.precio >= precio_liminf);
            }
            if (precio_limsup) {
                servicios = servicios.filter((servicio) => servicio.precio <= precio_limsup);
            }
            if (id_tipo_servicio) {
                console.log(id_tipo_servicio);
                console.log(servicios);
                servicios = servicios.filter((servicio) => servicio.tipo_servicio.id_tipo_servicio == id_tipo_servicio);
            }
            if (id_tienda) {
                servicios = servicios.filter((servicio) => servicio.tienda.id_tienda == id_tienda);
            }
            if (nombre_producto) {
                let auxiliar = [];
                const normalizedNombre = normalizeString(nombre_producto);
                servicios.forEach((servicio) => {
                    const { venta } = servicio;
                    if (venta != null) {
                        if (normalizeString(venta.producto.nombre)
                            .toLowerCase()
                            .includes(normalizedNombre)) {
                            auxiliar.push(servicio);
                        }
                    }
                });
                servicios = auxiliar;
                // servicios= servicios.filter((servicio:Servicio)=>normalizeString(servicio.venta.producto.nombre).toLowerCase().includes(normalizedNombre))
            }
            return servicios;
        });
    }
    filtrarServicioJT(nombre_cliente, precio_liminf, precio_limsup, fecha_liminf, fecha_limsup, id_tipo_servicio, id_tienda) {
        return __awaiter(this, void 0, void 0, function* () {
            let servicios;
            const normalizeString = (str) => str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
            if (fecha_liminf && fecha_limsup == null) {
                servicios = yield (yield this.execRepository)
                    .createQueryBuilder("servicio")
                    .leftJoinAndSelect("servicio.cliente", "c")
                    .leftJoinAndSelect("servicio.tienda", "tienda")
                    .leftJoinAndSelect("servicio.tipo_servicio", "ts")
                    .leftJoinAndSelect("servicio.diario", "diario")
                    .where("servicio.fecha>=:fecha_liminf and servicio.id_tipo_servicio=:id_tipo_servicio", { fecha_liminf, id_tipo_servicio })
                    .getMany();
            }
            else if (fecha_liminf == null && fecha_limsup) {
                servicios = yield (yield this.execRepository)
                    .createQueryBuilder("servicio")
                    .leftJoinAndSelect("servicio.cliente", "c")
                    .leftJoinAndSelect("servicio.tienda", "tienda")
                    .leftJoinAndSelect("servicio.tipo_servicio", "ts")
                    .leftJoinAndSelect("servicio.diario", "diario")
                    .where("servicio.fecha<=:fecha_limsup and servicio.id_tipo_servicio=:id_tipo_servicio", { fecha_limsup, id_tipo_servicio })
                    .getMany();
            }
            else if (fecha_liminf && fecha_limsup) {
                servicios = yield (yield this.execRepository)
                    .createQueryBuilder("servicio")
                    .leftJoinAndSelect("servicio.cliente", "c")
                    .leftJoinAndSelect("servicio.tienda", "tienda")
                    .leftJoinAndSelect("servicio.tipo_servicio", "ts")
                    .leftJoinAndSelect("servicio.diario", "diario")
                    .where("servicio.fecha<=:fecha_limsup and servicio.fecha>=:fecha_liminf and servicio.id_tipo_servicio=:id_tipo_servicio", { fecha_limsup, fecha_liminf, id_tipo_servicio })
                    .getMany();
            }
            else {
                servicios = yield (yield this.execRepository)
                    .createQueryBuilder("servicio")
                    .leftJoinAndSelect("servicio.cliente", "c")
                    .leftJoinAndSelect("servicio.tienda", "tienda")
                    .leftJoinAndSelect("servicio.tipo_servicio", "ts")
                    .leftJoinAndSelect("servicio.diario", "diario")
                    .where("servicio.id_tipo_servicio=:id_tipo_servicio", {
                    id_tipo_servicio,
                })
                    .getMany();
            }
            if (nombre_cliente) {
                const normalizedNombre = normalizeString(nombre_cliente);
                servicios = servicios.filter((servicio) => normalizeString(servicio.cliente.nombre)
                    .toLowerCase()
                    .includes(normalizedNombre));
            }
            if (precio_liminf) {
                servicios = servicios.filter((servicio) => servicio.precio >= precio_liminf);
            }
            if (precio_limsup) {
                servicios = servicios.filter((servicio) => servicio.precio <= precio_limsup);
            }
            if (id_tienda) {
                servicios = servicios.filter((servicio) => servicio.tienda.id_tienda == id_tienda);
            }
            return servicios;
        });
    }
}
exports.ServicioService = ServicioService;
