import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { AccionDto } from "../DTO/AccionDto";
import { Accion } from "../entities/Accion";
export declare class AccionService extends BaseService<Accion> {
    constructor();
    findAllAcciones(): Promise<Accion[]>;
    findAccionById(id_accion: number): Promise<Accion | null>;
    createAccion(body: AccionDto): Promise<Accion>;
    deleteAccion(id: number): Promise<DeleteResult>;
    getAccionesPaginated(page: number): Promise<{
        acciones: Accion[];
        pagina: number;
        cantidad_total_acciones: number;
    }>;
    updateAccion(id: number, infoUpdate: AccionDto): Promise<UpdateResult>;
    filtrarAccion(id_tipo_accion: number | null, descripcion: string | null, nombre_usuario: string | null, fecha_liminf: string | null, fecha_limsup: string | null): Promise<Accion[]>;
}
