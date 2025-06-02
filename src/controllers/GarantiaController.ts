import { Response,Request } from "express";
import { GarantiaService } from "../services/GarantiaService";
import { OrdenarGarantias } from "../helpers/Ordenar_criterios";
export class GarantiaController{
    constructor(private readonly garantiaService:GarantiaService=new GarantiaService()){
    
    }
    async createGarantia(req: Request, res: Response){
        try {
    const data = await this.garantiaService.createGarantia (req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getGarantia(req: Request, res: Response){
        try {
          const data = await this.garantiaService.findAllGarantia();
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getGarantiaById(req: Request, res: Response){
        const {ID} = req.params;
        try {
      const data = await this.garantiaService.findGarantiaById(parseInt(ID));
      if(data)
        res.status(200).json(data);
    else
        res.status(404).json();
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async updateGarantia(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.garantiaService.updateGarantia(parseInt(ID), req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async deleteGarantia(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.garantiaService.deleteGarantia(parseInt(ID));
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async filtrarGarantia(req:Request,res:Response){
        const{nombre_cliente,fecha_liminf,fecha_limsup,duracion_limsup, duracion_liminf,nombre_producto,id_tienda}=req.body
        try {
            const data=await this.garantiaService.filtrarGarantias(nombre_cliente,fecha_liminf,fecha_limsup,nombre_producto,duracion_liminf,duracion_limsup,id_tienda);
            (data)?res.status(200).json(data):res.status(404).json("Not found")
        } catch (error:any) {
            res.status(500).json({"error":error.message});            

        }
    }
         async OrdenarGarantia(req:Request,res:Response){
               let{items,criterio,ascendente}=req.body
                    try {
                        console.log(typeof(ascendente))
                        const data= OrdenarGarantias(ascendente,items,criterio);
                        (data)?res.status(200).json(data):res.status(404).json("no se puede ordenar");
                    } catch (error:any) {
                        res.status(500).json({"error":error.message})
                    }
                }
    }