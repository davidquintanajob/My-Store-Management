import { IsNumber, IsInt, IsString } from "class-validator"
import { BaseDTO } from "../config/base.dto"

export class ProductoDto extends BaseDTO{

    @IsInt()
    id_producto!:number;

    @IsString()
    nombre!:string;

    @IsString()
    descripcion!:string;

    @IsString()
    Sku!:string

    @IsNumber()
    precio!:number

    @IsNumber()
    precio_empresa!:number
    
}