import { Response, Request } from "express";
import { SalidaService } from "../services/SalidaService";
export declare class SalidaController {
    private readonly salidaService;
    constructor(salidaService?: SalidaService);
    createSalida(req: Request, res: Response): Promise<void>;
    getSalida(req: Request, res: Response): Promise<void>;
    getSalidaById(req: Request, res: Response): Promise<void>;
    updateSalida(req: Request, res: Response): Promise<void>;
    deleteSalida(req: Request, res: Response): Promise<void>;
    filtrarSalida(req: Request, res: Response): Promise<void>;
    getSalidasPaginated(req: Request, res: Response): Promise<void>;
    OrdenarSalida(req: Request, res: Response): Promise<void>;
    filtrarSalidaJT(req: Request, res: Response): Promise<void>;
}
