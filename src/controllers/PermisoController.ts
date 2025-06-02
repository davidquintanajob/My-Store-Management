import { Response,Request } from "express";
import { PermisoService } from "../services/PermisoService";
export class PermisoController{
    constructor(private readonly permisoService:PermisoService=new PermisoService()){
    
    }
    async createPermiso(req: Request, res: Response){
        try {
    const data = await this.permisoService.createPermiso (req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getPermiso(req: Request, res: Response){
        try {
          const data = await this.permisoService.findAllPermiso();
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getPermisoById(req: Request, res: Response){
        const {ID} = req.params;
        try {
      const data = await this.permisoService.findPermisoById(parseInt(ID));
      if(data)
        res.status(200).json(data);
    else
        res.status(404).json();
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async updatePermiso(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.permisoService.updatePermiso(parseInt(ID), req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async deletePermiso(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.permisoService.deletePermiso(parseInt(ID));
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    
    }