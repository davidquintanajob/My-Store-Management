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
exports.ProductoService = void 0;
const base_service_1 = require("../config/base.service");
const Producto_1 = require("../entities/Producto");
const Producto_tienda_1 = require("../entities/Producto_tienda");
const Mapper_1 = require("../helpers/Mapper");
const XLSX = __importStar(require("xlsx"));
class ProductoService extends base_service_1.BaseService {
    constructor() {
        super(Producto_1.Producto);
    }
    // servicio para obtener todos los Productos
    findAllProducto() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Producto")
                .leftJoinAndSelect("Producto.tiendas", "tiendas")
                .leftJoinAndSelect("Producto.imagenes", "imagenes")
                .getMany();
        });
    }
    findProductoById(id_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Producto")
                .leftJoinAndSelect("Producto.tiendas", "tiendas")
                .leftJoinAndSelect("Producto.imagenes", "imagenes")
                .where("Producto.id_producto=:id_producto", { id_producto })
                .getOne();
        });
    }
    // servicio para crear un Productos
    createProducto(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).save(body);
        });
    }
    deleteProducto(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).delete(id);
        });
    }
    // actualizar un Productos
    updateProducto(id, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).update(id, infoUpdate);
        });
    }
    getAllimagenesProductobyId(ID) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Producto")
                .leftJoinAndSelect('Producto.imagenes', 'Imagen')
                .where("Producto.id_producto=:ID", { ID })
                .getOne();
        });
    }
    agregarTienda(id_producto, id_tienda) {
        return __awaiter(this, void 0, void 0, function* () {
            const producto = yield (yield this.execRepository)
                .createQueryBuilder("Producto")
                .leftJoinAndSelect("Producto.tiendas", "tiendas")
                .where("Producto.id_producto=:id_producto", { id_producto })
                .getOne();
            console.log(producto === null || producto === void 0 ? void 0 : producto.tiendas);
            if (producto && producto.tiendas[0]) {
                const tiendaAux = [];
                producto.tiendas.forEach((tienda) => {
                    tiendaAux.push({ "id_tienda": tienda.id_tienda });
                });
                tiendaAux.push({ "id_tienda": id_tienda });
                const nuevoProducto = {
                    "id_producto": id_producto,
                    "tiendas": tiendaAux
                };
                return (yield this.execRepository).save(nuevoProducto);
            }
            else {
                if (!(producto === null || producto === void 0 ? void 0 : producto.tiendas[0])) {
                    const nuevoProducto = {
                        "id_producto": id_producto,
                        "tiendas": [{ "id_tienda": id_tienda }]
                    };
                    return (yield this.execRepository).save(nuevoProducto);
                }
                else
                    return null;
            }
        });
    }
    filtrarProducto(nombre, sku, precio_liminf, precio_limsup, id_tienda, cantidad) {
        return __awaiter(this, void 0, void 0, function* () {
            let productos = yield (yield this.execRepository)
                .createQueryBuilder("Producto")
                .select("pt.cantidad", "cantidad")
                .addSelect("Producto.id_producto", "id_producto")
                .addSelect("Producto.nombre", "nombre")
                .addSelect("Producto.Sku", "Sku")
                .addSelect("Producto.precio_empresa", "precio_empresa")
                .addSelect("Producto.precio", "precio")
                .addSelect("SUM(pt.cantidad)", "cantidad")
                .leftJoinAndSelect("Producto.tiendas", "tiendas")
                .innerJoinAndSelect(Producto_tienda_1.Producto_tienda, "pt", "Producto.id_producto=pt.id_producto")
                .groupBy("Producto.id_producto,tiendas.id_tienda,pt.id_tienda,pt.id_producto")
                .getRawMany();
            productos = productos.map((producto) => {
                if (producto.id_tienda == null)
                    return {
                        "id_producto": producto.id_producto,
                        "nombre": producto.nombre,
                        "Sku": producto.Sku,
                        "precio": producto.precio,
                        "precio_empresa": producto.precio_empresa,
                        "tiendas": [{
                                "id_tienda": producto.tiendas_id_tienda,
                                "cantidad": producto.cantidad
                            }],
                    };
            });
            productos = (0, Mapper_1.MapearProductos)(productos).map((producto) => {
                return {
                    "id_producto": producto.id_producto,
                    "nombre": producto.nombre,
                    "Sku": producto.Sku,
                    "precio": producto.precio,
                    "precio_empresa": producto.precio_empresa,
                    "cantidad_total": producto.tiendas[0].cantidad || 0,
                    "tiendas": producto.tiendas
                };
            });
            const _auxiliar = yield (yield this.execRepository)
                .createQueryBuilder("p")
                .leftJoinAndSelect("p.tiendas", "tiendas")
                .getMany();
            let auxiliar = [];
            _auxiliar.forEach((aux) => {
                if (aux.tiendas.length === 0) {
                    aux.cantidad_total = 0;
                    productos.push(aux);
                }
            });
            if (cantidad != null) {
                if (cantidad >= 0) {
                    productos = productos.filter((producto) => { return producto.cantidad_total === cantidad; });
                    /* if(cantidad===0){
                         const auxiliar=await(await this.execRepository)
                         .createQueryBuilder("p")
                         .leftJoinAndSelect("p.tiendas","tiendas")
                         .getMany();
                         
                         auxiliar.forEach((aux:any)=>{
                             if(aux.tiendas.length===0){
                                 aux.cantidad_total=0;
                                 productos.push(aux);
         
                             }
                         })
                         console.log(productos)
                 }*/
                } /*else {
                    productos = await(await this.execRepository)
                    .createQueryBuilder('p')
                    .leftJoinAndSelect('p.productoTienda', 'pt')
                    .where('pt.id_producto IS NULL OR pt.cantidad = :cantidad', { cantidad: 0 })
                    .getMany();
                }*/
            } /*else{
             productos=await((await this.execRepository)
            .createQueryBuilder("Producto")
            .leftJoinAndSelect("Producto.tiendas","tienda")
            .getMany());
            }*/
            const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            if (nombre) {
                const normalizedNombre = normalizeString(nombre);
                productos = productos.filter((producto) => normalizeString(producto.nombre).toLowerCase().includes(normalizedNombre));
                //            proveedores = proveedores.filter((proveedor: Proveedor) => normalizeString(proveedor.nombre).includes(normalizedNombre));
            }
            if (sku) {
                console.log(sku);
                const normalizedSku = normalizeString(sku);
                productos = productos.filter((producto) => normalizeString(producto.Sku).toLowerCase().includes(normalizedSku));
            }
            if (precio_liminf)
                productos = productos.filter((producto) => producto.precio >= parseInt(precio_liminf));
            if (precio_limsup)
                productos = productos.filter((producto) => producto.precio <= parseInt(precio_limsup));
            if (id_tienda) {
                console.log("Entre a id_tienda!!!");
                productos.forEach((producto) => {
                    if (producto.tiendas)
                        producto.tiendas.forEach((tienda) => {
                            if (tienda.id_tienda === id_tienda)
                                auxiliar.push(producto);
                        });
                });
                productos = auxiliar;
            }
            return productos;
        });
    }
    DeleteAllTiendasinProducto() {
        return __awaiter(this, void 0, void 0, function* () {
            const allProductos = yield (yield this.execRepository)
                .createQueryBuilder("Producto")
                .leftJoinAndSelect("Producto.tiendas", "tiendas")
                .getMany();
            let productos = yield (yield this.execRepository)
                .createQueryBuilder("Producto")
                .select("pt.cantidad", "cantidad")
                .addSelect("Producto.id_producto", "id_producto")
                .innerJoinAndSelect(Producto_tienda_1.Producto_tienda, "pt", "Producto.id_producto=pt.id_producto")
                .where("pt.cantidad=0")
                .getRawMany();
            productos = productos.map((producto) => {
                return {
                    "id_producto": producto.id_producto,
                    "id_tienda": producto.pt_id_tienda,
                    "cantidad": producto.cantidad
                };
            });
            for (let p of allProductos) {
                for (let producto of productos) {
                    if (p.id_producto === producto.id_producto) {
                        console.log("id_tienda:", producto.id_tienda, p.tiendas, "antes");
                        p.tiendas = p.tiendas.filter((tienda) => tienda.id_tienda != producto.id_tienda);
                        (yield this.execRepository).save(p);
                        console.log(p.tiendas, "despues");
                    }
                }
            }
        });
    }
    procesarExcel(filePath) {
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
            console.log(productos);
            productos = productos.map((producto) => {
                return {
                    "nombre": producto.Descripcion,
                    "Sku": producto.Codigo,
                    "precio": producto.Precio_USD,
                    "precio_empresa": (producto.Mayorista_CUP),
                };
            });
            return productos;
        });
    }
    findbySku(sku) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).
                createQueryBuilder("producto")
                .leftJoinAndSelect("producto.imagenes", "i")
                .where("producto.Sku=:sku", { sku })
                .getOne();
        });
    }
    getAllPaginated(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const limite = 20;
            const offset = (page - 1) * limite;
            let auxiliar = [];
            let productos = yield (yield this.execRepository)
                .createQueryBuilder("Producto")
                .select("pt.cantidad", "cantidad")
                .addSelect("Producto.id_producto", "id_producto")
                .addSelect("Producto.nombre", "nombre")
                .addSelect("Producto.Sku", "Sku")
                .addSelect("Producto.precio_empresa", "precio_empresa")
                .addSelect("Producto.precio", "precio")
                .addSelect("SUM(pt.cantidad)", "cantidad")
                .leftJoinAndSelect("Producto.tiendas", "tiendas")
                .leftJoinAndSelect(Producto_tienda_1.Producto_tienda, "pt", "Producto.id_producto=pt.id_producto")
                .groupBy("Producto.id_producto,tiendas.id_tienda,pt.id_tienda,pt.id_producto")
                .getRawMany();
            console.log(productos);
            productos = productos.map((producto) => {
                if (producto.id_tienda == null)
                    return {
                        "id_producto": producto.id_producto,
                        "nombre": producto.nombre,
                        "Sku": producto.Sku,
                        "precio": producto.precio,
                        "precio_empresa": producto.precio_empresa,
                        "tiendas": [{
                                "id_tienda": producto.tiendas_id_tienda,
                                "cantidad": producto.cantidad
                            }],
                    };
            });
            productos = (0, Mapper_1.MapearProductos)(productos).map((producto) => {
                return {
                    "id_producto": producto.id_producto,
                    "nombre": producto.nombre,
                    "Sku": producto.Sku,
                    "precio": producto.precio,
                    "precio_empresa": producto.precio_empresa,
                    "cantidad_total": producto.tiendas[0].cantidad,
                    "tiendas": producto.tiendas
                };
            });
            const _auxiliar = yield (yield this.execRepository)
                .createQueryBuilder("p")
                .leftJoinAndSelect("p.tiendas", "tiendas")
                .getMany();
            _auxiliar.forEach((aux) => {
                if (aux.tiendas.length === 0) {
                    aux.cantidad_total = 0;
                    productos.push(aux);
                }
            });
            productos = productos.slice(offset, offset + limite);
            console.log(productos.length);
            const cantidad_total_productos = yield (yield this.execRepository)
                .createQueryBuilder("Producto")
                .getCount();
            return { "productos": productos,
                "pagina": page,
                "cantidad_total_productos": cantidad_total_productos
            };
        });
    }
}
exports.ProductoService = ProductoService;
