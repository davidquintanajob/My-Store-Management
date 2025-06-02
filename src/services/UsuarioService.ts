import { BaseService } from "../config/base.service";
import { UsuarioDto } from "../DTO/UsuarioDto";
import { Usuario } from '../entities/Usuario';
import { Permiso } from '../entities/Permiso';
import { DeleteResult, UpdateResult } from "typeorm";
import { Rol } from "../entities/Rol";
import { Rol_permiso } from "../entities/Rol_permiso";
import * as nodemailer from "nodemailer";

const bcryptjs = require('bcryptjs');
export class UsuarioService extends BaseService<Usuario> {
   
    constructor(){
        super(Usuario);
    }
	// Usuario para obtener todos los Usuarios

    async findAllUsuarios():Promise<Usuario[]> {
        return (await this.execRepository).find({relations:["permisos_especiales","rol","tienda"]});
    }
    async findUsuarioById(id_usuario: number): Promise<Usuario | null> {
        return (await this.execRepository)
        .createQueryBuilder("Usuario")
        .leftJoinAndSelect("Usuario.tienda","tienda")
        .leftJoinAndSelect("Usuario.rol","rol")
        .where("Usuario.id_usuario=:id_usuario",{id_usuario})
        .getOne()
        //.findOneBy({ id_usuario });
      }
    // Usuario para crear un Usuarios
 async createUsuario(body: UsuarioDto): Promise<Usuario>{
    const usuario=body;
    if(usuario.contrasenna){
        const salt = bcryptjs.genSaltSync();
        usuario.contrasenna = bcryptjs.hashSync( body.contrasenna, salt );
    }
        return (await this.execRepository).save(usuario);
    
    }

    async deleteUsuario(id: number): Promise<DeleteResult>{
        return (await this.execRepository).delete(id);
    }
    // actualizar un Usuarios
   async updateUsuario(id: number, infoUpdate: UsuarioDto): Promise<UpdateResult>{
    const {contrasenna}=infoUpdate
    if(contrasenna){
        const salt = bcryptjs.genSaltSync();
        infoUpdate.contrasenna = bcryptjs.hashSync( infoUpdate.contrasenna, salt );
    }
    return (await this.execRepository).update(id, infoUpdate);
    }

    async findUsuariobyUserName(nombre_usuario:string){
        return (await this.execRepository)
        .createQueryBuilder("Usuario")
        .leftJoinAndSelect("Usuario.rol","rol")
        .leftJoinAndSelect("Usuario.tienda","tienda")
        .where("nombre_usuario =:nombre_usuario",{nombre_usuario})
        .getOne();

    }

