import { Response,Request } from "express";
import { ServicioService } from "../services/ServicioService";
import { OrdenarServicio } from "../helpers/Ordenar_criterios";
export class ServicioController{
    constructor(private readonly servicioService:ServicioService=new ServicioService()){
    
    }
    async createServicio(req: Request, res: Response){
        try {
    const data = await this.servicioService.createServicio (req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getServicio(req: Request, res: Response){
        try {
          const data = await this.servicioService.findAllServicios();
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getServicioById(req: Request, res: Response){
        const {ID} = req.params;
        try {
      const data = await this.servicioService.findServicioById(parseInt(ID));
      if(data)
        res.status(200).json(data);
    else
        res.status(404).json();
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async updateServicio(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.servicioService.updateServicio(parseInt(ID), req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async deleteServicio(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.servicioService.deleteServicio(parseInt(ID));
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getAllGanancia(req:Request,res:Response){
        try{
           const ganancia= await this.servicioService.GananciaTotalServicio()
           res.status(200).json({"ganancia_total":ganancia})
        }catch(e:any){
            res.status(500).json({"error":e})
        }

    }
    async getServiciosPaginated(req: Request, res: Response) {
        const { page } = req.params;
        try {
          const data = await this.servicioService.getServiciosPaginated(parseInt(page));
          (data) ? res.status(200).json(data) : res.status(404).json("Data not found");
        } catch (error: any) {
          res.status(500).json({ "error": error.message });
        }
      }
    async getServiciosPorTipo_servicio(req:Request,res:Response){
        const{id_tipo_servicio}=req.params;
        try{
            const data= await this.servicioService.getServiciosbyTipo_servicio(parseInt(id_tipo_servicio));
            (data)?res.status(200).json(data):res.status(404).json("Tipo servicio no encontrado")
        }catch(e:any){
            res.status(500).json({"error":e.message})
        }
    }
     async OrdenarServicios (req:Request,res:Response){
        let{items,criterio,ascendente}=req.body
        try {
            console.log(typeof(ascendente))
            const data= await OrdenarServicio(ascendente,items,criterio);
            (data)?res.status(200).json(data):res.status(404).json("no se puede ordenar");
        } catch (error:any) {
            res.status(500).json({"error":error.message})
        }
     }
     async filtrarServicios(req:Request,res:Response){
        const{nombre_cliente,id_tipo_servicio,id_tienda,precio_liminf,precio_limsup,fecha_liminf,fecha_limsup,nombre_producto}=req.body;
        try {
            const data=await this.servicioService.filtrarServicio(nombre_cliente,precio_liminf,precio_limsup,fecha_liminf,fecha_limsup,id_tipo_servicio,id_tienda,nombre_producto);
            (data)?res.status(200).json(data):res.status(404).json("Not found");
        } catch (error:any) {
            res.status(500).json({"error":error.message})
        }
    }
    async filtrarServiciosJT(req:Request,res:Response){
        const{nombre_cliente,id_tipo_servicio,id_tienda,precio_liminf,precio_limsup,fecha_liminf,fecha_limsup}=req.body;
        try {
            const data=await this.servicioService.filtrarServicioJT(nombre_cliente,precio_liminf,precio_limsup,fecha_liminf,fecha_limsup,parseInt(id_tipo_servicio),id_tienda);
            (data)?res.status(200).json(data):res.status(404).json("Not found");
        } catch (error:any) {
            res.status(500).json({"error":error.message})
        }
    }
    }