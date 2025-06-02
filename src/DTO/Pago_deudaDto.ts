import { IsNumber, IsDate ,IsInt} from "class-validator"
import { BaseDTO } from "../config/base.dto"

export class Pago_DeudaDto extends BaseDTO{

    @IsInt()
    id_pago_deuda!:number

    @IsNumber()
    pagada!:number

    @IsDate()
    fecha!:Date
}