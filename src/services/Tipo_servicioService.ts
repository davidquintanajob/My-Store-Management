import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { Tipo_servicioDto } from "../DTO/Tipo_servicioDto";
import { Tipo_servicio } from '../entities/Tipo_servicio';
export class Tipo_servicioService extends BaseService<Tipo_servicio> {
   
    constructor(){
        super(Tipo_servicio);
    }
	// Tipo_servicio para obtener todos los Tipo_servicios

    async findAllTipo_servicios():Promise<Tipo_servicio[]> {
        return (await this.execRepository).find();
    }
    async findTipo_servicioById(id_tipo_servicio: number): Promise<Tipo_servicio | null> {
        return (await this.execRepository).findOneBy({ id_tipo_servicio });
      }
    // Tipo_servicio para crear un Tipo_servicios
 async createTipo_servicio(body: Tipo_servicioDto): Promise<Tipo_servicio>{
        return (await this.execRepository).save(body);
    }

    async deleteTipo_servicio(id: number): Promise<DeleteResult>{
        return (await this.execRepository).delete(id);
    }
    // actualizar un Tipo_servicios
   async updateTipo_servicio(id: number, infoUpdate: Tipo_servicioDto): Promise<UpdateResult>{
    return (await this.execRepository).update(id, infoUpdate);
    }
    async filtrarTipo_servicio(nombre:string|null,costo_liminf:number|null,costo_limsup:number|null){
        let tipo_servicios:Tipo_servicio[]=await(await this.execRepository)
        .createQueryBuilder("tp")
        .getMany()
        const normalizeString = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        if(nombre){
            const normalizedNombre = normalizeString(nombre);
                tipo_servicios= tipo_servicios.filter((tp:Tipo_servicio)=>normalizeString(tp.nombre).toLowerCase().includes(normalizedNombre))    
        }
        if(costo_liminf){
            tipo_servicios=tipo_servicios.filter((tp:Tipo_servicio)=>tp.costo>=costo_liminf)
        }
        if(costo_limsup){
            tipo_servicios=tipo_servicios.filter((tp:Tipo_servicio)=>tp.costo>=costo_limsup)
        }
        return tipo_servicios;
    }
}