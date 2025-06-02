import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { EntradaDto } from "../DTO/EntradaDto";
import { Entrada } from "../entities/Entrada";
export declare class EntradaService extends BaseService<Entrada> {
    constructor();
    findAllEntradas(): Promise<Entrada[]>;
    findEntradaById(id_entrada: number): Promise<Entrada | null>;
    createEntrada(body: EntradaDto): Promise<Entrada>;
    deleteEntrada(id: number): Promise<DeleteResult>;
    updateEntrada(id: number, infoUpdate: EntradaDto): Promise<UpdateResult>;
    filtrarEntradasConPaginacion(nombre_proveedor: string | null, nombre_producto: string | null, costo_liminf: number | null, costo_limsup: number | null, fecha_liminf: Date | null, fecha_limsup: Date | null, limite: number, pagina: number): Promise<Entrada[]>;
    getEntradasPaginated(page: number): Promise<{
        entradas: Entrada[];
        pagina: number;
        cantidad_total_entradas: number;
    }>;
    getAllEntradasbyProveedor(id_proveedor: number): Promise<Entrada[]>;
    filtrarEntradas(nombre_proveedor: string | null, nombre_producto: string | null, costoliminf: number | null, costolimsup: number | null, fechaliminf: Date | null, fechalimsup: Date | null): Promise<Entrada[]>;
    EntradasbyProducto(id_producto: number): Promise<Entrada[]>;
    getEntradasPorVencimiento(fecha: string): Promise<Entrada[]>;
}
