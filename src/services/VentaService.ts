import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { VentaDto } from "../DTO/VentaDto";
import { Venta } from '../entities/Venta';
import { Producto } from "../entities/Producto";
import { Servicio } from "../entities/Servicio";
/*ACUERDATE DE MANIPULAR GET BY ID AND DELETE BY ID*/ 
export class VentaService extends BaseService<Venta> {
   
    constructor(){
        super(Venta);
    }
	// Venta para obtener todos los Ventas

    async findAllVentas():Promise<Venta[]> {
        return (await this.execRepository).find({relations:["producto","servicio"]});
    }
    async findVentaById(id_producto: number,id_servicio:number): Promise<Venta | null> {
        return (await this.execRepository)
        .createQueryBuilder("Venta")
        .where('id_producto = :id_producto and id_servicio = :id_servicio', { id_producto, id_servicio})
        .leftJoinAndSelect("Venta.producto","p")
        .leftJoinAndSelect("Venta.servicio","s")
        .getOne();
      }
    // Venta para crear un Ventas
 async createVenta(body: VentaDto): Promise<Venta>{
        return (await this.execRepository).save(body);
    }

    async deleteVenta(id_producto: number,id_servicio:number): Promise<void>{
        (await this.execRepository)
        .createQueryBuilder("Venta")
        .delete()
        .where('id_producto = :id_producto and id_servicio = :id_servicio', { id_producto,id_servicio})
        .execute();
      console.log('Elemento eliminado correctamente.');
    }
    // actualizar un Ventas
    async updateVenta(id_producto: number, id_servicio: number, infoUpdate: VentaDto): Promise<UpdateResult> {
        return (await this.execRepository)
            .createQueryBuilder("Venta")
            .update(Venta)
            .set(infoUpdate)
            .where('id_producto = :id_producto and id_servicio = :id_servicio', { id_producto, id_servicio })
            .execute();
    }
    //Cantidad_ventasPorProducto
    async Cantidad_ventasPorProducto(id_producto: number): Promise<number> {
        let ventas: Venta[] = await (await this.execRepository)
            .createQueryBuilder("Venta")
            .where("id_producto = :id_producto", { id_producto })
            .getMany();
    
        let cantidad_ventas: number = 0;
        cantidad_ventas = ventas.reduce((acumulador: number, venta: Venta) => acumulador + venta.cantidad, 0);
    
        return cantidad_ventas;
    }
    async Producto_masVendido() {
        let ventas: Venta[] = await (await this.execRepository).find();
        let productoCantidadMap: { [key: number]: number } = {};
    
        for (let venta of ventas) {
            if (!productoCantidadMap[venta.id_producto]) {
                productoCantidadMap[venta.id_producto] = 0;
            }
            productoCantidadMap[venta.id_producto] += venta.cantidad;
        }
    
        let listaProducto_cantidad = Object.keys(productoCantidadMap).map(id_producto => ({
            id_producto: Number(id_producto), // Aseguramos que id_producto sea un número
            cantidad_ventas: productoCantidadMap[Number(id_producto)] // Convertimos id_producto a número
        }));
    
        listaProducto_cantidad.sort((a, b) => b.cantidad_ventas - a.cantidad_ventas);
    
        return listaProducto_cantidad;
    }

    async Producto_masVendidoEntreRangosDeFecha(fecha_liminf:Date,fecha_limsup:Date) {
        let ventas: any[] = await (await this.execRepository)
        .createQueryBuilder("Venta")
        .innerJoinAndSelect("Venta.servicio","servicio")
        .where("servicio.fecha >= :fecha_liminf AND servicio.fecha<= :fecha_limsup",{fecha_liminf,fecha_limsup})
        .getMany();
        let productoCantidadMap: { [key: number]: number } = {};
    
        for (let venta of ventas) {
            if (!productoCantidadMap[venta.id_producto]) {
                productoCantidadMap[venta.id_producto] = 0;
            }
            productoCantidadMap[venta.id_producto] += venta.cantidad;
        }
    
        let listaProducto_cantidad = Object.keys(productoCantidadMap).map(id_producto => ({
            id_producto: Number(id_producto), // Aseguramos que id_producto sea un número
            cantidad_ventas: productoCantidadMap[Number(id_producto)] // Convertimos id_producto a número
        }));
    
        listaProducto_cantidad.sort((a, b) => b.cantidad_ventas - a.cantidad_ventas);
    
        return listaProducto_cantidad;
    }

    async findbyId_producto(id_producto:number){
        return (await this.execRepository)
        .createQueryBuilder("venta")
        .leftJoinAndSelect("venta.producto","p")
        .leftJoinAndSelect("venta.servicio","s")
        .where("venta.id_producto=:id_producto",{id_producto})
        .getMany()
    }
    async findbyId_servicio(id_servicio:number){
        return (await this.execRepository)
        .createQueryBuilder("venta")
        .leftJoinAndSelect("venta.producto","p")
        .leftJoinAndSelect("venta.servicio","s")
        .where("venta.id_servicio=:id_servicio",{id_servicio})
        .getOne()
    }
    }
    
