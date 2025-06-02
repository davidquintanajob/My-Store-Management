import { Response, Request } from "express";
import { ProductoService } from "../services/ProductoService";
import { TiendaService } from "../services/TiendaService";
import { Producto_tiendaService } from "../services/Producto_tiendaService";
import { EntradaService } from "../services/EntradaService";
import { SalidaService } from "../services/SalidaService";
import { ServicioService } from "../services/ServicioService";
import { OrdenarProducto } from "../helpers/Ordenar_criterios";
import { VentaService } from "../services/VentaService";
import * as XLSX from "xlsx";
import { log } from "node:console";
import { Producto_tiendaDto } from "../DTO/Producto_tiendaDto";

export class ProductoController {
  private readonly productoService: ProductoService;
  private readonly tiendaService: TiendaService;
  private readonly producto_tienda: Producto_tiendaService;
  private readonly entradaService: EntradaService;
  private readonly salidaService: SalidaService;
  private readonly ventaService: VentaService;
  private readonly servicioService: ServicioService;

  constructor(
    productoService: ProductoService = new ProductoService(),
    tiendaService: TiendaService = new TiendaService(),
    prodcuto_tienda: Producto_tiendaService = new Producto_tiendaService(),
    entradaService: EntradaService = new EntradaService(),
    salidaService: SalidaService = new SalidaService(),
    ventaService: VentaService = new VentaService(),
    servicioService: ServicioService = new ServicioService()
  ) {
    this.productoService = productoService;
    this.tiendaService = tiendaService;
    this.producto_tienda = prodcuto_tienda;
    this.entradaService = entradaService;
    this.salidaService = salidaService;
    this.ventaService = ventaService;
    this.servicioService = servicioService;
  }

