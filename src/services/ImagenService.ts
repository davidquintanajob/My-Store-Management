import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { ImagenDto } from "../DTO/ImagenDto";
import { Imagen } from "../entities/Imagen";
import { guardarImagen,deleteImage } from "../helpers/TrataImagen";
import path from 'path';

export class ImagenService extends BaseService<Imagen> {
   
    constructor(){
        super(Imagen);
    }
	// servicio para obtener todos los Imagens

    async findAllImagenes():Promise<Imagen[]> {
        return (await this.execRepository).find();
    }
    async findImagenById(id_imagen: number): Promise<Imagen | null> {
        return (await this.execRepository).findOneBy({ id_imagen });
      }
    // servicio para crear un Imagens
 async createImagen(body: any): Promise<Imagen>{
    const{uri,url,producto}=body;
    const auxiliarPath ='C:\\Solutel_web_Imagenes';
    const uri1=uri.uri;
    const imagen:any={
        url:url,
        producto:producto
    }
    console.log(auxiliarPath);
    
    guardarImagen(uri1,auxiliarPath,url);

        return (await this.execRepository).save(imagen);
    }

    async deleteImagen(id: number,url:string): Promise<DeleteResult>{
        const auxiliarPath = `C:\\Solutel_web_Imagenes`;

        console.log(auxiliarPath+"\\"+url);
        
       await deleteImage(auxiliarPath+"\\"+url);
        return (await this.execRepository).delete(id);
    }
    // actualizar un Imagens
   async updateImagen(id: number, infoUpdate: ImagenDto): Promise<UpdateResult>{
    return (await this.execRepository).update(id, infoUpdate);
    }
}
