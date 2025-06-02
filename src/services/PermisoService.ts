import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { PermisoDto } from "../DTO/PermisoDto";
import { Permiso } from "../entities/Permiso";

export class PermisoService extends BaseService<Permiso> {
   
    constructor(){
        super(Permiso);
    }
	// servicio para obtener todos los Permisos

    async findAllPermiso():Promise<Permiso[]> {
        return (await this.execRepository).find();
    }
    async findPermisoById(id_permiso: number): Promise<Permiso | null> {
        return (await this.execRepository).findOneBy({ id_permiso });
      }
    // servicio para crear un Permisos
 async createPermiso(body: PermisoDto): Promise<Permiso>{
        return (await this.execRepository).save(body);
    }

    async deletePermiso(id: number): Promise<DeleteResult>{
        return (await this.execRepository).delete(id);
    }
    // actualizar un Permisos
   async updatePermiso(id: number, infoUpdate: PermisoDto): Promise<UpdateResult>{
    return (await this.execRepository).update(id, infoUpdate);
    }
}