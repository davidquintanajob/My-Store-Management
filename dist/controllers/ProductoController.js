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
exports.ProductoController = void 0;
const ProductoService_1 = require("../services/ProductoService");
const TiendaService_1 = require("../services/TiendaService");
const Producto_tiendaService_1 = require("../services/Producto_tiendaService");
const EntradaService_1 = require("../services/EntradaService");
const SalidaService_1 = require("../services/SalidaService");
const ServicioService_1 = require("../services/ServicioService");
const Ordenar_criterios_1 = require("../helpers/Ordenar_criterios");
const VentaService_1 = require("../services/VentaService");
const XLSX = __importStar(require("xlsx"));
const Producto_tiendaDto_1 = require("../DTO/Producto_tiendaDto");
class ProductoController {
    constructor(productoService = new ProductoService_1.ProductoService(), tiendaService = new TiendaService_1.TiendaService(), prodcuto_tienda = new Producto_tiendaService_1.Producto_tiendaService(), entradaService = new EntradaService_1.EntradaService(), salidaService = new SalidaService_1.SalidaService(), ventaService = new VentaService_1.VentaService(), servicioService = new ServicioService_1.ServicioService()) {
        this.productoService = productoService;
        this.tiendaService = tiendaService;
        this.producto_tienda = prodcuto_tienda;
        this.entradaService = entradaService;
        this.salidaService = salidaService;
        this.ventaService = ventaService;
        this.servicioService = servicioService;
    }
    createProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.productoService.createProducto(req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    getProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.productoService.findAllProducto();
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    getProductoById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.productoService.findProductoById(parseInt(ID));
                if (data)
                    res.status(200).json(data);
                else
                    res.status(404).json();
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    updateProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.productoService.updateProducto(parseInt(ID), req.body);
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    deleteProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                const data = yield this.productoService.deleteProducto(parseInt(ID));
                res.status(200).json(data);
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    getAllImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID } = req.params;
            try {
                console.log(ID);
                const data = yield this.productoService.getAllimagenesProductobyId(parseInt(ID));
                if (data)
                    res.status(200).json(data);
                else
                    res.status(404).json("No encontraron las fotos");
            }
            catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }
    filtrarProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, sku, precio_liminf, precio_limsup, id_tienda, cantidad } = req.body;
            console.log(nombre, sku, precio_liminf, precio_limsup, id_tienda);
            try {
                const data = yield this.productoService.filtrarProducto(nombre, sku, precio_liminf, precio_limsup, id_tienda, cantidad);
                if (data) {
                    res.status(200).json(data);
                }
                else
                    res.status(404).json(data);
            }
            catch (error) {
                console.log(error.message);
            }
        });
    }
    OrdenarProductos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { items, criterio, ascendente } = req.body;
            try {
                console.log(typeof ascendente);
                const data = yield (0, Ordenar_criterios_1.OrdenarProducto)(ascendente, items, criterio);
                data
                    ? res.status(200).json(data)
                    : res.status(404).json("no se puede ordenar");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    AgregarTiendaAProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_tienda, id_producto } = req.body;
            try {
                const data = yield this.productoService.agregarTienda(parseInt(id_producto), parseInt(id_tienda));
                data
                    ? res.status(200).json(data)
                    : res.status(404).json("Producto no encontrado");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    DeleteAllTiendasinProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.productoService.DeleteAllTiendasinProducto();
                res.status(200).json(true);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    HacerExcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productos } = req.body;
            try {
                const worksheet = XLSX.utils.json_to_sheet(productos);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
                const date = new Date();
                const str = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                const excelBuffer = XLSX.write(workbook, {
                    type: "buffer",
                    bookType: "xlsx",
                });
                res.setHeader("Content-Disposition", `attachment; filename=productos-${str}.xlsx`);
                res.setHeader("Content-Type", "application/octet-stream");
                res.send(excelBuffer);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    ImportarExcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { path } = req.body;
            try {
                const data = yield this.productoService.procesarExcel(path);
                res.status(200).json(data);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    findbySku(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sku } = req.params;
            try {
                const data = yield this.productoService.findbySku(sku);
                data
                    ? res.status(200).json(data)
                    : res.status(404).json("No se encontro");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getAllPaginated(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page } = req.params;
            try {
                const data = yield this.productoService.getAllPaginated(parseInt(page));
                data
                    ? res.status(200).json(data)
                    : res.status(404).json("Data not found");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    HacerExcelwithColumns(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productos, columns } = req.body;
            try {
                // Crear una hoja de trabajo desde productos y aplicar las columnas
                const worksheet = XLSX.utils.json_to_sheet(productos, {
                    header: columns,
                });
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
                const date = new Date();
                const str = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                const excelBuffer = XLSX.write(workbook, {
                    type: "buffer",
                    bookType: "xlsx",
                });
                res.setHeader("Content-Disposition", `attachment; filename=productos-${str}.xlsx`);
                res.setHeader("Content-Type", "application/octet-stream");
                res.send(excelBuffer);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    machearProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { producto, tienda } = req.params;
            try {
                // Validación de campos
                if (!producto || !tienda) {
                    res.status(400).json({
                        error: "Ambos campos 'producto' y 'tienda' son obligatorios",
                    });
                    return;
                }
                // Buscar producto por ID
                const productoExistente = yield this.productoService.findProductoById(parseInt(producto));
                // Buscar tienda por ID
                const tiendaExistente = yield this.tiendaService.findTiendaById(parseInt(tienda));
                if (!productoExistente || !tiendaExistente) {
                    res.status(404).json({ error: "Producto o tienda no encontrados" });
                    return;
                }
                let cantidadEnExistencia = 0;
                let sumaDeEntradas = 0;
                let sumaDeVentas = 0;
                let cantidadSalida = 0;
                // Obtener la relacion del producto en la tienda
                const productoTiendaRelation = yield this.producto_tienda.getTiendasbyProducto(parseInt(producto));
                const auxProductoTiendaRelation = productoTiendaRelation.filter((producto) => producto.tienda.id_tienda === parseInt(tienda));
                cantidadEnExistencia = auxProductoTiendaRelation[0].cantidad;
                // Obtener todas las entradas por el producto
                const entradasProProducto = yield this.entradaService.EntradasbyProducto(parseInt(producto));
                const entradasProProductoEnTienda = entradasProProducto.filter((entrada) => entrada.tienda.id_tienda === parseInt(tienda));
                for (let entrada of entradasProProductoEnTienda) {
                    sumaDeEntradas += entrada.cantidad;
                }
                // Obtener todos los movimientos por producto
                const allSalidas = yield this.salidaService.findAllSalidas();
                const allSalidasDelProducto = allSalidas.filter((salida) => salida.producto.id_producto === parseInt(producto));
                for (let salida of allSalidasDelProducto) {
                    if (salida.tienda_origen.id_tienda === parseInt(tienda)) {
                        cantidadSalida -= salida.cantidad;
                    }
                    if (salida.tienda_destino.id_tienda === parseInt(tienda)) {
                        cantidadSalida += salida.cantidad;
                    }
                }
                // Obtener todas las ventas del producto
                const ventasByProducto = yield this.ventaService.findbyId_producto(parseInt(producto));
                for (let venta of ventasByProducto) {
                    const servicio = yield this.servicioService.findServicioById(venta.servicio.id_servicio);
                    if ((servicio === null || servicio === void 0 ? void 0 : servicio.tienda.id_tienda) === parseInt(tienda)) {
                        sumaDeVentas += venta.cantidad;
                    }
                }
                // Validacion final
                if (sumaDeEntradas + cantidadSalida - sumaDeVentas !==
                    cantidadEnExistencia) {
                    const productoTiendaDto = new Producto_tiendaDto_1.Producto_tiendaDto();
                    productoTiendaDto.cantidad =
                        sumaDeEntradas + cantidadSalida - sumaDeVentas;
                    const result = yield this.producto_tienda.updateProducto_tienda(parseInt(producto), parseInt(tienda), productoTiendaDto);
                    res.status(200).json({
                        result,
                    });
                    return;
                }
                res.status(200).json({ message: "Producto y tienda encontrados" });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.ProductoController = ProductoController;
