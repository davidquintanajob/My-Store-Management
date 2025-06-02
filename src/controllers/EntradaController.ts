import { Response, Request } from "express";
import { EntradaService } from "../services/EntradaService";
import { OrdenarEntradas as OrderEntradas } from "../helpers/Ordenar_criterios";
export class EntradaController {
  constructor(
    private readonly entradaService: EntradaService = new EntradaService()
  ) {}
  async createEntrada(req: Request, res: Response) {
    try {
      const data = await this.entradaService.createEntrada(req.body);
      res.status(200).json(data);
    } catch (e: any) {
      console.log(e.message);
      res.status(500).json({ error: e.message });
    }
  }

  async getEntrada(req: Request, res: Response) {
    try {
      const data = await this.entradaService.findAllEntradas();
      res.status(200).json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
  async getEntradaById(req: Request, res: Response) {
    const { ID } = req.params;
    try {
      const data = await this.entradaService.findEntradaById(parseInt(ID));
      if (data) res.status(200).json(data);
      else res.status(404).json();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
  async updateEntrada(req: Request, res: Response) {
    const { ID } = req.params;
    try {
      const data = await this.entradaService.updateEntrada(
        parseInt(ID),
        req.body
      );
      res.status(200).json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
  async deleteEntrada(req: Request, res: Response) {
    const { ID } = req.params;
    try {
      const data = await this.entradaService.deleteEntrada(parseInt(ID));
      res.status(200).json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
  async getAllEntradasbyProveedor(req: Request, res: Response) {
    const { id_proveedor } = req.params;
    try {
      console.log(id_proveedor);
      const data = await this.entradaService.getAllEntradasbyProveedor(
        parseInt(id_proveedor)
      );
      data ? res.status(200).json(data) : res.status(404).json("No encontrado");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  async getEntradasPaginated(req: Request, res: Response) {
    const { page } = req.params;
    try {
      const data = await this.entradaService.getEntradasPaginated(
        parseInt(page)
      );
      data
        ? res.status(200).json(data)
        : res.status(404).json("Data not found");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  async filtrarEntradasConPaginacion(req: Request, res: Response) {
    const { num, page } = req.params;
    const {
      nombre_proveedor,
      nombre_producto,
      costo_liminf,
      costo_limsup,
      fecha_liminf,
      fecha_limsup,
    } = req.body;
  
    try {
      const data = await this.entradaService.filtrarEntradasConPaginacion(
        nombre_proveedor,
        nombre_producto,
        costo_liminf,
        costo_limsup,
        fecha_liminf,
        fecha_limsup,
        parseInt(num),
        parseInt(page)
      );
  
      const totalElements = await this.entradaService.filtrarEntradas(
        nombre_proveedor,
        nombre_producto,
        costo_liminf,
        costo_limsup,
        fecha_liminf,
        fecha_limsup
      );
  
      const response = {
        entradas: data,
        pagina: parseInt(page),
        totalElements: totalElements.length,
      };
  
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  async filtrarEntradas(req: Request, res: Response) {
    const {
      nombre_proveedor,
      nombre_producto,
      costo_liminf,
      costo_limsup,
      fecha_liminf,
      fecha_limsup,
    } = req.body;
    try {
      const data = await this.entradaService.filtrarEntradas(
        nombre_proveedor,
        nombre_producto,
        costo_liminf,
        costo_limsup,
        fecha_liminf,
        fecha_limsup
      );
      data ? res.status(200).json(data) : res.status(404).json("No encontrado");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  async OrdenarEntradas(req: Request, res: Response) {
    let { items, criterio, ascendente } = req.body;
    try {
      console.log(typeof ascendente);
      const data = OrderEntradas(ascendente, items, criterio);
      data
        ? res.status(200).json(data)
        : res.status(404).json("no se puede ordenar");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  async EntradasbyProducto(req: Request, res: Response) {
    const { id_producto } = req.params;
    try {
      const data = await this.entradaService.EntradasbyProducto(
        parseInt(id_producto)
      );
      data
        ? res.status(200).json(data)
        : res.status(404).json("Producto no encontrado");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  async getEntradasPorVencimiento(req: Request, res: Response) {
    const { fecha } = req.params;
    try {
      const data = await this.entradaService.getEntradasPorVencimiento(fecha);
      data ? res.status(200).json(data) : res.status(404).json("No encontrado");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
