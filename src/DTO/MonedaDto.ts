import { IsNumber, IsString } from "class-validator";
import { BaseDTO } from "../config/base.dto";

export class MonedaDto extends BaseDTO{
    @IsString()
    id_moneda!:number;
    
    @IsNumber()
    valor!:number;

    @IsString()
    nombre!:string;
}