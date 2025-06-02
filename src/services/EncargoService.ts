import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { EncargoDto } from "../DTO/EncargoDto";
import { Encargo } from '../entities/Encargo';

export class EncargoService extends BaseService<Encargo> {
   
    constructor(){
        super(Encargo);
    }
	// servicio para obtener todos los Encargos

    async findAllEncargos():Promise<Encargo[]> {
        return (await this.execRepository).find();
    }
    async findEncargoById(id_encargo: number): Promise<Encargo | null> {
        return (await this.execRepository).findOneBy({ id_encargo });
      }
    // servicio para crear un Encargos
 async createEncargo(body: EncargoDto): Promise<Encargo>{
        return (await this.execRepository).save(body);
    }

    async deleteEncargo(id: number): Promise<DeleteResult>{
        return (await this.execRepository).delete(id);
    }
    // actualizar un Encargos
   async updateEncargo(id: number, infoUpdate: EncargoDto): Promise<UpdateResult>{
    return (await this.execRepository).update(id, infoUpdate);
    }
}
