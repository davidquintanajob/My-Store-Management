import { Response,Request } from "express";
import { RolService } from "../services/RolService";
export class RolController{
    constructor(private readonly rolService:RolService=new RolService()){
    
    }
    async createRol(req: Request, res: Response){
        try {
    const data = await this.rolService.createRol (req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getRol(req: Request, res: Response){
        try {
          const data = await this.rolService.findAllRoles();
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getRolById(req: Request, res: Response){
        const {ID} = req.params;
        try {
      const data = await this.rolService.findRolById(parseInt(ID));
      if(data)
        res.status(200).json(data);
    else
        res.status(404).json();
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async updateRol(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.rolService.updateRol(parseInt(ID), req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async deleteRol(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.rolService.deleteRol(parseInt(ID));
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getPermisos(req:Request,res:Response){
        const{id_rol}=req.params
        try {
            const data=await this.rolService.getPermisos(parseInt(id_rol));
            (data)?res.status(200).json(data.permisos):res.status(404).json("Rol not found")
        } catch (error:any) {
            res.status(500).json({"error":error.message})
        }
    }
    }