import { IsNumber, IsInt, IsBoolean } from "class-validator"
import { BaseDTO } from "../config/base.dto"

export class Rol_permisoDto extends BaseDTO{

    @IsInt()
    id_permiso!:number

    @IsInt()
    id_rol!:number
    
    @IsBoolean()
    tiene!:boolean

}