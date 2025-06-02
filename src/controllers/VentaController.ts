import { Response,Request } from "express";
import { VentaService } from "../services/VentaService";
export class VentaController{
    constructor(private readonly ventaService:VentaService=new VentaService()){
    
    }
    async createVenta(req: Request, res: Response){
        try {
    const data = await this.ventaService.createVenta (req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getVenta(req: Request, res: Response){
        try {
          const data = await this.ventaService.findAllVentas();
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getVentaById(req: Request, res: Response){
        const {id_producto,id_servicio} = req.params;
        try {
      const data = await this.ventaService.findVentaById(parseInt(id_producto),parseInt(id_servicio));
      if(data)
        res.status(200).json(data);
    else
        res.status(404).json();
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async updateVenta(req: Request, res: Response){
        const {id_servicio,id_producto} = req.body;
        try {
            const data = await this.ventaService.updateVenta(parseInt(id_producto),parseInt(id_servicio), req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async deleteVenta(req: Request, res: Response){
        const {id_producto,id_servicio} = req.params;
        try {
            const data = await this.ventaService.deleteVenta(parseInt(id_producto),parseInt(id_servicio));
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async listaVendidos(req:Request,res:Response){
        try {
           const data=await this.ventaService.Producto_masVendido();
           (data)?res.status(200).json(data):res.status(404).json("No productos")
        } catch (error:any) {
            res.status(500).json({"error":error.message})
            
        }
    }
    async listaVendidosPorFecha(req:Request,res:Response){
        const{fecha_liminf,fecha_limsup}=req.body;
        try {
            const data=await this.ventaService.Producto_masVendidoEntreRangosDeFecha(new Date(fecha_liminf),new Date(fecha_limsup));
            (data)?res.status(200).json(data):res.status(404).json("No se encontraron")
        } catch (error:any) {
            res.status(500).json({"error":error.message})
        }
    }
    
    async findVentabyId_producto(req:Request,res:Response){
        const {id_producto} = req.params;
        try {
            const data=await this.ventaService.findbyId_producto(parseInt(id_producto));
            (data)?res.status(200).json(data):res.status(404).json("NOT FOUND")
        } catch (error:any) {
            res.status(500).json({"error":error.message})
        }
    }
    async findVentabyId_servicio(req:Request,res:Response){
        const {id_servicio} = req.params;
        try {
            const data=await this.ventaService.findbyId_servicio(parseInt(id_servicio));
            (data)?res.status(200).json(data):res.status(404).json("NOT FOUND")
        } catch (error:any) {
            res.status(500).json({"error":error.message})
        }
    }
    }