import { Response,Request } from "express";
import { Tipo_accionService } from "../services/Tipo_accionService";
export class Tipo_accionController{
    constructor(private readonly tipo_accionService:Tipo_accionService=new Tipo_accionService()){
    
    }
    async createTipo_accion(req: Request, res: Response){
        try {
    const data = await this.tipo_accionService.createTipo_accion (req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getTipo_accion(req: Request, res: Response){
        try {
          const data = await this.tipo_accionService.findAllTipo_accions();
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getTipo_accionById(req: Request, res: Response){
        const {ID} = req.params;
        try {
      const data = await this.tipo_accionService.findTipo_accionById(parseInt(ID));
      if(data)
        res.status(200).json(data);
    else
        res.status(404).json();
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async updateTipo_accion(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.tipo_accionService.updateTipo_accion(parseInt(ID), req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async deleteTipo_accion(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.tipo_accionService.deleteTipo_accion(parseInt(ID));
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    
    }