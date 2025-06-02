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
exports.EntradaService = void 0;
const base_service_1 = require("../config/base.service");
const Entrada_1 = require("../entities/Entrada");
class EntradaService extends base_service_1.BaseService {
    constructor() {
        super(Entrada_1.Entrada);
    }
    // servicio para obtener todos los Entradas
    findAllEntradas() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).find({
                relations: ["proveedor", "producto", "tienda"],
            });
        });
    }
    findEntradaById(id_entrada) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("e")
                .leftJoinAndSelect("e.proveedor", "p")
                .leftJoinAndSelect("e.producto", "prod")
                .leftJoinAndSelect("e.tienda", "t")
                .where("e.id_entrada=:id_entrada", { id_entrada })
                .getOne();
        });
    }
    // servicio para crear un Entradas
    createEntrada(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    deleteEntrada(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).delete(id);
        });
    }
    // actualizar un Entradas
    updateEntrada(id, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).update(id, infoUpdate);
        });
    }
    filtrarEntradasConPaginacion(nombre_proveedor, nombre_producto, costo_liminf, costo_limsup, fecha_liminf, fecha_limsup, limite, pagina) {
        return __awaiter(this, void 0, void 0, function* () {
            let entradas = [];
            const normalizeString = (str) => str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
            if (fecha_liminf && fecha_limsup) {
                entradas = yield (yield this.execRepository)
                    .createQueryBuilder("e")
                    .leftJoinAndSelect("e.proveedor", "p")
                    .leftJoinAndSelect("e.producto", "prod")
                    .where("e.fecha >= :fecha_liminf AND e.fecha <= :fecha_limsup", {
                    fecha_liminf,
                    fecha_limsup,
                })
                    .getMany();
            }
            else if (fecha_liminf) {
                entradas = yield (yield this.execRepository)
                    .createQueryBuilder("e")
                    .leftJoinAndSelect("e.proveedor", "p")
                    .leftJoinAndSelect("e.producto", "prod")
                    .where("e.fecha >= :fecha_liminf", { fecha_liminf })
                    .getMany();
            }
            else if (fecha_limsup) {
                entradas = yield (yield this.execRepository)
                    .createQueryBuilder("e")
                    .leftJoinAndSelect("e.proveedor", "p")
                    .leftJoinAndSelect("e.producto", "prod")
                    .where("e.fecha <= :fecha_limsup", { fecha_limsup })
                    .getMany();
            }
            else {
                entradas = yield (yield this.execRepository).find({ relations: ["proveedor", "producto"] });
            }
            if (nombre_proveedor) {
                const normalizedNombre_proveedor = normalizeString(nombre_proveedor);
                entradas = entradas.filter((entrada) => normalizeString(entrada.proveedor.nombre).includes(normalizedNombre_proveedor));
            }
            if (nombre_producto) {
                const normalizedNombre_producto = normalizeString(nombre_producto);
                entradas = entradas.filter((entrada) => normalizeString(entrada.producto.nombre).includes(normalizedNombre_producto));
            }
            if (costo_liminf) {
                entradas = entradas.filter((entrada) => entrada.costo >= costo_liminf);
            }
            if (costo_limsup) {
                entradas = entradas.filter((entrada) => entrada.costo <= costo_limsup);
            }
            const offset = (pagina - 1) * limite;
            entradas = entradas.slice(offset, offset + limite);
            return entradas;
        });
    }
    getEntradasPaginated(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const limite = 20;
            const offset = (page - 1) * limite;
            const entradas = yield (yield this.execRepository)
                .createQueryBuilder("e")
                .leftJoinAndSelect("e.proveedor", "p")
                .leftJoinAndSelect("e.producto", "prod")
                .leftJoinAndSelect("e.tienda", "t")
                .take(limite)
                .skip(offset)
                .getMany();
            const cantidad_total_entradas = yield (yield this.execRepository)
                .createQueryBuilder("e")
                .getCount();
            return {
                entradas: entradas,
                pagina: page,
                cantidad_total_entradas: cantidad_total_entradas,
            };
        });
    }
    getAllEntradasbyProveedor(id_proveedor) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("e")
                .leftJoinAndSelect("e.proveedor", "p")
                .leftJoinAndSelect("e.producto", "prod")
                .where("e.id_proveedor=:id_proveedor", { id_proveedor })
                .getMany();
        });
    }
    /*
      nombre del prooveedor
      nombre producto
      rango de costo
      rango de fecha
      */
    filtrarEntradas(nombre_proveedor, nombre_producto, costoliminf, costolimsup, fechaliminf, fechalimsup) {
        return __awaiter(this, void 0, void 0, function* () {
            let entradas = [];
            const normalizeString = (str) => str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
            if (fechaliminf && fechalimsup) {
                entradas = yield (yield this.execRepository)
                    .createQueryBuilder("e")
                    .leftJoinAndSelect("e.proveedor", "p")
                    .leftJoinAndSelect("e.producto", "prod")
                    .where("e.fecha>=:fechaliminf and e.fecha<=:fechalimsup", {
                    fechaliminf,
                    fechalimsup,
                })
                    .getMany();
                console.log(entradas);
            }
            else if (fechaliminf) {
                entradas = yield (yield this.execRepository)
                    .createQueryBuilder("e")
                    .leftJoinAndSelect("e.proveedor", "p")
                    .leftJoinAndSelect("e.producto", "prod")
                    .where("e.fecha>=:fechaliminf", { fechaliminf })
                    .getMany();
            }
            else if (fechalimsup) {
                entradas = yield (yield this.execRepository)
                    .createQueryBuilder("e")
                    .leftJoinAndSelect("e.proveedor", "p")
                    .leftJoinAndSelect("e.producto", "prod")
                    .where("e.fecha<=:fechalimsup", { fechalimsup })
                    .getMany();
            }
            else {
                entradas = yield (yield this.execRepository).find({ relations: ["proveedor", "producto"] });
            }
            if (nombre_proveedor) {
                const normalizedNombre_proveedor = normalizeString(nombre_proveedor);
                entradas = entradas.filter((entrada) => normalizeString(entrada.proveedor.nombre).includes(normalizedNombre_proveedor));
            }
            if (nombre_producto) {
                const normalizedNombre_producto = normalizeString(nombre_producto);
                entradas = entradas.filter((entrada) => normalizeString(entrada.producto.nombre).includes(normalizedNombre_producto));
            }
            if (costoliminf)
                entradas = entradas.filter((entrada) => entrada.costo >= costoliminf);
            if (costolimsup)
                entradas = entradas.filter((entradas) => entradas.costo <= costolimsup);
            return entradas;
        });
    }
    EntradasbyProducto(id_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.execRepository)
                .createQueryBuilder("e")
                .leftJoinAndSelect("e.producto", "p")
                .leftJoinAndSelect("e.proveedor", "prov")
                .leftJoinAndSelect("e.tienda", "t")
                .where("p.id_producto=:id_producto", { id_producto })
                .getMany();
        });
    }
    getEntradasPorVencimiento(fecha) {
        return __awaiter(this, void 0, void 0, function* () {
            const fechaVencimientoMaxima = new Date(fecha);
            const fechaActual = new Date();
            let entradas = [];
            entradas = yield (yield this.execRepository)
                .createQueryBuilder("e")
                .leftJoinAndSelect("e.proveedor", "p")
                .leftJoinAndSelect("e.producto", "prod")
                .leftJoinAndSelect("e.tienda", "t") // Agregamos la relación con la tienda
                .where("e.fecha_vencimiento IS NOT NULL")
                .getMany();
            entradas = entradas.filter((entrada) => {
                const fechaVencimiento = new Date(entrada.fecha_vencimiento);
                return fechaVencimiento >= fechaActual && fechaVencimiento <= fechaVencimientoMaxima;
            });
            return entradas;
        });
    }
}
exports.EntradaService = EntradaService;
