import { Response, Request } from "express";
import { EntradaService } from "../services/EntradaService";
export declare class EntradaController {
    private readonly entradaService;
    constructor(entradaService?: EntradaService);
    createEntrada(req: Request, res: Response): Promise<void>;
    getEntrada(req: Request, res: Response): Promise<void>;
    getEntradaById(req: Request, res: Response): Promise<void>;
    updateEntrada(req: Request, res: Response): Promise<void>;
    deleteEntrada(req: Request, res: Response): Promise<void>;
    getAllEntradasbyProveedor(req: Request, res: Response): Promise<void>;
    getEntradasPaginated(req: Request, res: Response): Promise<void>;
    filtrarEntradasConPaginacion(req: Request, res: Response): Promise<void>;
    filtrarEntradas(req: Request, res: Response): Promise<void>;
    OrdenarEntradas(req: Request, res: Response): Promise<void>;
    EntradasbyProducto(req: Request, res: Response): Promise<void>;
    getEntradasPorVencimiento(req: Request, res: Response): Promise<void>;
}
