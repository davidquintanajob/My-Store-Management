import { Response,Request } from "express";
import { EncargoService } from "../services/EncargoService";
export class EncargoController{
    constructor(private readonly encargoService:EncargoService=new EncargoService()){
    
    }
    async createEncargo(req: Request, res: Response){
        try {
    const data = await this.encargoService.createEncargo (req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getEncargo(req: Request, res: Response){
        try {
          const data = await this.encargoService.findAllEncargos();
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getEncargoById(req: Request, res: Response){
        const {ID} = req.params;
        try {
      const data = await this.encargoService.findEncargoById(parseInt(ID));
      if(data)
        res.status(200).json(data);
    else
        res.status(404).json();
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async updateEncargo(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.encargoService.updateEncargo(parseInt(ID), req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async deleteEncargo(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.encargoService.deleteEncargo(parseInt(ID));
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    
    }