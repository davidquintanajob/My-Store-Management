import { Response,Request } from "express";
import { ClienteService } from "../services/ClienteService";
import { OrdenarClientes } from "../helpers/Ordenar_criterios";
export class ClienteController{
    constructor(private readonly clienteService:ClienteService=new ClienteService()){
    
    }
    async createCliente(req: Request, res: Response){
        try {
    const data = await this.clienteService.createCliente (req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getCliente(req: Request, res: Response){
        try {
          const data = await this.clienteService.findAllClientees();
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getClienteById(req: Request, res: Response){
        const {ID} = req.params;
        try {
      const data = await this.clienteService.findClienteById(parseInt(ID));
      if(data)
        res.status(200).json(data);
    else
        res.status(404).json();
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async updateCliente(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.clienteService.updateCliente(parseInt(ID), req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async deleteCliente(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.clienteService.deleteCliente(parseInt(ID));
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async filtrarCliente(req:Request,res:Response){
        const{nombre,telefono,detalles_bancarios,cif}=req.body;
        try{
            const data=await this.clienteService.filtrarCliente(nombre,cif,telefono,detalles_bancarios);
            (data)?res.status(200).json(data):res.status(404).json("Not found");
        }catch(e:any){
            res.status(500).json({"error":e.message});            
        }
    }
    async OrdenarCliente(req:Request,res:Response){
        let{items,criterio,ascendente}=req.body
        try {
            console.log(typeof(ascendente))
            const data= OrdenarClientes(ascendente,items,criterio);
            (data)?res.status(200).json(data):res.status(404).json("no se puede ordenar");
        } catch (error:any) {
            res.status(500).json({"error":error.message})
        }
    }
    
    }