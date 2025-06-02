import { Response,Request } from "express";
import { AccionService } from "../services/AccionService";
import { OrdenarAccion } from "../helpers/Ordenar_criterios";
export class AccionController{
    constructor(private readonly accionService:AccionService=new AccionService()){
    
    }
    async createAccion(req: Request, res: Response){
        try {
    const data = await this.accionService.createAccion (req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
    async getAccion(req: Request, res: Response){
        try {
          const data = await this.accionService.findAllAcciones();
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async getAccionById(req: Request, res: Response){
        const {ID} = req.params;
        try {
      const data = await this.accionService.findAccionById(parseInt(ID));
      if(data)
        res.status(200).json(data);
    else
        res.status(404).json();
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async updateAccion(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.accionService.updateAccion(parseInt(ID), req.body);
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    async deleteAccion(req: Request, res: Response){
        const {ID} = req.params;
        try {
            const data = await this.accionService.deleteAccion(parseInt(ID));
            res.status(200).json(data);
        } catch (e:any) {
            res.status(500).json({"error":e.message});            
        }
    }
    
        async filtrarAccion(req:Request,res:Response){
            const {id_tipo_accion,nombre_usuario,descripcion,fecha_limsup,fecha_liminf}=req.body;
            try {
                const data = await this.accionService.filtrarAccion(id_tipo_accion,descripcion,nombre_usuario,fecha_liminf,fecha_limsup);
                (data)?res.status(200).json(data):res.status(404).json("Not found");
            } catch (error:any) {
                res.status(500).json({"error":error.message});            

            }
        }
        async getAccionesPaginated(req: Request, res: Response) {
            const { page } = req.params;
            try {
              const data = await this.accionService.getAccionesPaginated(parseInt(page));
              (data) ? res.status(200).json(data) : res.status(404).json("Data not found");
            } catch (error: any) {
              res.status(500).json({ "error": error.message });
            }
          }
        async OrdenarAcciones(req:Request,res:Response){
            let{items,criterio,ascendente}=req.body
            try {
                console.log(typeof(ascendente))
                const data= OrdenarAccion(ascendente,items,criterio);
                (data)?res.status(200).json(data):res.status(404).json("no se puede ordenar");
            } catch (error:any) {
                res.status(500).json({"error":error.message})
            }
        }
    }