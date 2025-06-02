import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { DeudaDto } from "../DTO/DeudaDto";
import { Deuda } from "../entities/Deuda";
import { Pago_Deuda } from '../entities/Pago_Deuda';

export class DeudaService extends BaseService<Deuda> {
   
    constructor(){
        super(Deuda);
    }
	// servicio para obtener todos los Deudas

    async findAllDeudas():Promise<any[]> {
        let deudas:any[]= await (await this.execRepository)
        .createQueryBuilder("d")
        .leftJoinAndSelect("d.pagos_deuda","pago_deuda")
        .leftJoinAndSelect("d.servicio","servicio")
        .leftJoinAndSelect("servicio.cliente","c")
        .leftJoinAndSelect("servicio.tienda","tienda")
        .leftJoinAndSelect("servicio.tipo_servicio","tp")
        .leftJoinAndSelect("servicio.venta","venta")
        .leftJoinAndSelect("venta.producto","p")
        .getMany()

        deudas=deudas.map((deuda:Deuda)=>{
            const total_pagado=deuda.pagos_deuda.reduce((total:number,pago_deuda:Pago_Deuda)=>total+=pago_deuda.pagada,0)
            console.log(total_pagado);
            return{ deuda,
                "total_pagado":(deuda.pagos_deuda.length>0)?total_pagado:0,
                "cantidad_restante":(deuda.pagos_deuda.length>0)?deuda.deuda- total_pagado:deuda.deuda
            }
        })
        return deudas;
        //.find();
    }
    async findDeudaById(id_deuda: number): Promise<any | null> {
        let deuda:Deuda|null=await(await this.execRepository).
        createQueryBuilder("d")
        .leftJoinAndSelect("d.pagos_deuda","pago_deuda")
        .leftJoinAndSelect("d.servicio","servicio")
        .leftJoinAndSelect("servicio.cliente","c")
        .leftJoinAndSelect("servicio.tienda","tienda")
        .leftJoinAndSelect("servicio.tipo_servicio","tp")
        .leftJoinAndSelect("servicio.venta","venta")
        .leftJoinAndSelect("venta.producto","p")
        .where("d.id_deuda=:id_deuda",{id_deuda})
        .getOne()
        if(deuda){
        const total_pagado=deuda.pagos_deuda.reduce((acumulado:number,pago:Pago_Deuda)=>acumulado+=pago.pagada,0)
        return {deuda,
           "total_pagado":(deuda.pagos_deuda.length>0)?total_pagado:0,
                "cantidad_restante":(deuda.pagos_deuda.length>0)?deuda.deuda- total_pagado:deuda.deuda
        }

   }return null; 
        //findOneBy({ id_deuda });
      }
    // servicio para crear un Deudas
 async createDeuda(body: DeudaDto): Promise<Deuda>{
        return (await this.execRepository).save(body);
    }

    async deleteDeuda(id: number): Promise<DeleteResult>{
        return (await this.execRepository).delete(id);
    }
    // actualizar un Deudas
   async updateDeuda(id: number, infoUpdate: DeudaDto): Promise<UpdateResult>{
    return (await this.execRepository).update(id, infoUpdate);
    }

