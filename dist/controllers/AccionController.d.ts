import { Response, Request } from "express";
import { AccionService } from "../services/AccionService";
export declare class AccionController {
    private readonly accionService;
    constructor(accionService?: AccionService);
    createAccion(req: Request, res: Response): Promise<void>;
    getAccion(req: Request, res: Response): Promise<void>;
    getAccionById(req: Request, res: Response): Promise<void>;
    updateAccion(req: Request, res: Response): Promise<void>;
    deleteAccion(req: Request, res: Response): Promise<void>;
    filtrarAccion(req: Request, res: Response): Promise<void>;
    getAccionesPaginated(req: Request, res: Response): Promise<void>;
    OrdenarAcciones(req: Request, res: Response): Promise<void>;
}