    async PermisosbyUsuario(id_usuario:number){
        return (await this.execRepository).createQueryBuilder("Usuario")
        .leftJoinAndSelect("Usuario.permisos_especiales","permisos")
        .where("Usuario.id_usuario =:id_usuario",{id_usuario})
        .getOne()
    }
    async PermisoEspecialUsuario(id_usuario:number,id_permiso:number){
        const usuario=await(await this.execRepository)
        .createQueryBuilder("Usuario")
        .leftJoinAndSelect("Usuario.permisos_especiales","permisos")
        .where("Usuario.id_usuario =:id_usuario",{id_usuario})
        .getOne()
        let tiene:boolean=false;
    usuario?.permisos_especiales.forEach((permiso:Permiso) => {
             (permiso.id_permiso===id_permiso)?tiene=true:tiene=false;
    })
    return tiene;
    }
    async ChangePassword(contrasenna_vieja:string,contrasenna_nueva1:string,contrasenna_nueva2:string,nombre_usuario:string){
        const usuario=await(await this.execRepository)
        .createQueryBuilder("usuario")
        .where("usuario.nombre_usuario=:nombre_usuario",{nombre_usuario})
        .getOne()

        if(usuario&&contrasenna_nueva1===contrasenna_nueva2){
            const{contrasenna:encrypt_password}=usuario
          await  bcryptjs.compare(contrasenna_vieja,encrypt_password,async(error:any,result:boolean)=>{
                if(error){
                    console.log("Ha ocurrido un error Usuario o contraseña incorrecta",error)
                return false;                    
                }else if(result){
                    const salt = bcryptjs.genSaltSync();
                    usuario.contrasenna = bcryptjs.hashSync( contrasenna_nueva1, salt );
                     await (await this.execRepository).save(usuario);
                     return true;

                    }
                })
        }else 
        return false;
    }
    async filtrarUsuario(nombre_usuario:string|null,email:string|null,telefono:string|null,id_rol:number|null,id_tienda:number|null){
        let usuarios:Usuario[]=await(await this.execRepository)
        .createQueryBuilder("usuario")
        .leftJoinAndSelect("usuario.rol","rol")
        .leftJoinAndSelect("usuario.tienda","tienda")
        .getMany();

        const normalizeString = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        if(nombre_usuario){
            const normalizednombre_usuario = normalizeString(nombre_usuario);
            usuarios= usuarios.filter((usuario:Usuario)=>normalizeString(usuario.nombre_usuario).toLowerCase().includes(normalizednombre_usuario))

        }
        if(email){
            const normalizedemail = normalizeString(email);
        usuarios= usuarios.filter((usuario:Usuario)=>normalizeString(usuario.email).toLowerCase().includes(normalizedemail))
    }
        if(telefono){
            const normalizedtelefono = normalizeString(telefono);
            usuarios= usuarios.filter((usuario:Usuario)=>normalizeString(usuario.telefono).toLowerCase().includes(normalizedtelefono))

        }
        if(id_rol){
            usuarios=usuarios.filter((usuario:Usuario)=>usuario.rol.id_rol==id_rol)
        }
        if(id_tienda){
            usuarios=usuarios.filter((usuario:Usuario)=>usuario.tienda.id_tienda==id_tienda)
        }
        return usuarios;
        }
        async obtenerUsuarioPermiso(id_usuario:number,id_permiso:number){
            let tiene:boolean=false;
            let usuario:any|null=await(await this.execRepository)
            .createQueryBuilder("u")
            .select("u.id_usuario")
            .addSelect("u.nombre")
            .innerJoinAndSelect(Rol,"r","r.id_rol=u.id_rol")
            .innerJoinAndSelect(Rol_permiso,"rp","r.id_rol=rp.id_rol")
            .innerJoinAndSelect(Permiso,"p","p.id_permiso=rp.id_permiso")
            .where("u.id_usuario=:id_usuario and p.id_permiso=:id_permiso",{id_usuario,id_permiso})
            .getRawOne();
           
            if(usuario){
                if(usuario.rp_tiene){
                    console.log(usuario.rp_tiene);
                    return true;

                }
            }else{
                const usuarioAux:Usuario|null=await (await this.execRepository)
                .createQueryBuilder("Usuario")
                .leftJoinAndSelect("Usuario.permisos_especiales","pe")
                .where("Usuario.id_usuario=:id_usuario",{id_usuario})
                .getOne()
                if(usuarioAux){
                    usuarioAux.permisos_especiales.forEach((permiso:Permiso)=>{
                        if(permiso.id_permiso==id_permiso){
                            tiene= true;
                        }
                    })
                }
            }
            return tiene;
            }
            async recuperarContrasenna(nombre_usuario:string){
                let usuario:Usuario|null=await (await this.execRepository).findOneBy({nombre_usuario});
                if(usuario){
                    const contrasenna:string=""+Math.floor(10000000 + Math.random() * 90000000);
                    const salt = bcryptjs.genSaltSync();
                    usuario.contrasenna = bcryptjs.hashSync( contrasenna, salt );
                    await (await this.execRepository).save(usuario);
                // Configurar el transporte de Nodemailer
                let transporter = nodemailer.createTransport({
                    host:"smtp.gmail.com",
                    port:465,
                    secure:true,
                    auth: {
                        user: 'solutelinformaciones@gmail.com', // tu correo electrónico
                        pass: 'gzzx clji fhjn wlna' // contraseña de la aplicación generada
                    }
                });
                          const mailOptions = { from: 'solutelinformaciones@gmail.com',
                             to: usuario.email,
                              subject: 'nueva contraseña', 
                              text: `Hola, aquí tienes tu nueva contraseña cámbiela una vez iniciada sesión: ${contrasenna}`
                          , };
                          try { // Enviar el correo
                               await transporter.sendMail(mailOptions);
                                console.log('Correo enviado correctamente'); 
                                return true;
                              } catch (error) { 
                                  console.error('Error al enviar el correo:', error); 
                                  return null;
                              } 
                          }else 
                          return false;
                }
            } 
               
/*import nodemailer from 'nodemailer';

async function sendEmail() {
    // Configura el transporte del correo
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'tucorreo@gmail.com', // tu correo electrónico
            pass: 'tucontraseñadeaplicación' // contraseña de la aplicación generada
        }
    });

    // Configura el mensaje de correo
    let mailOptions = {
        from: 'tucorreo@gmail.com',
        to: 'destinatario@gmail.com',
        subject: 'Asunto del correo',
        text: 'Hola, este es un mensaje enviado desde TypeScript usando Nodemailer.'
    };

    try {
        // Envía el correo
        let info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado: %s', info.messageId);
    } catch (error) {
        console.error('Error al enviar el correo: %s', error);
    }
}

// Llama a la función para enviar el correo
sendEmail();
 */