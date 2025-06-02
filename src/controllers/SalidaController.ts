import { Response,Request } from "express";
import { SalidaService } from "../services/SalidaService";
import { OrdenarSalidas as OrderSalidas} from "../helpers/Ordenar_criterios";
import { Salida } from "../entities/Salida";
export class SalidaController{
    constructor(private readonly salidaService:SalidaService=new SalidaService()){
    
    }
    async createSalida(req: Request, res: Response){
        try {
    const data = await this.salidaService.createSalida (req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getSalida(req: Request, res: Response){
        try {
          const data = await this.salidaService.findAllSalidas();
            res.status(200).json(data.map((salida:Salida)=>{return{
                "id_salida":salida.id_salida,
                "fecha" :salida.fecha,
                "cantidad":salida.cantidad,
                "producto":salida.producto,
                "tienda_destino":salida.tienda_destino,
                "tienda_origen":salida.tienda_origen,
                "usuario":{
                    "id_usuario":salida.usuario.id_usuario,
                    "nombre":salida.usuario.nombre,
                    "nombre_usuario":salida.usuario.nombre_usuario
                }

            }}));
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getSalidaById(req: Request, res: Response){
        const {ID} = req.params;
        try {
      const data:Salida|null = await this.salidaService.findSalidaById(parseInt(ID));
      if(data)
        res.status(200).json({
           "id_salida":data.id_salida,
                "fecha" :data.fecha,
                "cantidad":data.cantidad,
                "producto":data.producto,
                "tienda_destino":data.tienda_destino,
                "tienda_origen":data.tienda_origen,
                "usuario":{
                    "id_usuario":data.usuario.id_usuario,
                    "nombre":data.usuario.nombre,
                    "nombre_usuario":data.usuario.nombre_usuario
                }
        });
    else
        res.status(404).json();
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async updateSalida(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.salidaService.updateSalida(parseInt(ID), req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async deleteSalida(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.salidaService.deleteSalida(parseInt(ID));
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async filtrarSalida(req:Request,res:Response){
        const {nombre_usuario,nombre_producto,cantidad,fecha_liminf,fecha_limsup,id_tienda_origen,id_tienda_destino}=req.body
        try {
            const data=await this.salidaService.filtrarSalida(nombre_usuario,nombre_producto,cantidad,fecha_liminf,fecha_limsup,id_tienda_origen,id_tienda_destino);
            (data)?res.status(200).json(data.map((salida:Salida)=>{return{
                "id_salida":salida.id_salida,
                "fecha" :salida.fecha,
                "cantidad":salida.cantidad,
                "producto":salida.producto,
                "tienda_destino":salida.tienda_destino,
                "tienda_origen":salida.tienda_origen,
                "usuario":{
                    "id_usuario":salida.usuario.id_usuario,
                    "nombre":salida.usuario.nombre,
                    "nombre_usuario":salida.usuario.nombre_usuario
                }

            }})):res.status(404).json({"msg":"NOT FOUND"});
        } catch (error:any) {
            res.status(500).json({"error":error.message})
            
        }
    }
    async getSalidasPaginated(req: Request, res: Response) {
        const { page } = req.params;
        try {
          const data = await this.salidaService.getSalidasPaginated(parseInt(page));
          (data) ? res.status(200).json(data) : res.status(404).json("Data not found");
        } catch (error: any) {
          res.status(500).json({ "error": error.message });
        }
      }
    async OrdenarSalida(req:Request,res:Response){
       let{items,criterio,ascendente}=req.body
            try {
                console.log(typeof(ascendente))
                const data= OrderSalidas(ascendente,items,criterio);
                (data)?res.status(200).json(data):res.status(404).json("no se puede ordenar");
            } catch (error:any) {
                res.status(500).json({"error":error.message})
            }
        }
        async filtrarSalidaJT(req:Request,res:Response){
            const {nombre_usuario,nombre_producto,cantidad,fecha_liminf,fecha_limsup,id_tienda,id_tienda_origen,id_tienda_destino}=req.body
            try {
                const data=await this.salidaService.filtrarSalidasJT(nombre_usuario,nombre_producto,cantidad,fecha_liminf,fecha_limsup,parseInt(id_tienda),id_tienda_origen,id_tienda_destino);
                (data)?res.status(200).json(data.map((salida:Salida)=>{return{
                    "id_salida":salida.id_salida,
                    "fecha" :salida.fecha,
                    "cantidad":salida.cantidad,
                    "producto":salida.producto,
                    "tienda_destino":salida.tienda_destino,
                    "tienda_origen":salida.tienda_origen,
                    "usuario":{
                        "id_usuario":salida.usuario.id_usuario,
                        "nombre":salida.usuario.nombre,
                        "nombre_usuario":salida.usuario.nombre_usuario
                    }
    
                }})):res.status(404).json({"msg":"NOT FOUND"});
            } catch (error:any) {
                res.status(500).json({"error":error.message})
                
            }
        }
    }
    
    