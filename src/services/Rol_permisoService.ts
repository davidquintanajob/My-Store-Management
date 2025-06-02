import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { Rol_permisoDto } from "../DTO/Rol_permisoDto";
import { Rol_permiso } from "../entities/Rol_permiso";
/*ACUERDATE DE MANIPULAR GET BY ID AND DELETE BY ID*/ 
export class Rol_permisoService extends BaseService<Rol_permiso> {
   
    constructor(){
        super(Rol_permiso);
    }
	// servicio para obtener todos los Rol_permisos

    async findAllRol_permiso():Promise<Rol_permiso[]> {
        return (await this.execRepository).find();
    }
    async findRol_permisoById(id_rol: number,id_permiso:number): Promise<Rol_permiso | null> {
       // return (await this.execRepository).findOneBy({ id_rol });
       return(await this.execRepository)
       .createQueryBuilder("Rol_permiso")
       .where('id_rol = :id_rol and id_permiso = :id_permiso', { id_rol,id_permiso})
       .getOne();
      }
    // servicio para crear un Rol_permisos
 async createRol_permiso(body: Rol_permisoDto): Promise<Rol_permiso>{
        return (await this.execRepository).save(body);
    }

    async deleteRol_permiso(id_rol: number, id_permiso:number): Promise<void>{
        (await this.execRepository)
        .createQueryBuilder("Rol_permiso")
        .delete()
        .where('id_rol = :id_rol and id_permiso = :id_permiso', { id_rol,id_permiso})
        .execute();
      console.log('Elemento eliminado correctamente.');
  
    }
    // actualizar un Rol_permisos
   async updateRol_permiso(id_rol: number,id_permiso:number, infoUpdate: Rol_permisoDto): Promise<UpdateResult>{
    return (await this.execRepository)
    .createQueryBuilder("Rol_permiso")
    .update(Rol_permiso)
    .set(infoUpdate)
    .where('id_rol = :id_rol and id_permiso = :id_permiso', { id_rol, id_permiso })
    .execute();
}
async getPermisosbyRolid(id_rol:number):Promise<Rol_permiso[]>{
    return (await this.execRepository)
    .createQueryBuilder("Rol_permiso")
    .where("id_rol=:id_rol",{id_rol})
    .getMany()
}

}