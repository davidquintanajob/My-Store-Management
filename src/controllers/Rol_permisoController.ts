import { Response,Request } from "express";
import { Rol_permisoService } from "../services/Rol_permisoService";
export class Rol_permisoController{
    constructor(private readonly rol_permisoService:Rol_permisoService=new Rol_permisoService()){
    
    }
    async createRol_permiso(req: Request, res: Response){
        try {
    const data = await this.rol_permisoService.createRol_permiso (req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getRol_permiso(req: Request, res: Response){
        try {
          const data = await this.rol_permisoService.findAllRol_permiso();
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getRol_permisoById(req: Request, res: Response){
        const {id_rol,id_permiso} = req.params;
        try {
      const data = await this.rol_permisoService.findRol_permisoById(parseInt(id_rol),parseInt(id_permiso));
      if(data)
        res.status(200).json(data);
    else
        res.status(404).json();
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async updateRol_permiso(req: Request, res: Response){
        const {id_rol,id_permiso} = req.body;
        try {
            const data = await this.rol_permisoService.updateRol_permiso(parseInt(id_rol),parseInt(id_permiso), req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async deleteRol_permiso(req: Request, res: Response){
        const {id_rol,id_permiso} = req.body;
        try {
            const data = await this.rol_permisoService.deleteRol_permiso(parseInt(id_rol),(parseInt(id_permiso)));
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async PermisobyRol(req:Request,res:Response){
        const{id_rol}=req.params;
        try {
            const data=await this.rol_permisoService.getPermisosbyRolid(parseInt(id_rol));
            (data)?res.status(200).json(data):res.status(404).json("Rol no encontrado")
        } catch (error:any) {
            res.status(500).json({"error":error.message})
        }
    }
    
    }