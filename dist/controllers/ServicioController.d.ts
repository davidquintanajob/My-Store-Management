import { Response, Request } from "express";
import { ServicioService } from "../services/ServicioService";
export declare class ServicioController {
    private readonly servicioService;
    constructor(servicioService?: ServicioService);
    createServicio(req: Request, res: Response): Promise<void>;
    getServicio(req: Request, res: Response): Promise<void>;
    getServicioById(req: Request, res: Response): Promise<void>;
    updateServicio(req: Request, res: Response): Promise<void>;
    deleteServicio(req: Request, res: Response): Promise<void>;
    getAllGanancia(req: Request, res: Response): Promise<void>;
    getServiciosPaginated(req: Request, res: Response): Promise<void>;
    getServiciosPorTipo_servicio(req: Request, res: Response): Promise<void>;
    OrdenarServicios(req: Request, res: Response): Promise<void>;
    filtrarServicios(req: Request, res: Response): Promise<void>;
    filtrarServiciosJT(req: Request, res: Response): Promise<void>;
}
