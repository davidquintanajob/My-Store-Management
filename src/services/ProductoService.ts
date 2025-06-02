import { Any, createQueryBuilder, DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { ProductoDto } from "../DTO/ProductoDto";
import { Producto } from "../entities/Producto";
import { Tienda } from "../entities/Tienda";
import { Producto_tienda } from "../entities/Producto_tienda";
import { MapearProductos } from "../helpers/Mapper";
import * as XLSX from 'xlsx';
import { TomarImagenesAPIsolutel } from "../helpers/APIsupporter";
export class ProductoService extends BaseService<Producto> {
   
    constructor(){
        super(Producto);
    }
	// servicio para obtener todos los Productos

    async findAllProducto():Promise<Producto[]> {
        return (await this.execRepository)
        .createQueryBuilder("Producto")
        .leftJoinAndSelect("Producto.tiendas","tiendas")
        .leftJoinAndSelect("Producto.imagenes","imagenes")
        .getMany();
    }
    async findProductoById(id_producto: number): Promise<Producto | null> {
        return (await this.execRepository)
        .createQueryBuilder("Producto")
        .leftJoinAndSelect("Producto.tiendas","tiendas")
        .leftJoinAndSelect("Producto.imagenes","imagenes")
        .where("Producto.id_producto=:id_producto",{id_producto})
        .getOne();      
    }
    // servicio para crear un Productos
 async createProducto(body: ProductoDto): Promise<Producto>{
        return (await this.execRepository).save(body);
    }

    async deleteProducto(id: number): Promise<DeleteResult>{
        return (await this.execRepository).delete(id);
    }
    // actualizar un Productos
   async updateProducto(id: number, infoUpdate: ProductoDto): Promise<UpdateResult>{
    return (await this.execRepository).update(id, infoUpdate);
    }
    async getAllimagenesProductobyId(ID:number){
        return (await this.execRepository)
        .createQueryBuilder("Producto")
        .leftJoinAndSelect('Producto.imagenes', 'Imagen')
        .where("Producto.id_producto=:ID",{ID})
        .getOne()
    }
    async agregarTienda(id_producto:number,id_tienda:number){
       const producto:Producto|null=await(await this.execRepository)
       .createQueryBuilder("Producto")
       .leftJoinAndSelect("Producto.tiendas","tiendas")
       .where("Producto.id_producto=:id_producto",{id_producto})
       .getOne();
       console.log(producto?.tiendas)
       if(producto&&producto.tiendas[0]){
       const tiendaAux:any=[];
       producto.tiendas.forEach((tienda)=>{
        tiendaAux.push({"id_tienda":tienda.id_tienda})
       })
       tiendaAux.push({"id_tienda":id_tienda})
        const nuevoProducto:any={
            "id_producto":id_producto,
            "tiendas":tiendaAux
        }
        return (await this.execRepository).save(nuevoProducto);
       }else{
        if(!producto?.tiendas[0]){
            const nuevoProducto={
                "id_producto":id_producto,
                "tiendas":[{"id_tienda":id_tienda}]
            }
            return (await this.execRepository).save(nuevoProducto);
        }else
        return null;
       }
    }
    async filtrarProducto(nombre:string|null,sku:string|null,precio_liminf:string|null,precio_limsup:string|null,id_tienda:number|null,cantidad:number|null){
        let productos=await(await this.execRepository)
        .createQueryBuilder("Producto")
        .select("pt.cantidad","cantidad")
        .addSelect("Producto.id_producto","id_producto")
        .addSelect("Producto.nombre","nombre")
        .addSelect("Producto.Sku","Sku")
        .addSelect("Producto.precio_empresa","precio_empresa")
        .addSelect("Producto.precio","precio")
        .addSelect("SUM(pt.cantidad)", "cantidad")
        .leftJoinAndSelect("Producto.tiendas","tiendas")
        .innerJoinAndSelect(Producto_tienda,"pt","Producto.id_producto=pt.id_producto")
        .groupBy("Producto.id_producto,tiendas.id_tienda,pt.id_tienda,pt.id_producto")
        .getRawMany();
       productos= productos.map((producto)=>{
         if(producto.id_tienda==null)
         return{
             "id_producto":producto.id_producto,
             "nombre":producto.nombre,
             "Sku":producto.Sku,
             "precio":producto.precio,
             "precio_empresa":producto.precio_empresa,
             "tiendas":[{
                 "id_tienda":producto.tiendas_id_tienda,
                 "cantidad":producto.cantidad

             }],
         }
        }
     );
     productos=MapearProductos(productos).map((producto)=>{return{
        "id_producto":producto.id_producto,
        "nombre":producto.nombre,
        "Sku":producto.Sku,
        "precio":producto.precio,
        "precio_empresa":producto.precio_empresa,
        "cantidad_total":producto.tiendas[0].cantidad||0,
        "tiendas":producto.tiendas
        }});
        const _auxiliar=await(await this.execRepository)
        .createQueryBuilder("p")
        .leftJoinAndSelect("p.tiendas","tiendas")
        .getMany();
        let auxiliar:any[]=[]
        
        _auxiliar.forEach((aux:any)=>{
            if(aux.tiendas.length===0){
                aux.cantidad_total=0;
                productos.push(aux);

            }
        })
         if(cantidad!=null){
        if(cantidad>=0){
            productos=productos.filter((producto:any)=>{return producto.cantidad_total===cantidad});
           /* if(cantidad===0){
                const auxiliar=await(await this.execRepository)
                .createQueryBuilder("p")
                .leftJoinAndSelect("p.tiendas","tiendas")
                .getMany();
                
                auxiliar.forEach((aux:any)=>{
                    if(aux.tiendas.length===0){
                        aux.cantidad_total=0;
                        productos.push(aux);

                    }
                })
                console.log(productos)
        }*/
            }/*else {
                productos = await(await this.execRepository)
                .createQueryBuilder('p')
                .leftJoinAndSelect('p.productoTienda', 'pt')
                .where('pt.id_producto IS NULL OR pt.cantidad = :cantidad', { cantidad: 0 })
                .getMany();
            }*/
      }/*else{
       productos=await((await this.execRepository)
      .createQueryBuilder("Producto")
      .leftJoinAndSelect("Producto.tiendas","tienda")
      .getMany());
      }*/
      const normalizeString = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();


    if(nombre){
        const normalizedNombre = normalizeString(nombre);
        productos= productos.filter((producto:any)=>normalizeString(producto.nombre).toLowerCase().includes(normalizedNombre))
//            proveedores = proveedores.filter((proveedor: Proveedor) => normalizeString(proveedor.nombre).includes(normalizedNombre));
    }
    if(sku){
        console.log(sku);
        const normalizedSku = normalizeString(sku);       
        productos= productos.filter((producto:any)=>normalizeString(producto.Sku).toLowerCase().includes(normalizedSku))
    }    
    if(precio_liminf)
        productos= productos.filter((producto:any)=>producto.precio>=parseInt(precio_liminf))
    if(precio_limsup)
        productos= productos.filter((producto:any)=>producto.precio<=parseInt(precio_limsup))
    if(id_tienda){
        console.log("Entre a id_tienda!!!")
        productos.forEach((producto:any)=>{
            if(producto.tiendas)
                producto.tiendas.forEach((tienda:any)=>{
            if(tienda.id_tienda===id_tienda)
        auxiliar.push(producto);
                })
        })
        productos=auxiliar;
    }
    return productos;
    }
   async DeleteAllTiendasinProducto(){
    const allProductos:Producto[]=  await (await this.execRepository)
    .createQueryBuilder("Producto")
    .leftJoinAndSelect("Producto.tiendas","tiendas")
    .getMany();

    let productos:any[]=await (await this.execRepository)
    .createQueryBuilder("Producto")
    .select("pt.cantidad","cantidad")
    .addSelect("Producto.id_producto","id_producto")
    .innerJoinAndSelect(Producto_tienda,"pt","Producto.id_producto=pt.id_producto")
    .where("pt.cantidad=0")
    .getRawMany();
    productos=productos.map((producto)=>{return{
        "id_producto":producto.id_producto,
        "id_tienda": producto.pt_id_tienda,
        "cantidad": producto.cantidad
    }});
for(let p of allProductos){        
    for(let producto of productos){
        if(p.id_producto===producto.id_producto){
            console.log("id_tienda:",producto.id_tienda,p.tiendas,"antes")
            p.tiendas=  p.tiendas.filter((tienda:Tienda)=>tienda.id_tienda!=producto.id_tienda);
            (await this.execRepository).save(p);
            console.log(p.tiendas,"despues");
                                              
                }
    }
}
}
async procesarExcel(filePath: string) {
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
    console.log(productos);
    
    productos= productos.map((producto)=>{
        return{
            "nombre":producto.Descripcion,
            "Sku":producto.Codigo,
            "precio":producto.Precio_USD,
            "precio_empresa":(producto.Mayorista_CUP),
        }
    });
    return productos;
   
    }
    
    async findbySku(sku:string){
        return(await this.execRepository).
        createQueryBuilder("producto")
        .leftJoinAndSelect("producto.imagenes","i")
        .where("producto.Sku=:sku",{sku})
        .getOne()
    }
    async getAllPaginated(page:number){
        const limite = 20;
        const offset = (page - 1) * limite;

        let auxiliar:any[]=[]
    

        let productos=await(await this.execRepository)
        .createQueryBuilder("Producto")
        .select("pt.cantidad","cantidad")
        .addSelect("Producto.id_producto","id_producto")
        .addSelect("Producto.nombre","nombre")
        .addSelect("Producto.Sku","Sku")
        .addSelect("Producto.precio_empresa","precio_empresa")
        .addSelect("Producto.precio","precio")
        .addSelect("SUM(pt.cantidad)", "cantidad")
        .leftJoinAndSelect("Producto.tiendas","tiendas")
        .leftJoinAndSelect(Producto_tienda,"pt","Producto.id_producto=pt.id_producto")
        .groupBy("Producto.id_producto,tiendas.id_tienda,pt.id_tienda,pt.id_producto")
        .getRawMany();
        console.log(productos);
        productos= productos.map((producto)=>{
         if(producto.id_tienda==null)
         return{
             "id_producto":producto.id_producto,
             "nombre":producto.nombre,
             "Sku":producto.Sku,
             "precio":producto.precio,
             "precio_empresa":producto.precio_empresa,
             "tiendas":[{
                 "id_tienda":producto.tiendas_id_tienda,
                 "cantidad":producto.cantidad

             }],
         }
        }
     );
     productos=MapearProductos(productos).map((producto)=>{return{
        "id_producto":producto.id_producto,
             "nombre":producto.nombre,
             "Sku":producto.Sku,
             "precio":producto.precio,
             "precio_empresa":producto.precio_empresa,
             "cantidad_total":producto.tiendas[0].cantidad,
             "tiendas":producto.tiendas
            }});
            const _auxiliar=await(await this.execRepository)
        .createQueryBuilder("p")
        .leftJoinAndSelect("p.tiendas","tiendas")
        .getMany();        
        _auxiliar.forEach((aux:any)=>{
            if(aux.tiendas.length===0){
                aux.cantidad_total=0;
                productos.push(aux);

            }
        })
            productos=productos.slice(offset,offset+limite);
            console.log(productos.length)

            const cantidad_total_productos=await(await this.execRepository)
            .createQueryBuilder("Producto")
            .getCount();
        return {"productos":productos,
               "pagina":page,
               "cantidad_total_productos":cantidad_total_productos
        };
    }
}
