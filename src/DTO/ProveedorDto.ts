import { IsString, IsInt } from "class-validator"
import { BaseDTO } from "../config/base.dto"

export class ProveedorDto extends BaseDTO{
    @IsInt()
    id_proveedor!:number

    @IsString()
    nombre!:string

    @IsString()
    email!:string

    @IsString()
    direccion!:string

    @IsString()
    telefono!:string

    @IsString()
    nota!:string

    @IsString()
    Cif!:string

    @IsString()
    detalle_bancario!:string
}