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
exports.VentaService = void 0;
const base_service_1 = require("../config/base.service");
const Venta_1 = require("../entities/Venta");
/*ACUERDATE DE MANIPULAR GET BY ID AND DELETE BY ID*/
class VentaService extends base_service_1.BaseService {
    constructor() {
        super(Venta_1.Venta);
    }
    // Venta para obtener todos los Ventas
    findAllVentas() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).find({ relations: ["producto", "servicio"] });
        });
    }
    findVentaById(id_producto, id_servicio) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Venta")
                .where('id_producto = :id_producto and id_servicio = :id_servicio', { id_producto, id_servicio })
                .leftJoinAndSelect("Venta.producto", "p")
                .leftJoinAndSelect("Venta.servicio", "s")
                .getOne();
        });
    }
    // Venta para crear un Ventas
    createVenta(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    deleteVenta(id_producto, id_servicio) {
        return __awaiter(this, void 0, void 0, function* () {
            (yield this.execRepository)
                .createQueryBuilder("Venta")
                .delete()
                .where('id_producto = :id_producto and id_servicio = :id_servicio', { id_producto, id_servicio })
                .execute();
            console.log('Elemento eliminado correctamente.');
        });
    }
    // actualizar un Ventas
    updateVenta(id_producto, id_servicio, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Venta")
                .update(Venta_1.Venta)
                .set(infoUpdate)
                .where('id_producto = :id_producto and id_servicio = :id_servicio', { id_producto, id_servicio })
                .execute();
        });
    }
    //Cantidad_ventasPorProducto
    Cantidad_ventasPorProducto(id_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            let ventas = yield (yield this.execRepository)
                .createQueryBuilder("Venta")
                .where("id_producto = :id_producto", { id_producto })
                .getMany();
            let cantidad_ventas = 0;
            cantidad_ventas = ventas.reduce((acumulador, venta) => acumulador + venta.cantidad, 0);
            return cantidad_ventas;
        });
    }
    Producto_masVendido() {
        return __awaiter(this, void 0, void 0, function* () {
            let ventas = yield (yield this.execRepository).find();
            let productoCantidadMap = {};
            for (let venta of ventas) {
                if (!productoCantidadMap[venta.id_producto]) {
                    productoCantidadMap[venta.id_producto] = 0;
                }
                productoCantidadMap[venta.id_producto] += venta.cantidad;
            }
            let listaProducto_cantidad = Object.keys(productoCantidadMap).map(id_producto => ({
                id_producto: Number(id_producto), // Aseguramos que id_producto sea un número
                cantidad_ventas: productoCantidadMap[Number(id_producto)] // Convertimos id_producto a número
            }));
            listaProducto_cantidad.sort((a, b) => b.cantidad_ventas - a.cantidad_ventas);
            return listaProducto_cantidad;
        });
    }
    Producto_masVendidoEntreRangosDeFecha(fecha_liminf, fecha_limsup) {
        return __awaiter(this, void 0, void 0, function* () {
            let ventas = yield (yield this.execRepository)
                .createQueryBuilder("Venta")
                .innerJoinAndSelect("Venta.servicio", "servicio")
                .where("servicio.fecha >= :fecha_liminf AND servicio.fecha<= :fecha_limsup", { fecha_liminf, fecha_limsup })
                .getMany();
            let productoCantidadMap = {};
            for (let venta of ventas) {
                if (!productoCantidadMap[venta.id_producto]) {
                    productoCantidadMap[venta.id_producto] = 0;
                }
                productoCantidadMap[venta.id_producto] += venta.cantidad;
            }
            let listaProducto_cantidad = Object.keys(productoCantidadMap).map(id_producto => ({
                id_producto: Number(id_producto), // Aseguramos que id_producto sea un número
                cantidad_ventas: productoCantidadMap[Number(id_producto)] // Convertimos id_producto a número
            }));
            listaProducto_cantidad.sort((a, b) => b.cantidad_ventas - a.cantidad_ventas);
            return listaProducto_cantidad;
        });
    }
    findbyId_producto(id_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("venta")
                .leftJoinAndSelect("venta.producto", "p")
                .leftJoinAndSelect("venta.servicio", "s")
                .where("venta.id_producto=:id_producto", { id_producto })
                .getMany();
        });
    }
    findbyId_servicio(id_servicio) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("venta")
                .leftJoinAndSelect("venta.producto", "p")
                .leftJoinAndSelect("venta.servicio", "s")
                .where("venta.id_servicio=:id_servicio", { id_servicio })
                .getOne();
        });
    }
}
exports.VentaService = VentaService;
