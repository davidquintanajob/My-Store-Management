import { Response,Request } from "express";
import { DeudaService } from "../services/DeudaService";
export class DeudaController{
    constructor(private readonly deudaService:DeudaService=new DeudaService()){
    
    }
    async createDeuda(req: Request, res: Response){
        try {
    const data = await this.deudaService.createDeuda (req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getDeuda(req: Request, res: Response){
        try {
          const data = await this.deudaService.findAllDeudas();
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getDeudaById(req: Request, res: Response){
        const {ID} = req.params;
        try {
      const data = await this.deudaService.findDeudaById(parseInt(ID));
      if(data)
        res.status(200).json(data);
    else
        res.status(404).json();
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async updateDeuda(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.deudaService.updateDeuda(parseInt(ID), req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async deleteDeuda(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.deudaService.deleteDeuda(parseInt(ID));
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
        async filtrarDeuda(req:Request,res:Response){
            const{nombre_producto,nombre_cliente,fecha_liminf,fecha_limsup,deuda_liminf,deuda_limsup,saldada,id_tienda,id_tipo_servicio}=req.body;
            try {
                const data = await this.deudaService.filtrarDeuda(nombre_producto,nombre_cliente,id_tienda,fecha_liminf,fecha_limsup,deuda_liminf,deuda_limsup,saldada,id_tipo_servicio);
            (data)?res.status(200).json(data):res.status(404).json("Not found");
            } catch (e:any) {
                res.status(500).json({"error":e.message});            
            }
        }
    }