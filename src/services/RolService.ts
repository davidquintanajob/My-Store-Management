import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { RolDto } from "../DTO/RolDto";
import { Rol } from "../entities/Rol";
export class RolService extends BaseService<Rol> {
   
    constructor(){
        super(Rol);
    }
	// servicio para obtener todos los Rols

    async findAllRoles():Promise<Rol[]> {
        return (await this.execRepository).find({relations:["permisos"]});
    }
    async findRolById(id_rol: number): Promise<Rol | null> {
        return (await this.execRepository).findOneBy({ id_rol });
      }
    // servicio para crear un Rols
 async createRol(body: RolDto): Promise<Rol>{
        return (await this.execRepository).save(body);
    }

    async deleteRol(id: number): Promise<DeleteResult>{
        return (await this.execRepository).delete(id);
    }
    // actualizar un Rols
   async updateRol(id: number, infoUpdate: RolDto): Promise<UpdateResult>{
    return (await this.execRepository).update(id, infoUpdate);
    }
    async getPermisos(id_rol:number){
        return (await this.execRepository)
        .createQueryBuilder("Rol")
        .leftJoinAndSelect("Rol.permisos","Permiso")
        .where("Rol.id_rol=:id_rol",{id_rol})
        .getOne()
    }
}