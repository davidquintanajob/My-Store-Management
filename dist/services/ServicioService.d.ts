import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { ServicioDto } from "../DTO/ServicioDto";
import { Servicio } from "../entities/Servicio";
export declare class ServicioService extends BaseService<Servicio> {
    constructor();
    findAllServicios(): Promise<Servicio[]>;
    findServicioById(id_servicio: number): Promise<Servicio | null>;
    createServicio(body: ServicioDto): Promise<Servicio>;
    deleteServicio(id: number): Promise<DeleteResult>;
    updateServicio(id: number, infoUpdate: ServicioDto): Promise<UpdateResult>;
    GananciaTotalServicio(): Promise<number>;
    getServiciosPaginated(page: number): Promise<{
        servicios: Servicio[];
        pagina: number;
        cantidad_total_servicios: number;
    }>;
    getServiciosbyTipo_servicio(id_tipo_servicio: number): Promise<Servicio[]>;
    filtrarServicio(nombre_cliente: string | null, precio_liminf: number | null, precio_limsup: number | null, fecha_liminf: Date | null, fecha_limsup: Date | null, id_tipo_servicio: number | null, id_tienda: number | null, nombre_producto: string | null): Promise<Servicio[]>;
    filtrarServicioJT(nombre_cliente: string | null, precio_liminf: number | null, precio_limsup: number | null, fecha_liminf: Date | null, fecha_limsup: Date | null, id_tipo_servicio: number, id_tienda: number | null): Promise<Servicio[]>;
}