    async filtrarDeuda(nombre_producto:string|null,nombre_cliente:string|null,id_tienda:number|null,fecha_liminf:string|null,fecha_limsup:string|null,deuda_liminf:number|null,deuda_limsup:number|null,saldada:boolean|null,id_tipo_servicio:number|null){
     const normalizeString = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
             let deudas:Deuda[];
             let aux:any[]=[]
             if(fecha_liminf!=null && fecha_limsup==null){
                 deudas=await (await this.execRepository)
                 .createQueryBuilder("d")
                 .leftJoinAndSelect("d.pagos_deuda","pago_deuda")
                 .leftJoinAndSelect("d.servicio","servicio")
                 .leftJoinAndSelect("servicio.cliente","c")
                 .leftJoinAndSelect("servicio.tienda","tienda")
                 .leftJoinAndSelect("servicio.tipo_servicio","tp")
                 .leftJoinAndSelect("servicio.venta","venta")
                 .leftJoinAndSelect("venta.producto","p")
                 .where("servicio.fecha>=:fecha_liminf",{fecha_liminf})
                 .getMany()
             }else if(fecha_limsup!=null&&fecha_liminf==null){
                 deudas=await (await this.execRepository)
                .createQueryBuilder("d")
                .leftJoinAndSelect("d.pagos_deuda","pago_deuda")
                .leftJoinAndSelect("d.servicio","servicio")
                .leftJoinAndSelect("servicio.cliente","c")
                .leftJoinAndSelect("servicio.tienda","tienda")
                .leftJoinAndSelect("servicio.tipo_servicio","tp")
                .leftJoinAndSelect("servicio.venta","venta")
                .leftJoinAndSelect("venta.producto","p")
                .where("servicio.fecha<=:fecha_limsup",{fecha_limsup})
                .getMany()
             }else if(fecha_liminf&& fecha_limsup){
                 deudas=await (await this.execRepository)
                .createQueryBuilder("d")
                .leftJoinAndSelect("d.pagos_deuda","pago_deuda")
                .leftJoinAndSelect("d.servicio","servicio")
                .leftJoinAndSelect("servicio.cliente","c")
                .leftJoinAndSelect("servicio.tienda","tienda")
                .leftJoinAndSelect("servicio.tipo_servicio","tp")
                .leftJoinAndSelect("servicio.venta","venta")
                .leftJoinAndSelect("venta.producto","p")
                .where("servicio.fecha<=:fecha_limsup and servicio.fecha>=:fecha_liminf",{fecha_limsup,fecha_liminf})
                .getMany()
             }else{
                deudas =await(await this.execRepository)
                .createQueryBuilder("d")
                .leftJoinAndSelect("d.pagos_deuda","pago_deuda")
                .leftJoinAndSelect("d.servicio","servicio")
                .leftJoinAndSelect("servicio.cliente","c")
                .leftJoinAndSelect("servicio.tienda","tienda")
                .leftJoinAndSelect("servicio.tipo_servicio","tp")
                .leftJoinAndSelect("servicio.venta","venta")
                .leftJoinAndSelect("venta.producto","p")
                .getMany()
             }
             if(nombre_cliente){
             const normalizedNombre = normalizeString(nombre_cliente);
             deudas= deudas.filter((deuda:Deuda)=>normalizeString(deuda.servicio.cliente.nombre).toLowerCase().includes(normalizedNombre))    
             }
             if(deuda_liminf){
                 deudas=deudas.filter((deuda:Deuda)=>deuda.deuda>=deuda_liminf);
             }
             if(deuda_limsup){
                 deudas=deudas.filter((deuda:Deuda)=>deuda.deuda<=deuda_limsup);
             }
             if(nombre_producto){
                 let auxiliar:Deuda[]=[];
                 const normalizedNombre = normalizeString(nombre_producto);
                 deudas.forEach((deuda:Deuda)=>{
                     const{venta}=deuda.servicio;
                     if(venta!=null){
                         if(normalizeString(venta.producto.nombre).toLowerCase().includes(normalizedNombre)){
                             auxiliar.push(deuda);
                         }
     
                     }
                 })
                 deudas=auxiliar;
             }
             if(id_tienda){
                 deudas=deudas.filter((deuda:Deuda)=>deuda.servicio.tienda.id_tienda==id_tienda)
             }
             if(id_tipo_servicio){
                deudas=deudas.filter((deuda:Deuda)=>deuda.servicio.tipo_servicio.id_tipo_servicio==id_tipo_servicio)
             }
             aux=deudas.map((deuda)=>{return{
                deuda,
                "total_pagado":(deuda.pagos_deuda.length>0)?deuda.pagos_deuda.reduce((acumulado:number,pago:Pago_Deuda)=>acumulado+=pago.pagada,0):0
                ,"cantidad_restante":(deuda.pagos_deuda.length>0)?deuda.deuda-deuda.pagos_deuda.reduce((acumulado:number,pago:Pago_Deuda)=>acumulado+=pago.pagada,0):deuda.deuda
            }
             })
             if(saldada!=null){
               aux= (saldada)?aux.filter((deuda)=>deuda.cantidad_restante==0):aux.filter((deuda)=>deuda.cantidad_restante!=0)
             }
             return aux;
    }
}
