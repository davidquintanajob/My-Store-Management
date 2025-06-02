import { Response,Request } from "express";
import { ProveedorService } from "../services/ProveedorService";
import { OrdenarProveedores } from "../helpers/Ordenar_criterios";
export class ProveedorController{
    constructor(private readonly proveedorService:ProveedorService=new ProveedorService()){
    
    }
    async createProveedor(req: Request, res: Response){
        try {
    const data = await this.proveedorService.createProveedor (req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getProveedor(req: Request, res: Response){
        try {
          const data = await this.proveedorService.findAllProveedores();
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getProveedorById(req: Request, res: Response){
        const {ID} = req.params;
        try {
      const data = await this.proveedorService.findProveedorById(parseInt(ID));
      if(data)
        res.status(200).json(data);
    else
        res.status(404).json();
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async updateProveedor(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.proveedorService.updateProveedor(parseInt(ID), req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async deleteProveedor(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.proveedorService.deleteProveedor(parseInt(ID));
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async OrdenarProveedor(req:Request,res:Response){
        let{items,criterio,ascendente}=req.body
        try {
            console.log(typeof(ascendente))
            const data= OrdenarProveedores(ascendente,items,criterio);
            (data)?res.status(200).json(data):res.status(404).json("no se puede ordenar");
        } catch (error:any) {
            res.status(500).json({"error":error.message})
        }
    }
    async FiltrarProveedor(req:Request,res:Response){
        const{telefono,detalle_bancario,nombre,email}=req.body;
        try {
            console.log("telefono:"+telefono,"detalle_bancario:"+detalle_bancario,"nombre:"+nombre,"email:"+email)
            const data=await this.proveedorService.filtrarProveedor(nombre,email,detalle_bancario,telefono);
            (data)?res.status(200).json(data):res.status(404).json("No se pudo filtrar");
        } catch (error:any) {
            res.status(500).json({error:error.message});
        }
    }
    }
    