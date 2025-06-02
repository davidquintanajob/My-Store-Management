import { IsNumber, IsInt, IsString } from "class-validator"
import { BaseDTO } from "../config/base.dto"

export class PermisoDto extends BaseDTO{

    @IsInt()
    id_permiso!:number

    @IsString()
    descripcion!:string

    @IsString()
    nombre_permiso!:string
    
}