import { IsString } from "class-validator";
import { BaseDTO } from "../config/base.dto";
export class ClienteDto extends BaseDTO{
    
    @IsString()
    nombre!:string

    @IsString()
    Cif!:string

    @IsString()
    detalles_bancarios!:string

    @IsString()
    nota!:string
    
    @IsString()
    email!:string

    @IsString()
    telefono!:string

    @IsString()
    descripcion!:string
}