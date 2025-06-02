import { DeleteResult, UpdateResult, createQueryBuilder } from 'typeorm';
import { BaseService } from "../config/base.service";
import { GarantiaDto } from "../DTO/GarantiaDto";
import { Garantia } from "../entities/Garantia";

export class GarantiaService extends BaseService<Garantia> {
   
    constructor(){
        super(Garantia);
    }
	// servicio para obtener todos los Garantias

    async findAllGarantia():Promise<Garantia[]> {
        return (await this.execRepository)
        .createQueryBuilder("garantia")
        .leftJoinAndSelect("garantia.servicio","servicio")
        .leftJoinAndSelect("servicio.cliente","c")
        .leftJoinAndSelect("servicio.tienda","tienda")
        .leftJoinAndSelect("servicio.tipo_servicio","tp")
        .leftJoinAndSelect("servicio.venta","venta")
        .leftJoinAndSelect("venta.producto","p")
        .getMany()
        //.find();
    }
    async findGarantiaById(id_garantia: number): Promise<Garantia | null> {
        console.log(id_garantia);
        return (await this.execRepository)
        .createQueryBuilder("garantia")
        .leftJoinAndSelect("garantia.servicio","servicio")
        .leftJoinAndSelect("servicio.cliente","c")
        .leftJoinAndSelect("servicio.tienda","tienda")
        .leftJoinAndSelect("servicio.tipo_servicio","tp")
        .leftJoinAndSelect("servicio.venta","venta")
        .leftJoinAndSelect("venta.producto","p")
        .where("garantia.id_garantia=:id_garantia",{id_garantia})
        .getOne();
      }
    // servicio para crear un Garantias
 async createGarantia(body: GarantiaDto): Promise<Garantia>{
        return (await this.execRepository).save(body);
    }

    async deleteGarantia(id: number): Promise<DeleteResult>{
        return (await this.execRepository).delete(id);
    }
    // actualizar un Garantias
   async updateGarantia(id: number, infoUpdate: GarantiaDto): Promise<UpdateResult>{
    return (await this.execRepository).update(id, infoUpdate);
    }
    async filtrarGarantias(nombre_cliente:string|null,fecha_liminf:string|null,fecha_limsup:string|null,nombre_producto:string|null,duracion_liminf:number|null,duracion_limsup:number|null,id_tienda:number|null){
        const normalizeString = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        let garantias:Garantia[];
        if(fecha_liminf!=null && fecha_limsup==null){
            garantias=await (await this.execRepository)
            .createQueryBuilder("garantia")
            .leftJoinAndSelect("garantia.servicio","servicio")
            .leftJoinAndSelect("servicio.cliente","c")
            .leftJoinAndSelect("servicio.tienda","tienda")
            .leftJoinAndSelect("servicio.venta","venta")
            .leftJoinAndSelect("venta.producto","p")
            .leftJoinAndSelect("servicio.tipo_servicio","tp")
            .where("servicio.fecha>=:fecha_liminf",{fecha_liminf})
            .getMany()
        }else if(fecha_limsup!=null&&fecha_liminf==null){
            garantias=await (await this.execRepository)
            .createQueryBuilder("garantia")
            .leftJoinAndSelect("garantia.servicio","servicio")
            .leftJoinAndSelect("servicio.cliente","c")
            .leftJoinAndSelect("servicio.tienda","tienda")
            .leftJoinAndSelect("servicio.venta","venta")
            .leftJoinAndSelect("venta.producto","p")
            .leftJoinAndSelect("servicio.tipo_servicio","tp")
            .where("servicio.fecha<=:fecha_limsup",{fecha_limsup})
            .getMany()
        }else if(fecha_liminf&& fecha_limsup){
            garantias=await (await this.execRepository)
            .createQueryBuilder("garantia")
            .leftJoinAndSelect("garantia.servicio","servicio")
            .leftJoinAndSelect("servicio.cliente","c")
            .leftJoinAndSelect("servicio.tienda","tienda")
            .leftJoinAndSelect("servicio.venta","venta")
            .leftJoinAndSelect("servicio.tipo_servicio","tp")
            .leftJoinAndSelect("venta.producto","p")
            .where("servicio.fecha<=:fecha_limsup and servicio.fecha>=:fecha_liminf",{fecha_limsup,fecha_liminf})
            .getMany()
        }else{
           garantias =await(await this.execRepository)
        .createQueryBuilder("garantia")
        .leftJoinAndSelect("garantia.servicio","servicio")
        .leftJoinAndSelect("servicio.cliente","c")
        .leftJoinAndSelect("servicio.venta","venta")
        .leftJoinAndSelect("servicio.tienda","tienda")
        .leftJoinAndSelect("servicio.tipo_servicio","tp")
        .leftJoinAndSelect("venta.producto","p")
        .getMany()
        }
        if(nombre_cliente){
        const normalizedNombre = normalizeString(nombre_cliente);
        garantias= garantias.filter((garantia:Garantia)=>normalizeString(garantia.servicio.cliente.nombre).toLowerCase().includes(normalizedNombre))    
        }
        if(duracion_liminf){
            garantias=garantias.filter((garantia:Garantia)=>garantia.duracion>=duracion_liminf);
        }
        if(duracion_limsup){
            garantias=garantias.filter((garantia:Garantia)=>garantia.duracion<=duracion_limsup);
        }
        if(nombre_producto){
            let auxiliar:Garantia[]=[];
            const normalizedNombre = normalizeString(nombre_producto);
            garantias.forEach((garantia:Garantia)=>{
                const{venta}=garantia.servicio;
                if(venta!=null){
                    if(normalizeString(venta.producto.nombre).toLowerCase().includes(normalizedNombre)){
                        auxiliar.push(garantia);
                    }

                }
            })
            garantias=auxiliar;
        }
        if(id_tienda){
            garantias=garantias.filter((garantia:Garantia)=>garantia.servicio.tienda.id_tienda==id_tienda)
        }
        return garantias;
    }
}
