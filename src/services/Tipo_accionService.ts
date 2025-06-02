import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { Tipo_accionDto } from "../DTO/Tipo_accionDto";
import { Tipo_accion } from '../entities/Tipo_accion';
export class Tipo_accionService extends BaseService<Tipo_accion> {
   
    constructor(){
        super(Tipo_accion);
    }
	// Tipo_accion para obtener todos los Tipo_accions

    async findAllTipo_accions():Promise<Tipo_accion[]> {
        return (await this.execRepository).find();
    }
    async findTipo_accionById(id_tipo_accion: number): Promise<Tipo_accion | null> {
        return (await this.execRepository).findOneBy({ id_tipo_accion });
      }
    // Tipo_accion para crear un Tipo_accions
 async createTipo_accion(body: Tipo_accionDto): Promise<Tipo_accion>{
        return (await this.execRepository).save(body);
    }

    async deleteTipo_accion(id: number): Promise<DeleteResult>{
        return (await this.execRepository).delete(id);
    }
    // actualizar un Tipo_accions
   async updateTipo_accion(id: number, infoUpdate: Tipo_accionDto): Promise<UpdateResult>{
    return (await this.execRepository).update(id, infoUpdate);
    }
}