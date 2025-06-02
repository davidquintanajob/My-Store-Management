import { Request, Response } from "express";
import { EntradaController } from "../controllers/EntradaController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";

export class EntradaRouter extends BaseRouter<EntradaController> {
  constructor() {
    super(EntradaController);
  }
  routes(): void {
    this.router.get("/Entrada", [verifyToken], (req: Request, res: Response) =>
      this.controller.getEntrada(req, res)
    );
    // Entrada por id
    this.router.get(
      "/Entrada/:ID",
      [verifyToken],
      (req: Request, res: Response) => this.controller.getEntradaById(req, res)
    );

    // adicionar Entrada
    this.router.post(
      "/Entrada/createEntrada",
      [verifyToken],
      (req: Request, res: Response) => {
        console.log("Llamamos a response, request");
        this.controller.createEntrada(req, res);
      }
    );

    //modificar Entrada
    this.router.put(
      "/Entrada/updateEntrada/:ID",
      [verifyToken],
      (req: Request, res: Response) => this.controller.updateEntrada(req, res)
    );

    // eliminar Entrada
    this.router.delete(
      "/Entrada/deleteEntrada/:ID",
      [verifyToken],
      (req: Request, res: Response) => this.controller.deleteEntrada(req, res)
    );

    this.router.get(
      "/Entrada/getProveedores/:id_proveedor",
      [verifyToken],
      (req: Request, res: Response) =>
        this.controller.getAllEntradasbyProveedor(req, res)
    );

    this.router.get(
      "/Entrada/getPaginated/:page",
      [verifyToken],
      (req: Request, res: Response) =>
        this.controller.getEntradasPaginated(req, res)
    );

    this.router.post(
      "/Entrada/api/filtrar",
      [verifyToken],
      (req: Request, res: Response) => {
        console.log("Llamamos a response, request");
        this.controller.filtrarEntradas(req, res);
      }
    );

    this.router.post(
      "/Entrada/api/filtrarPaginate/:num/:page",
      [verifyToken],
      (req: Request, res: Response) => {
        console.log("Llamamos a response, request");
        this.controller.filtrarEntradasConPaginacion(req, res);
      }
    );

    this.router.post(
      "/Entrada/ordenar/all",
      [verifyToken],
      (req: Request, res: Response) => {
        console.log("Llamamos a response, request");
        this.controller.OrdenarEntradas(req, res);
      }
    );

    this.router.get(
      "/Entrada/Producto/:id_producto",
      [verifyToken],
      (req: Request, res: Response) =>
        this.controller.EntradasbyProducto(req, res)
    );

    this.router.get(
      "/Entrada/vencimiento/:fecha",
      [verifyToken],
      (req: Request, res: Response) => this.controller.getEntradasPorVencimiento(req, res)
    );
  }
}
