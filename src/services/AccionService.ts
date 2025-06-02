import { DeleteResult,UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { AccionDto } from "../DTO/AccionDto";
import { Accion } from "../entities/Accion";


export class AccionService extends BaseService<Accion> {
   
    constructor(){
        super(Accion);
    }
	// servicio para obtener todos los Acciones

    async findAllAcciones():Promise<Accion[]> {
        return await(await this.execRepository)
        .createQueryBuilder("Accion")
        .leftJoinAndSelect("Accion.usuario","u")
        .leftJoinAndSelect("Accion.tipo_accion","ta")
        .getMany()
        //.find({relations:["tipo_accion","usuario"]});
    }
    async findAccionById(id_accion: number): Promise<Accion | null> {
        return (await this.execRepository)
        .createQueryBuilder("Accion")
        .leftJoinAndSelect("Accion.tipo_accion","ta")
        .leftJoinAndSelect("Accion.usuario","u")
        .where("Accion.id_accion=:id_accion",{id_accion})
        .getOne()
        //.findOneBy({ id_accion });
      }
    // servicio para crear un Acciones
 async createAccion(body: AccionDto): Promise<Accion>{
        return (await this.execRepository).save(body);
    }

    async deleteAccion(id: number): Promise<DeleteResult>{
        return (await this.execRepository).delete(id);
    }
    async getAccionesPaginated(page: number) {
        const limite = 20;
        const offset = (page - 1) * limite;
    
        const acciones = await (await this.execRepository)
          .createQueryBuilder("a")
          .leftJoinAndSelect("a.usuario", "u")
          .leftJoinAndSelect("a.tipo_accion", "ta")
          .take(limite)
          .skip(offset)
          .getMany();
    
        const cantidad_total_acciones = await (await this.execRepository)
          .createQueryBuilder("a")
          .getCount();
    
        return { "acciones": acciones, "pagina": page, "cantidad_total_acciones": cantidad_total_acciones };
      }
    // actualizar un Acciones
   async updateAccion(id: number, infoUpdate: AccionDto): Promise<UpdateResult>{
    return (await this.execRepository).update(id, infoUpdate);
    }
    async filtrarAccion(id_tipo_accion:number|null,descripcion:string|null,nombre_usuario:string|null,fecha_liminf:string|null,fecha_limsup:string|null){
        let acciones:Accion[]=[]
        const normalizeString = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        if(fecha_liminf&&fecha_limsup==null){
            acciones=await(await this.execRepository)
            .createQueryBuilder("accion")
            .leftJoinAndSelect("accion.tipo_accion","ta")
            .leftJoinAndSelect("accion.usuario","u")
            .where("accion.fecha>=:fecha_liminf",{fecha_liminf})
            .getMany()
        }else if(fecha_limsup&&fecha_liminf==null){
            acciones=await(await this.execRepository)
            .createQueryBuilder("accion")
            .leftJoinAndSelect("accion.tipo_accion","ta")
            .leftJoinAndSelect("accion.usuario","u")
            .where("accion.fecha<=:fecha_limsup",{fecha_limsup})
            .getMany()
        }else if(fecha_liminf &&fecha_limsup){
            acciones=await(await this.execRepository)
            .createQueryBuilder("accion")
            .leftJoinAndSelect("accion.tipo_accion","ta")
            .leftJoinAndSelect("accion.usuario","u")
            .where("accion.fecha<=:fecha_limsup and accion.fecha>=:fecha_liminf",{fecha_limsup,fecha_liminf})
            .getMany()
        }
        else{
        acciones=await(await this.execRepository)
        .createQueryBuilder("accion")
        .leftJoinAndSelect("accion.tipo_accion","ta")
        .leftJoinAndSelect("accion.usuario","u")
        .getMany()
    }
       /* const normalizeDate=(fecha:string):Date=>{
        console.log(fecha)
        console.log(new Date(fecha))
        return (new Date(fecha));
        }*/
        if(id_tipo_accion){
            acciones=acciones.filter((acc)=>acc.tipo_accion.id_tipo_accion===id_tipo_accion);
        }
        if(descripcion){
            const normalizedDescripcion=  normalizeString(descripcion);
            acciones=acciones.filter((acc:Accion)=>normalizeString(acc.descripcion).includes(normalizedDescripcion));
        }
        if(nombre_usuario){
            const normalizedNombre_usuario=  normalizeString(nombre_usuario);
            acciones=acciones.filter((acc:Accion)=>normalizeString(acc.usuario.nombre_usuario).includes(normalizedNombre_usuario));
        }
       /* if(fecha_liminf){
            acciones=acciones.filter((acc:Accion)=>acc.fecha>=normalizeDate(fecha_liminf))
        }
        if(fecha_limsup){
            acciones=acciones.filter((acc:Accion)=>{
                console.log(`${acc.fecha}<=${normalizeDate(fecha_limsup)}---->acc.fecha<=normalizeDate(fecha_limsup)`)
                return acc.fecha<=normalizeDate(fecha_limsup)})
            
        }*/
        return acciones;
    }
}


