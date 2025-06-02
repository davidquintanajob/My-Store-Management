"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.Producto_tiendaService = void 0;
const base_service_1 = require("../config/base.service");
const Producto_tienda_1 = require("../entities/Producto_tienda");
const XLSX = __importStar(require("xlsx"));
/*ACUERDATE DE MANIPULAR GET BY ID AND DELETE BY ID*/
class Producto_tiendaService extends base_service_1.BaseService {
    constructor() {
        super(Producto_tienda_1.Producto_tienda);
    }
    // servicio para obtener todos los Producto_tiendas
    findAllProducto_tienda() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).find();
        });
    }
    findProducto_tiendaById(id_producto, id_tienda) {
        return __awaiter(this, void 0, void 0, function* () {
            // return (await this.execRepository).findOneBy({ id_producto });
            return (yield this.execRepository)
                .createQueryBuilder("Producto_tienda")
                .where('id_producto = :id_producto and id_tienda = :id_tienda', { id_producto, id_tienda })
                .getOne();
        });
    }
    // servicio para crear un Producto_tiendas
    createProducto_tienda(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    deleteProducto_tienda(id_producto, id_tienda) {
        return __awaiter(this, void 0, void 0, function* () {
            (yield this.execRepository)
                .createQueryBuilder("Producto_tienda")
                .delete()
                .where('id_producto = :id_producto and id_tienda = :id_tienda', { id_producto, id_tienda })
                .execute();
            console.log('Elemento eliminado correctamente.');
        });
    }
    // actualizar un Producto_tiendas
    updateProducto_tienda(id_producto, id_tienda, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Producto_tienda")
                .update(Producto_tienda_1.Producto_tienda)
                .set(infoUpdate)
                .where('id_producto = :id_producto and id_tienda = :id_tienda', { id_producto, id_tienda })
                .execute();
        });
    }
    moverProducto(id_producto, id_tienda_Origen, id_tienda_destino, cantidad) {
        return __awaiter(this, void 0, void 0, function* () {
            const productoTiendaOrigen = yield (yield this.execRepository)
                .createQueryBuilder("Producto_tienda")
                .where('id_producto = :id_producto and id_tienda = :id_tienda_Origen', { id_producto, id_tienda_Origen })
                .getOne();
            const productoTiendaDestino = yield (yield this.execRepository)
                .createQueryBuilder("Producto_tienda")
                .where('id_producto = :id_producto and id_tienda = :id_tienda_destino', { id_producto, id_tienda_destino })
                .getOne();
            productoTiendaOrigen.cantidad -= cantidad;
            console.log(id_producto, id_tienda_Origen, id_tienda_destino, cantidad);
            console.log(productoTiendaOrigen);
            console.log(productoTiendaDestino);
            if (productoTiendaDestino) {
                productoTiendaDestino.cantidad += cantidad;
                const nuevoProductoTiendaOrigen = {
                    id_producto: productoTiendaOrigen.id_producto,
                    id_tienda: productoTiendaOrigen.id_tienda,
                    cantidad: productoTiendaOrigen.cantidad,
                };
                const nuevoProductoTiendaDestino = {
                    id_producto: productoTiendaDestino.id_producto,
                    id_tienda: productoTiendaDestino.id_tienda,
                    cantidad: productoTiendaDestino.cantidad,
                };
                (yield this.execRepository).save(nuevoProductoTiendaOrigen);
                (yield this.execRepository).save(nuevoProductoTiendaDestino);
            }
            else {
                const nuevoProductoTiendaDestino = {
                    id_producto: id_producto,
                    id_tienda: id_tienda_destino,
                    cantidad: cantidad,
                };
                const nuevoProductoTiendaOrigen = {
                    id_producto: productoTiendaOrigen.id_producto,
                    id_tienda: productoTiendaOrigen.id_tienda,
                    cantidad: productoTiendaOrigen.cantidad,
                };
                (yield this.execRepository).save(nuevoProductoTiendaOrigen);
                (yield this.execRepository).save(nuevoProductoTiendaDestino);
            }
        });
    }
    cantidadTotalProductos(id_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            const producto_tienda = ((yield this.execRepository)
                .createQueryBuilder("Producto_tienda")
                .where("id_producto = :id_producto", { id_producto }))
                .getMany();
            const cantidadtotal = (yield producto_tienda).reduce((acumulador, valor) => acumulador + valor.cantidad, 0);
            console.log(cantidadtotal);
            return cantidadtotal;
        });
    }
    realizarVenta(id_producto, id_tienda, cantidad) {
        return __awaiter(this, void 0, void 0, function* () {
            let producto_tienda_venta = yield (yield this.execRepository)
                .createQueryBuilder("pt")
                .where("pt.id_tienda=:id_tienda and pt.id_producto=:id_producto", { id_tienda, id_producto })
                .getOne();
            if (producto_tienda_venta) {
                producto_tienda_venta.cantidad -= cantidad;
                const nuevoProducto_tienda = {
                    id_tienda: id_tienda,
                    id_producto: id_producto,
                    cantidad: producto_tienda_venta === null || producto_tienda_venta === void 0 ? void 0 : producto_tienda_venta.cantidad
                };
                return (yield this.execRepository).save(nuevoProducto_tienda);
            }
            return null;
        });
    }
    getProductosTienda(id_tienda) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Producto_tienda")
                .leftJoinAndSelect("Producto_tienda.tienda", "t")
                .leftJoinAndSelect("Producto_tienda.producto", "p")
                .where("Producto_tienda.id_tienda=:id_tienda", { id_tienda })
                .getMany();
        });
    }
    getTiendasbyProducto(id_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Producto_tienda")
                .leftJoinAndSelect("Producto_tienda.tienda", "t")
                .leftJoinAndSelect("Producto_tienda.producto", "p")
                .where("Producto_tienda.id_producto=:id_producto", { id_producto })
                .getMany();
        });
    }
    filtrarPorCantidad(cantidad_entrada) {
        return __awaiter(this, void 0, void 0, function* () {
            let productos = yield (yield this.execRepository).find();
            let productoCantidadMap = {};
            for (let porducto of productos) {
                if (!productoCantidadMap[porducto.id_producto]) {
                    productoCantidadMap[porducto.id_producto] = 0;
                }
                productoCantidadMap[porducto.id_producto] += porducto.cantidad;
            }
            let listaProducto_cantidad = Object.keys(productoCantidadMap).map(id_producto => ({
                id_producto: Number(id_producto), // Aseguramos que id_producto sea un número
                cantidad: productoCantidadMap[Number(id_producto)] // Convertimos id_producto a número
            }));
            console.log(listaProducto_cantidad);
            return listaProducto_cantidad.filter((producto_tienda) => producto_tienda.cantidad === cantidad_entrada);
        });
    }
    HacerEntrada(id_tienda, id_producto, cantidad) {
        return __awaiter(this, void 0, void 0, function* () {
            let prod_tienda = yield (yield this.execRepository)
                .createQueryBuilder("pt")
                .where("id_producto=:id_producto and id_tienda=:id_tienda", { id_producto, id_tienda })
                .getOne();
            if (!prod_tienda) {
                const producto_tienda = {
                    "producto": { "id_producto": id_producto },
                    "tienda": { "id_tienda": id_tienda },
                    "cantidad": cantidad
                };
                return (yield this.execRepository).save(producto_tienda);
            }
            else {
                prod_tienda.cantidad += cantidad;
                return (yield this.execRepository).save(prod_tienda);
            }
        });
    }
    deleteProducto_tiendain0() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (yield this.execRepository)
                    .createQueryBuilder("producto_tienda")
                    .delete()
                    .where('producto_tienda.cantidad=0')
                    .execute();
                console.log('Elemento eliminado correctamente.');
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    filtrarProducto_tienda(nombre_producto, sku, precio_liminf, precio_limsup, id_tienda, cantidad) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            let producto_tiendas = yield (yield this.execRepository)
                .createQueryBuilder("pt")
                .leftJoinAndSelect("pt.producto", "p")
                .leftJoinAndSelect("pt.tienda", "t")
                .where("t.id_tienda=:id_tienda", { id_tienda })
                .getMany();
            if (nombre_producto) {
                const normalizedNombre = normalizeString(nombre_producto);
                producto_tiendas = producto_tiendas.filter((producto_tienda) => normalizeString(producto_tienda.producto.nombre).toLowerCase().includes(normalizedNombre));
            }
            if (sku) {
                const normalizedSku = normalizeString(sku);
                producto_tiendas = producto_tiendas.filter((producto_tienda) => normalizeString(producto_tienda.producto.Sku).toLowerCase().includes(normalizedSku));
            }
            if (precio_liminf)
                producto_tiendas = producto_tiendas.filter((producto_tienda) => producto_tienda.producto.precio >= parseInt(precio_liminf));
            if (precio_limsup)
                producto_tiendas = producto_tiendas.filter((producto_tienda) => producto_tienda.producto.precio <= parseInt(precio_limsup));
            if (cantidad != null) {
                if (cantidad >= 0) {
                    producto_tiendas = producto_tiendas.filter((producto_tienda) => producto_tienda.cantidad === cantidad);
                }
            }
            return producto_tiendas;
        });
    }
    Producto_tiendaToExcel(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            const headers = worksheet[0]; // Fila 3 (índice 2)
            const rows = worksheet.slice(1); // Desde la fila 4 en adelante (índice 3)
            let productos = rows.map((row) => {
                let producto = {};
                headers.forEach((header, index) => {
                    producto[header] = row[index];
                });
                return producto;
            });
            productos = productos.map((prod) => {
                return {
                    "Sku": prod.Codigo,
                    "Almacen": prod.Almacen,
                    "Taller_Cell": prod.Taller_Cell,
                    "Taller_PC": prod.Taller_PC,
                    "Tienda": prod.Tienda,
                    "Cienfuegos": prod.Cienfuegos
                };
            });
            return productos;
        });
    }
}
exports.Producto_tiendaService = Producto_tiendaService;
