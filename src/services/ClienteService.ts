import { DeleteResult, UpdateResult } from "typeorm";
import { BaseService } from "../config/base.service";
import { ClienteDto } from "../DTO/ClienteDto";
import { Cliente } from "../entities/Cliente";

export class ClienteService extends BaseService<Cliente> {
   
    constructor(){
        super(Cliente);
    }
	// servicio para obtener todos los Clientes

    async findAllClientees():Promise<Cliente[]> {
        return (await this.execRepository).find();
    }
    async findClienteById(id_cliente: number): Promise<Cliente | null> {
        return (await this.execRepository).findOneBy({ id_cliente });
      }
    // servicio para crear un Clientes
 async createCliente(body: ClienteDto): Promise<Cliente>{
        return (await this.execRepository).save(body);
    }

    async deleteCliente(id: number): Promise<DeleteResult>{
        return (await this.execRepository).delete(id);
    }
    // actualizar un Clientes
   async updateCliente(id: number, infoUpdate: ClienteDto): Promise<UpdateResult>{
    return (await this.execRepository).update(id, infoUpdate);
    }
    async filtrarCliente(nombre:string|null,cif:string|null,telefono:string|null,detalles_bancarios:string|null){
        let clientes:Cliente[]=await(await this.execRepository)
        .createQueryBuilder("Cliente")
        .getMany()
        const normalizeString = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();


        if(nombre){
            const normalizedNombre = normalizeString(nombre);
            clientes = clientes.filter((cliente: Cliente) => normalizeString(cliente.nombre).includes(normalizedNombre));
       }

       if(cif){
        const normalizedcif = normalizeString(cif);
        clientes = clientes.filter((cliente: Cliente) => normalizeString(cliente.Cif).includes(normalizedcif));
   }
       if(telefono){
    const normalizedNombre = normalizeString(telefono);
    clientes = clientes.filter((cliente: Cliente) => normalizeString(cliente.telefono).includes(normalizedNombre));
    }
        if(detalles_bancarios){
    const normalizedNombre = normalizeString(detalles_bancarios);
    clientes = clientes.filter((cliente: Cliente) => normalizeString(cliente.detalles_bancarios).includes(normalizedNombre));
    }

    return clientes;
    }
}
