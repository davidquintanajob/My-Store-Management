import { IsInt,IsString } from "class-validator"
import { BaseDTO } from "../config/base.dto"
export class ImagenDto extends BaseDTO{

    @IsInt()
    id_imagen!:number;

    @IsString()
    url!:string

}