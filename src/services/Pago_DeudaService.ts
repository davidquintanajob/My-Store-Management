import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { Pago_DeudaDto } from "../DTO/Pago_deudaDto";
import { Pago_Deuda } from "../entities/Pago_Deuda";

export class Pago_DeudaService extends BaseService<Pago_Deuda> {
   
    constructor(){
        super(Pago_Deuda);
    }
	// servicio para obtener todos los Pago_Deudas

    async findAllPago_Deuda():Promise<Pago_Deuda[]> {
        return (await this.execRepository).find();
    }
    async findPago_DeudaById(id_pago_deuda: number): Promise<Pago_Deuda | null> {
        return (await this.execRepository).findOneBy({ id_pago_deuda });
      }
    // servicio para crear un Pago_Deudas
 async createPago_Deuda(body: Pago_DeudaDto): Promise<Pago_Deuda>{
        return (await this.execRepository).save(body);
    }

    async deletePago_Deuda(id: number): Promise<DeleteResult>{
        return (await this.execRepository).delete(id);
    }
    // actualizar un Pago_Deudas
   async updatePago_Deuda(id: number, infoUpdate: Pago_DeudaDto): Promise<UpdateResult>{
    return (await this.execRepository).update(id, infoUpdate);
    }
}