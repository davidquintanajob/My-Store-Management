import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { Producto_tiendaDto } from "../DTO/Producto_tiendaDto";
import { Producto_tienda } from '../entities/Producto_tienda';
import * as XLSX from 'xlsx';

/*ACUERDATE DE MANIPULAR GET BY ID AND DELETE BY ID*/ 
export class Producto_tiendaService extends BaseService<Producto_tienda> {
   
    constructor(){
        super(Producto_tienda);
    }
	// servicio para obtener todos los Producto_tiendas

    async findAllProducto_tienda():Promise<Producto_tienda[]> {
        return (await this.execRepository).find();
    }
    async findProducto_tiendaById(id_producto: number, id_tienda:number): Promise<Producto_tienda | null> {
       // return (await this.execRepository).findOneBy({ id_producto });
       return (await this.execRepository)
       .createQueryBuilder("Producto_tienda")
       .where('id_producto = :id_producto and id_tienda = :id_tienda', { id_producto, id_tienda})
       .getOne();
      }
    // servicio para crear un Producto_tiendas
 async createProducto_tienda(body: Producto_tiendaDto): Promise<Producto_tienda>{
        return (await this.execRepository).save(body);
    }

    async deleteProducto_tienda(id_producto: number,id_tienda: number): Promise<void>{
        (await this.execRepository)
            .createQueryBuilder("Producto_tienda")
            .delete()
            .where('id_producto = :id_producto and id_tienda = :id_tienda', { id_producto,id_tienda})
            .execute();
          console.log('Elemento eliminado correctamente.');
      
          }
    // actualizar un Producto_tiendas
   async updateProducto_tienda(id_producto: number,id_tienda:number, infoUpdate: Producto_tiendaDto): Promise<UpdateResult>{
    return (await this.execRepository)
    .createQueryBuilder("Producto_tienda")
    .update(Producto_tienda)
    .set(infoUpdate)
    .where('id_producto = :id_producto and id_tienda = :id_tienda', { id_producto, id_tienda })
    .execute();
    }
    async moverProducto(id_producto:number,id_tienda_Origen:number,id_tienda_destino:number,cantidad:number):Promise<void>{
        const productoTiendaOrigen = await(await this.execRepository)
        .createQueryBuilder("Producto_tienda")
        .where('id_producto = :id_producto and id_tienda = :id_tienda_Origen', { id_producto, id_tienda_Origen})
        .getOne();
        const productoTiendaDestino=await(await this.execRepository)
        .createQueryBuilder("Producto_tienda")
        .where('id_producto = :id_producto and id_tienda = :id_tienda_destino', { id_producto, id_tienda_destino})
        .getOne();
        productoTiendaOrigen!.cantidad-=cantidad;

        console.log(id_producto,id_tienda_Origen,id_tienda_destino,cantidad);
        console.log(productoTiendaOrigen);
        console.log(productoTiendaDestino);
        
        

        if(productoTiendaDestino){
            productoTiendaDestino.cantidad+=cantidad;
            const nuevoProductoTiendaOrigen:any ={
                id_producto:productoTiendaOrigen!.id_producto,
                id_tienda:productoTiendaOrigen!.id_tienda,
                cantidad:productoTiendaOrigen!.cantidad,
                };
                const nuevoProductoTiendaDestino:any ={
                    id_producto:productoTiendaDestino.id_producto,
                    id_tienda:productoTiendaDestino.id_tienda,
                    cantidad:productoTiendaDestino.cantidad,
                    };
                (await this.execRepository).save(nuevoProductoTiendaOrigen);
                (await this.execRepository).save(nuevoProductoTiendaDestino);
            }else{
                const nuevoProductoTiendaDestino:any ={
                    id_producto:id_producto,
                    id_tienda:id_tienda_destino,
                    cantidad:cantidad,
                    };
                    const nuevoProductoTiendaOrigen:any ={
                        id_producto:productoTiendaOrigen!.id_producto,
                        id_tienda:productoTiendaOrigen!.id_tienda,
                        cantidad:productoTiendaOrigen!.cantidad,
                        };
                    (await this.execRepository).save(nuevoProductoTiendaOrigen);
                    (await this.execRepository).save(nuevoProductoTiendaDestino)
                    
            }
        }
        async cantidadTotalProductos(id_producto:number):Promise<number>{

         const producto_tienda=((await this.execRepository)
         .createQueryBuilder("Producto_tienda")
         .where("id_producto = :id_producto",{id_producto}))
         .getMany() 
        const cantidadtotal= (await producto_tienda).reduce((acumulador:number,valor:Producto_tienda)=>acumulador+valor.cantidad,0)
        console.log(cantidadtotal)
        return cantidadtotal;
        }
         async realizarVenta(id_producto:number,id_tienda:number ,cantidad:number){
            let producto_tienda_venta:Producto_tienda|null=await (await this.execRepository)
            .createQueryBuilder("pt")
            .where("pt.id_tienda=:id_tienda and pt.id_producto=:id_producto",{id_tienda,id_producto})
            .getOne();
            if(producto_tienda_venta){
                producto_tienda_venta!.cantidad-=cantidad
                const nuevoProducto_tienda:any={
                    id_tienda:id_tienda,
                    id_producto:id_producto,
                    cantidad:producto_tienda_venta?.cantidad
                };
                return (await this.execRepository).save(nuevoProducto_tienda)

            }
            return null;

        }
        async getProductosTienda(id_tienda:number){
            return (await this.execRepository)
            .createQueryBuilder("Producto_tienda")
            .leftJoinAndSelect("Producto_tienda.tienda","t")
            .leftJoinAndSelect("Producto_tienda.producto","p")
            .where("Producto_tienda.id_tienda=:id_tienda",{id_tienda})
            .getMany()
        }
        async getTiendasbyProducto(id_producto:number){
            return (await this.execRepository)
            .createQueryBuilder("Producto_tienda")
            .leftJoinAndSelect("Producto_tienda.tienda","t")
            .leftJoinAndSelect("Producto_tienda.producto","p")
            .where("Producto_tienda.id_producto=:id_producto",{id_producto})
            .getMany()
        }
        async filtrarPorCantidad (cantidad_entrada:number){
            let productos:Producto_tienda[]=await(await this.execRepository).find();
            let productoCantidadMap: { [key: number]: number } = {};
    
        for (let porducto of productos) {
            if (!productoCantidadMap[porducto.id_producto]) {
                productoCantidadMap[porducto.id_producto] = 0;
            }
            productoCantidadMap[porducto.id_producto] += porducto.cantidad;
        }
    
        let listaProducto_cantidad = Object.keys(productoCantidadMap).map(id_producto => ({
            id_producto: Number(id_producto), // Aseguramos que id_producto sea un número
            cantidad: productoCantidadMap[Number(id_producto)] // Convertimos id_producto a número
        }));
        console.log(listaProducto_cantidad);
        return listaProducto_cantidad.filter((producto_tienda)=>producto_tienda.cantidad===cantidad_entrada)      
         
        }
        async HacerEntrada(id_tienda:number,id_producto:number,cantidad:number){
          let  prod_tienda:Producto_tienda|null=await(await this.execRepository)
          .createQueryBuilder("pt")
          .where("id_producto=:id_producto and id_tienda=:id_tienda",{id_producto,id_tienda})
          .getOne();
            
          if(!prod_tienda){
            const producto_tienda={
                "producto":{"id_producto":id_producto},
                "tienda":{"id_tienda":id_tienda},
                "cantidad":cantidad
            };
            return  (await this.execRepository).save(producto_tienda)
          }else{
            prod_tienda.cantidad+=cantidad;
          return (await this.execRepository).save(prod_tienda);
          }
        }
        async deleteProducto_tiendain0(): Promise<boolean>{
            try {
                (await this.execRepository)
                    .createQueryBuilder("producto_tienda")
                    .delete()
                    .where('producto_tienda.cantidad=0')
                    .execute();
                  console.log('Elemento eliminado correctamente.');
              return true;
                
            } catch (error) {
            return false;      
            }
              }
              async filtrarProducto_tienda(nombre_producto:string|null,sku:string|null,precio_liminf:string|null,precio_limsup:string|null,id_tienda:number,cantidad:number|null){
                const normalizeString = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                
                let producto_tiendas:Producto_tienda[]=await(await this.execRepository)
                .createQueryBuilder("pt")
                .leftJoinAndSelect("pt.producto","p")
                .leftJoinAndSelect("pt.tienda","t")
                .where("t.id_tienda=:id_tienda",{id_tienda})
                .getMany();

                if(nombre_producto){
                    const normalizedNombre = normalizeString(nombre_producto);
                    producto_tiendas=producto_tiendas.filter((producto_tienda:Producto_tienda)=>normalizeString(producto_tienda.producto.nombre).toLowerCase().includes(normalizedNombre))
                }
                if(sku){
                    const normalizedSku = normalizeString(sku);       
                    producto_tiendas= producto_tiendas.filter((producto_tienda:Producto_tienda)=>normalizeString(producto_tienda.producto.Sku).toLowerCase().includes(normalizedSku))
                }    
                if(precio_liminf)
                    producto_tiendas= producto_tiendas.filter((producto_tienda:Producto_tienda)=>producto_tienda.producto.precio>=parseInt(precio_liminf))
                if(precio_limsup)
                    producto_tiendas= producto_tiendas.filter((producto_tienda:Producto_tienda)=>producto_tienda.producto.precio<=parseInt(precio_limsup)) 
                
                if(cantidad!=null){
                if(cantidad>=0){
                    producto_tiendas=producto_tiendas.filter((producto_tienda:Producto_tienda)=>producto_tienda.cantidad===cantidad)
                }}
                return producto_tiendas;
            }
            async Producto_tiendaToExcel(filePath:string){
                const workbook = XLSX.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            
                const headers:any = worksheet[0]; // Fila 3 (índice 2)
                const rows = worksheet.slice(1); // Desde la fila 4 en adelante (índice 3)
            
                let productos: any[] = rows.map((row: any) => {
                    let producto: any = {};
                    headers.forEach((header: string, index: number) => {
                        producto[header] = row[index];
                    });
                    return producto;
                });
                productos=productos.map((prod)=>{return{
                    "Sku":prod.Codigo,
                    "Almacen":prod.Almacen,
                    "Taller_Cell":prod.Taller_Cell,
                    "Taller_PC":prod.Taller_PC,
                    "Tienda":prod.Tienda,
                    "Cienfuegos":prod.Cienfuegos
                }})
            return productos;
            }
}

    