import { Response,Request } from "express";
import { Tipo_servicioService } from "../services/Tipo_servicioService";
export class Tipo_servicioController{
    constructor(private readonly tipo_servicioService:Tipo_servicioService=new Tipo_servicioService()){
    
    }
    async createTipo_servicio(req: Request, res: Response){
        try {
    const data = await this.tipo_servicioService.createTipo_servicio (req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getTipo_servicio(req: Request, res: Response){
        try {
          const data = await this.tipo_servicioService.findAllTipo_servicios();
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getTipo_servicioById(req: Request, res: Response){
        const {ID} = req.params;
        try {
      const data = await this.tipo_servicioService.findTipo_servicioById(parseInt(ID));
      if(data)
        res.status(200).json(data);
    else
        res.status(404).json();
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async updateTipo_servicio(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.tipo_servicioService.updateTipo_servicio(parseInt(ID), req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async deleteTipo_servicio(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.tipo_servicioService.deleteTipo_servicio(parseInt(ID));
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async filtrarTipo_servicio(req:Request,res:Response){
        const{nombre,costo_liminf,costo_limsup}=req.body;
        try {
            const data= await this.tipo_servicioService.filtrarTipo_servicio(nombre,costo_liminf,costo_limsup);
            (data)?res.status(200).json(data):res.status(404).json("Not found");
        } catch (error:any) {
            res.status(500).json({"error":error.message});            

        }
    }
    }