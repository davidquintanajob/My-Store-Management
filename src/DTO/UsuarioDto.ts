import { IsString, IsInt, IsBoolean } from "class-validator"
import { BaseDTO } from "../config/base.dto"

export class UsuarioDto extends BaseDTO {

    @IsInt()
    id_usuario!:number

    @IsString()
    nombre!:string

    @IsString()
    nombre_usuario!:string

    @IsString()
    contrasenna!:string

    @IsString()
    email!:string

    @IsBoolean()
    activo!:boolean


    @IsString()
    telefono!:string

    @IsString()
    direccion!:string

    @IsString()
    carnet_identidad!:string

    @IsString()
    detalles_bancarios!:string

}