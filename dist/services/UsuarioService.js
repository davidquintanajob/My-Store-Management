"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = void 0;
const base_service_1 = require("../config/base.service");
const Usuario_1 = require("../entities/Usuario");
const Permiso_1 = require("../entities/Permiso");
const Rol_1 = require("../entities/Rol");
const Rol_permiso_1 = require("../entities/Rol_permiso");
const nodemailer = __importStar(require("nodemailer"));
const bcryptjs = require('bcryptjs');
class UsuarioService extends base_service_1.BaseService {
    constructor() {
        super(Usuario_1.Usuario);
    }
    // Usuario para obtener todos los Usuarios
    findAllUsuarios() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).find({ relations: ["permisos_especiales", "rol", "tienda"] });
        });
    }
    findUsuarioById(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Usuario")
                .leftJoinAndSelect("Usuario.tienda", "tienda")
                .leftJoinAndSelect("Usuario.rol", "rol")
                .where("Usuario.id_usuario=:id_usuario", { id_usuario })
                .getOne();
            //.findOneBy({ id_usuario });
        });
    }
    // Usuario para crear un Usuarios
    createUsuario(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = body;
            if (usuario.contrasenna) {
                const salt = bcryptjs.genSaltSync();
                usuario.contrasenna = bcryptjs.hashSync(body.contrasenna, salt);
            }
            return (yield this.execRepository).save(usuario);
        });
    }
    deleteUsuario(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).delete(id);
        });
    }
    // actualizar un Usuarios
    updateUsuario(id, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            const { contrasenna } = infoUpdate;
            if (contrasenna) {
                const salt = bcryptjs.genSaltSync();
                infoUpdate.contrasenna = bcryptjs.hashSync(infoUpdate.contrasenna, salt);
            }
            return (yield this.execRepository).update(id, infoUpdate);
        });
    }
    findUsuariobyUserName(nombre_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository)
                .createQueryBuilder("Usuario")
                .leftJoinAndSelect("Usuario.rol", "rol")
                .leftJoinAndSelect("Usuario.tienda", "tienda")
                .where("nombre_usuario =:nombre_usuario", { nombre_usuario })
                .getOne();
        });
    }
    PermisosbyUsuario(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).createQueryBuilder("Usuario")
                .leftJoinAndSelect("Usuario.permisos_especiales", "permisos")
                .where("Usuario.id_usuario =:id_usuario", { id_usuario })
                .getOne();
        });
    }
    PermisoEspecialUsuario(id_usuario, id_permiso) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield (yield this.execRepository)
                .createQueryBuilder("Usuario")
                .leftJoinAndSelect("Usuario.permisos_especiales", "permisos")
                .where("Usuario.id_usuario =:id_usuario", { id_usuario })
                .getOne();
            let tiene = false;
            usuario === null || usuario === void 0 ? void 0 : usuario.permisos_especiales.forEach((permiso) => {
                (permiso.id_permiso === id_permiso) ? tiene = true : tiene = false;
            });
            return tiene;
        });
    }
    ChangePassword(contrasenna_vieja, contrasenna_nueva1, contrasenna_nueva2, nombre_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield (yield this.execRepository)
                .createQueryBuilder("usuario")
                .where("usuario.nombre_usuario=:nombre_usuario", { nombre_usuario })
                .getOne();
            if (usuario && contrasenna_nueva1 === contrasenna_nueva2) {
                const { contrasenna: encrypt_password } = usuario;
                yield bcryptjs.compare(contrasenna_vieja, encrypt_password, (error, result) => __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        console.log("Ha ocurrido un error Usuario o contraseña incorrecta", error);
                        return false;
                    }
                    else if (result) {
                        const salt = bcryptjs.genSaltSync();
                        usuario.contrasenna = bcryptjs.hashSync(contrasenna_nueva1, salt);
                        yield (yield this.execRepository).save(usuario);
                        return true;
                    }
                }));
            }
            else
                return false;
        });
    }
    filtrarUsuario(nombre_usuario, email, telefono, id_rol, id_tienda) {
        return __awaiter(this, void 0, void 0, function* () {
            let usuarios = yield (yield this.execRepository)
                .createQueryBuilder("usuario")
                .leftJoinAndSelect("usuario.rol", "rol")
                .leftJoinAndSelect("usuario.tienda", "tienda")
                .getMany();
            const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            if (nombre_usuario) {
                const normalizednombre_usuario = normalizeString(nombre_usuario);
                usuarios = usuarios.filter((usuario) => normalizeString(usuario.nombre_usuario).toLowerCase().includes(normalizednombre_usuario));
            }
            if (email) {
                const normalizedemail = normalizeString(email);
                usuarios = usuarios.filter((usuario) => normalizeString(usuario.email).toLowerCase().includes(normalizedemail));
            }
            if (telefono) {
                const normalizedtelefono = normalizeString(telefono);
                usuarios = usuarios.filter((usuario) => normalizeString(usuario.telefono).toLowerCase().includes(normalizedtelefono));
            }
            if (id_rol) {
                usuarios = usuarios.filter((usuario) => usuario.rol.id_rol == id_rol);
            }
            if (id_tienda) {
                usuarios = usuarios.filter((usuario) => usuario.tienda.id_tienda == id_tienda);
            }
            return usuarios;
        });
    }
    obtenerUsuarioPermiso(id_usuario, id_permiso) {
        return __awaiter(this, void 0, void 0, function* () {
            let tiene = false;
            let usuario = yield (yield this.execRepository)
                .createQueryBuilder("u")
                .select("u.id_usuario")
                .addSelect("u.nombre")
                .innerJoinAndSelect(Rol_1.Rol, "r", "r.id_rol=u.id_rol")
                .innerJoinAndSelect(Rol_permiso_1.Rol_permiso, "rp", "r.id_rol=rp.id_rol")
                .innerJoinAndSelect(Permiso_1.Permiso, "p", "p.id_permiso=rp.id_permiso")
                .where("u.id_usuario=:id_usuario and p.id_permiso=:id_permiso", { id_usuario, id_permiso })
                .getRawOne();
            if (usuario) {
                if (usuario.rp_tiene) {
                    console.log(usuario.rp_tiene);
                    return true;
                }
            }
            else {
                const usuarioAux = yield (yield this.execRepository)
                    .createQueryBuilder("Usuario")
                    .leftJoinAndSelect("Usuario.permisos_especiales", "pe")
                    .where("Usuario.id_usuario=:id_usuario", { id_usuario })
                    .getOne();
                if (usuarioAux) {
                    usuarioAux.permisos_especiales.forEach((permiso) => {
                        if (permiso.id_permiso == id_permiso) {
                            tiene = true;
                        }
                    });
                }
            }
            return tiene;
        });
    }
    recuperarContrasenna(nombre_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            let usuario = yield (yield this.execRepository).findOneBy({ nombre_usuario });
            if (usuario) {
                const contrasenna = "" + Math.floor(10000000 + Math.random() * 90000000);
                const salt = bcryptjs.genSaltSync();
                usuario.contrasenna = bcryptjs.hashSync(contrasenna, salt);
                yield (yield this.execRepository).save(usuario);
                // Configurar el transporte de Nodemailer
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'solutelinformaciones@gmail.com', // tu correo electrónico
                        pass: 'gzzx clji fhjn wlna' // contraseña de la aplicación generada
                    }
                });
                const mailOptions = { from: 'solutelinformaciones@gmail.com',
                    to: usuario.email,
                    subject: 'nueva contraseña',
                    text: `Hola, aquí tienes tu nueva contraseña cámbiela una vez iniciada sesión: ${contrasenna}`,
                };
                try { // Enviar el correo
                    yield transporter.sendMail(mailOptions);
                    console.log('Correo enviado correctamente');
                    return true;
                }
                catch (error) {
                    console.error('Error al enviar el correo:', error);
                    return null;
                }
            }
            else
                return false;
        });
    }
}
exports.UsuarioService = UsuarioService;
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
