import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { SalidaDto } from "../DTO/SalidaDto";
import { Salida } from "../entities/Salida";
export declare class SalidaService extends BaseService<Salida> {
    constructor();
    findAllSalidas(): Promise<Salida[]>;
    findSalidaById(id_salida: number): Promise<Salida | null>;
    createSalida(body: SalidaDto): Promise<Salida>;
    getSalidasPaginated(page: number): Promise<{
        salidas: Salida[];
        pagina: number;
        cantidad_total_salidas: number;
    }>;
    deleteSalida(id: number): Promise<DeleteResult>;
    updateSalida(id: number, infoUpdate: SalidaDto): Promise<UpdateResult>;
    filtrarSalida(nombre_usuario: string | null, nombre_producto: string | null, cantidad: number | null, fechaliminf: Date | null, fechalimsup: Date | null, id_tienda_origen: number | null, id_tienda_destino: number | null): Promise<Salida[]>;
    filtrarSalidasJT(nombre_usuario: string | null, nombre_producto: string | null, cantidad: number | null, fechaliminf: string | null, fechalimsup: string, id_tienda: number, id_tienda_origen: number | null, id_tienda_destino: number | null): Promise<Salida[]>;
}
