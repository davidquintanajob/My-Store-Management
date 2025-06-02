import { IsString, IsInt } from "class-validator"
import { BaseDTO } from "../config/base.dto"

export class RolDto extends BaseDTO{

        @IsInt()
        id_rol!:number
    
        @IsString()
        nombre!:string
}