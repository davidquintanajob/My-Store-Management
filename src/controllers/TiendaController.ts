import { Response,Request } from "express";
import { TiendaService } from "../services/TiendaService";
export class TiendaController{
    constructor(private readonly tiendaService:TiendaService=new TiendaService()){
    
    }
    async createTienda(req: Request, res: Response){
        try {
    const data = await this.tiendaService.createTienda (req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getTienda(req: Request, res: Response){
        try {
          const data = await this.tiendaService.findAllTiendas();
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getTiendaById(req: Request, res: Response){
        const {ID} = req.params;
        try {
      const data = await this.tiendaService.findTiendaById(parseInt(ID));
      if(data)
        res.status(200).json(data);
    else
        res.status(404).json();
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async updateTienda(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.tiendaService.updateTienda(parseInt(ID), req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async deleteTienda(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.tiendaService.deleteTienda(parseInt(ID));
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async ServiciosbyTienda(req:Request,res:Response){
    const{id_tienda}=req.params
    try {
        const data=await this.tiendaService.getServiciosbyTienda(parseInt(id_tienda));
      
        (data)?res.status(200).json(data):res.status(404).json("Tienda no encontrada")
    } 
    catch (error:any) {
        res.status(500).json({"error":error.message})
    }
    }
    async NoTiendasUsuario(req:Request,res:Response){
        const{id_usuario}=req.params;
        try {
            console.log(id_usuario);
            const data=await this.tiendaService.NoTiendasUsuario(parseInt(id_usuario));
        (data)?res.status(200).json(data):res.status(404).json("Usuario no encontrado")
        
        } catch (error:any) {
            res.status(500).json(error.message)
        }
    }
    }