import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { TiendaDto } from "../DTO/TiendaDto";
import { Tienda } from "../entities/Tienda";
export class TiendaService extends BaseService<Tienda> {
   
    constructor(){
        super(Tienda);
    }
	// Tienda para obtener todos los Tiendas

    async findAllTiendas():Promise<Tienda[]> {
        return (await this.execRepository).find();
    }
    async findTiendaById(id_tienda: number): Promise<Tienda | null> {
        return (await this.execRepository).findOneBy({ id_tienda });
      }
    // Tienda para crear un Tiendas
 async createTienda(body: TiendaDto): Promise<Tienda>{
        return (await this.execRepository).save(body);
    }

    async deleteTienda(id: number): Promise<DeleteResult>{
        return (await this.execRepository).delete(id);
    }
    // actualizar un Tiendas
   async updateTienda(id: number, infoUpdate: TiendaDto): Promise<UpdateResult>{
    return (await this.execRepository).update(id, infoUpdate);
    }

    async getServiciosbyTienda(id_tienda:number){
        console.log(id_tienda)
      return  (await this.execRepository)
      .createQueryBuilder("Tienda")
      .leftJoinAndSelect("Tienda.servicios","servicio")
      .where("Tienda.id_tienda=:id_tienda",{id_tienda})
      .getMany();
    }
    async NoTiendasUsuario(id_usuario:number){
        return (await this.execRepository)
        .createQueryBuilder("Tienda")
        .leftJoinAndSelect("Tienda.usuarios","usuarios")
        .where("usuarios.id_usuario!=:id_usuario or usuarios.id_usuario ISNULL",{id_usuario})
        .getMany();
    }
}