  async createProducto(req: Request, res: Response) {
    try {
      const data = await this.productoService.createProducto(req.body);
      res.status(200).json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  async getProducto(req: Request, res: Response) {
    try {
      const data = await this.productoService.findAllProducto();
      res.status(200).json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  async getProductoById(req: Request, res: Response) {
    const { ID } = req.params;
    try {
      const data = await this.productoService.findProductoById(parseInt(ID));
      if (data) res.status(200).json(data);
      else res.status(404).json();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  async updateProducto(req: Request, res: Response) {
    const { ID } = req.params;
    try {
      const data = await this.productoService.updateProducto(
        parseInt(ID),
        req.body
      );
      res.status(200).json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  async deleteProducto(req: Request, res: Response) {
    const { ID } = req.params;
    try {
      const data = await this.productoService.deleteProducto(parseInt(ID));
      res.status(200).json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  async getAllImages(req: Request, res: Response) {
    const { ID } = req.params;
    try {
      console.log(ID);
      const data = await this.productoService.getAllimagenesProductobyId(
        parseInt(ID)
      );
      if (data) res.status(200).json(data);
      else res.status(404).json("No encontraron las fotos");
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  async filtrarProducto(req: Request, res: Response) {
    const { nombre, sku, precio_liminf, precio_limsup, id_tienda, cantidad } =
      req.body;
    console.log(nombre, sku, precio_liminf, precio_limsup, id_tienda);
    try {
      const data = await this.productoService.filtrarProducto(
        nombre,
        sku,
        precio_liminf,
        precio_limsup,
        id_tienda,
        cantidad
      );
      if (data) {
        res.status(200).json(data);
      } else res.status(404).json(data);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async OrdenarProductos(req: Request, res: Response) {
    let { items, criterio, ascendente } = req.body;
    try {
      console.log(typeof ascendente);
      const data = await OrdenarProducto(ascendente, items, criterio);
      data
        ? res.status(200).json(data)
        : res.status(404).json("no se puede ordenar");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async AgregarTiendaAProducto(req: Request, res: Response) {
    const { id_tienda, id_producto } = req.body;
    try {
      const data = await this.productoService.agregarTienda(
        parseInt(id_producto),
        parseInt(id_tienda)
      );
      data
        ? res.status(200).json(data)
        : res.status(404).json("Producto no encontrado");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async DeleteAllTiendasinProducto(req: Request, res: Response) {
    try {
      await this.productoService.DeleteAllTiendasinProducto();
      res.status(200).json(true);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async HacerExcel(req: Request, res: Response) {
    const { productos } = req.body;
    try {
      const worksheet = XLSX.utils.json_to_sheet(productos);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

      const date: Date = new Date();
      const str: string = `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}`;

      const excelBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=productos-${str}.xlsx`
      );
      res.setHeader("Content-Type", "application/octet-stream");
      res.send(excelBuffer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async ImportarExcel(req: Request, res: Response) {
    const { path } = req.body;
    try {
      const data = await this.productoService.procesarExcel(path);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async findbySku(req: Request, res: Response) {
    const { sku } = req.params;
    try {
      const data = await this.productoService.findbySku(sku);
      data
        ? res.status(200).json(data)
        : res.status(404).json("No se encontro");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllPaginated(req: Request, res: Response) {
    const { page } = req.params;
    try {
      const data = await this.productoService.getAllPaginated(parseInt(page));
      data
        ? res.status(200).json(data)
        : res.status(404).json("Data not found");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async HacerExcelwithColumns(req: Request, res: Response) {
    const { productos, columns } = req.body;
    try {
      // Crear una hoja de trabajo desde productos y aplicar las columnas
      const worksheet = XLSX.utils.json_to_sheet(productos, {
        header: columns,
      });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

      const date: Date = new Date();
      const str: string = `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}`;

      const excelBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=productos-${str}.xlsx`
      );
      res.setHeader("Content-Type", "application/octet-stream");
      res.send(excelBuffer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async machearProducto(req: Request, res: Response) {
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
      const productoExistente = await this.productoService.findProductoById(
        parseInt(producto)
      );
      // Buscar tienda por ID
      const tiendaExistente = await this.tiendaService.findTiendaById(
        parseInt(tienda)
      );

      if (!productoExistente || !tiendaExistente) {
        res.status(404).json({ error: "Producto o tienda no encontrados" });
        return;
      }
      let cantidadEnExistencia = 0;
      let sumaDeEntradas = 0;
      let sumaDeVentas = 0;
      let cantidadSalida = 0;
      // Obtener la relacion del producto en la tienda
      const productoTiendaRelation =
        await this.producto_tienda.getTiendasbyProducto(parseInt(producto));
      const auxProductoTiendaRelation = productoTiendaRelation.filter(
        (producto) => producto.tienda.id_tienda === parseInt(tienda)
      );
      cantidadEnExistencia = auxProductoTiendaRelation[0].cantidad;

      // Obtener todas las entradas por el producto
      const entradasProProducto = await this.entradaService.EntradasbyProducto(
        parseInt(producto)
      );
      const entradasProProductoEnTienda = entradasProProducto.filter(
        (entrada) => entrada.tienda.id_tienda === parseInt(tienda)
      );
      for (let entrada of entradasProProductoEnTienda) {
        sumaDeEntradas += entrada.cantidad;
      }

      // Obtener todos los movimientos por producto
      const allSalidas = await this.salidaService.findAllSalidas();
      const allSalidasDelProducto = allSalidas.filter(
        (salida) => salida.producto.id_producto === parseInt(producto)
      );
      for (let salida of allSalidasDelProducto) {
        if (salida.tienda_origen.id_tienda === parseInt(tienda)) {
          cantidadSalida -= salida.cantidad;
        } 
        if (salida.tienda_destino.id_tienda === parseInt(tienda)) {
          cantidadSalida += salida.cantidad;
        }
      }

      // Obtener todas las ventas del producto
      const ventasByProducto = await this.ventaService.findbyId_producto(
        parseInt(producto)
      );
      for (let venta of ventasByProducto) {
        const servicio = await this.servicioService.findServicioById(venta.servicio.id_servicio);
        if (servicio?.tienda.id_tienda === parseInt(tienda)) {
          sumaDeVentas += venta.cantidad;
        }
      }
      
      // Validacion final
      if (
        sumaDeEntradas + cantidadSalida - sumaDeVentas !==
        cantidadEnExistencia
      ) {
        const productoTiendaDto = new Producto_tiendaDto();
        productoTiendaDto.cantidad =
          sumaDeEntradas + cantidadSalida - sumaDeVentas;
        const result = await this.producto_tienda.updateProducto_tienda(
          parseInt(producto),
          parseInt(tienda),
          productoTiendaDto
        );
        res.status(200).json({
          result,
        });
        return;
      }

      res.status(200).json({ message: "Producto y tienda encontrados" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
