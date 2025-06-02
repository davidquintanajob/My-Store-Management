import { Response,Request } from "express";
import { Producto_tiendaService } from "../services/Producto_tiendaService";
import { Producto_tienda } from "../entities/Producto_tienda";
export class Producto_tiendaController{
    constructor(private readonly producto_tiendaService:Producto_tiendaService=new Producto_tiendaService()){
    
    }
    async createProducto_tienda(req: Request, res: Response){
        try {
    const data = await this.producto_tiendaService.createProducto_tienda (req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getProducto_tienda(req: Request, res: Response){
        try {
          const data = await this.producto_tiendaService.findAllProducto_tienda();
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getProducto_tiendaById(req: Request, res: Response){
        const {id_producto,id_tienda} = req.params;
        try {
      const data = await this.producto_tiendaService.findProducto_tiendaById(parseInt(id_producto),parseInt(id_tienda));
      if(data)
        res.status(200).json({
            "cantidad":data.cantidad,
            "encontrado":true
            });
    else
        res.status(404).json({
    "encontrado":false
});
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async updateProducto_tienda(req: Request, res: Response){
        const {id_producto,id_tienda} = req.body;
        try {
            const data = await this.producto_tiendaService.updateProducto_tienda(parseInt(id_producto),parseInt(id_tienda), req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async deleteProducto_tienda(req: Request, res: Response){
        const {id_producto, id_tienda} = req.body;
        try {
            const data = await this.producto_tiendaService.deleteProducto_tienda(parseInt(id_producto),parseInt(id_tienda));
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }

    async getProductosbyTienda(req:Request,res:Response){
        const{id_tienda}=req.params
        try {
            const data:Producto_tienda[]=await this.producto_tiendaService.getProductosTienda(parseInt(id_tienda));
            (data.length>0)?res.status(200).json(data):res.status(404).json("Tienda no encontrada")
        } catch (error:any) {
            res.status(500).json({"error":error.message})
        }
    }
    async getTiendabyProductos(req:Request,res:Response){
        const{id_producto}=req.params
        try {
            const data:Producto_tienda[]=await this.producto_tiendaService.getTiendasbyProducto(parseInt(id_producto));
            (data)?res.status(200).json(data):res.status(404).json("Producto no encontrado")
        } catch (error:any) {
            res.status(500).json({"error":error.message})
        }
    }
    async moverProducto_tienda(req:Request,res:Response){
        try{
            const {id_producto,id_tienda_origen,id_tienda_destino,cantidad} = req.body;
            console.log(id_producto,id_tienda_origen,id_tienda_destino,cantidad);
            
            await this.producto_tiendaService.moverProducto(parseInt(id_producto),parseInt(id_tienda_origen),parseInt(id_tienda_destino),parseInt(cantidad));

            res.status(200).json(true)
        }catch(e:any){
            res.status(500).json({"error":e.message});
        }
    }
    async getCantidadTotal(req:Request,res:Response){
        const {id_producto}=req.params;
        try {
            const data=await this.producto_tiendaService.cantidadTotalProductos(parseInt(id_producto))
            res.status(200).json({"cantidad_total":data})
        } catch (error:any) {
           res.status(500).json({"error":error.message})
        }


    }
    async realizarVenta(req:Request,res:Response){
        const{id_producto,id_tienda,cantidad}=req.body;
        try{
           const data= await this.producto_tiendaService.realizarVenta(parseInt(id_producto),parseInt(id_tienda),parseInt(cantidad))
            if(data){
                res.status(200).json({
                    "cantidad":cantidad,
                    "Producto_tienda":data
                })
            }
        }catch(e:any){
            res.status(500).json({"error":e.message})
        }
    }
    async filtrarPorCantidades(req:Request,res:Response){
        const{cantidad}=req.params;
        try {
            const data=await this.producto_tiendaService.filtrarPorCantidad(parseInt(cantidad));
            (data)?res.status(200).json(data):res.status(404).json()
        } catch (error) {
            res.status(500).json({"error":error})
        }
    
  
    }
    async HacerEntrada(req:Request,res:Response){
        const{id_producto,id_tienda,cantidad}=req.body;
        try {
            const data=await this.producto_tiendaService.HacerEntrada(parseInt(id_tienda),parseInt(id_producto),parseInt(cantidad));
            (data)?res.status(200).json(data):res.status(404).json("No encontrado");
        } catch (error:any) {
            res.status(500).json({"error":error.message});
            
        }
    }
    async deleteProducto_tiendain0(req:Request,res:Response){
        try {
            const data=await this.producto_tiendaService.deleteProducto_tiendain0();
           (data)?res.status(200).json(true):res.status(404).json("Explotó")

        } catch (error:any) {
            res.status(500).json({"error":error.message})
        }
    }
    async filtrarProducto_tienda(req:Request,res:Response){
        const{nombre,sku,precio_liminf,precio_limsup,id_tienda,cantidad}=req.body;
        try {
            const data=await this.producto_tiendaService.filtrarProducto_tienda(nombre,sku,precio_liminf,precio_limsup,parseInt(id_tienda),cantidad);
            (data)?res.status(200).json(data):res.status(404).json("No se encontró el elemento");
        } catch (error:any) {
            res.status(500).json({"error":error.message})
        }
    }
    async ImportarExcel(req:Request,res:Response){
        const {path}=req.body;
        try {
            const data=await this.producto_tiendaService.Producto_tiendaToExcel(path);
            res.status(200).json(data);
        } catch (error:any) {
            res.status(500).json({ "error": error.message });
            
        };
    }
    }