import { Response,Request } from "express";
import { ImagenService } from "../services/ImagenService";
export class ImagenController{
    constructor(private readonly imagenService:ImagenService=new ImagenService()){
    
    }
    async createImagen(req: Request, res: Response){
        try {
    const data = await this.imagenService.createImagen (req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getImagen(req: Request, res: Response){
        try {
          const data = await this.imagenService.findAllImagenes();
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getImagenById(req: Request, res: Response){
        const {ID} = req.params;
        try {
      const data = await this.imagenService.findImagenById(parseInt(ID));
      if(data)
        res.status(200).json(data);
    else
        res.status(404).json();
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async updateImagen(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.imagenService.updateImagen(parseInt(ID), req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async deleteImagen(req: Request, res: Response){
        const {ID,url} = req.params;
        try {
            const data = await this.imagenService.deleteImagen(parseInt(ID),url);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    
    }