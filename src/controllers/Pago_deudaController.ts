import { Response,Request } from "express";
import { Pago_DeudaService } from "../services/Pago_DeudaService";
export class Pago_DeudaController{
    constructor(private readonly pago_DeudaService:Pago_DeudaService=new Pago_DeudaService()){
    
    }
    async createPago_Deuda(req: Request, res: Response){
        try {
    const data = await this.pago_DeudaService.createPago_Deuda (req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getPago_Deuda(req: Request, res: Response){
        try {
          const data = await this.pago_DeudaService.findAllPago_Deuda();
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getPago_DeudaById(req: Request, res: Response){
        const {ID} = req.params;
        try {
      const data = await this.pago_DeudaService.findPago_DeudaById(parseInt(ID));
      if(data)
        res.status(200).json(data);
    else
        res.status(404).json();
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async updatePago_Deuda(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.pago_DeudaService.updatePago_Deuda(parseInt(ID), req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async deletePago_Deuda(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.pago_DeudaService.deletePago_Deuda(parseInt(ID));
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    
    }