import { Response, Request } from "express";
import { UsuarioService } from "../services/UsuarioService";
import { generarJsonWebToken } from "../config/jwt.config";
import { Usuario } from "../entities/Usuario";
import { OrdenarUsuario } from "../helpers/Ordenar_criterios";

const bcryptjs = require("bcryptjs");

export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService = new UsuarioService()
  ) {}
  async createUsuario(req: Request, res: Response) {
    try {
      const data = await this.usuarioService.createUsuario(req.body);
      res.status(200).json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  async getUsuario(req: Request, res: Response) {
    try {
      const data = await this.usuarioService.findAllUsuarios();
      res.status(200).json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
  async getUsuarioById(req: Request, res: Response) {
    const { ID } = req.params;
    try {
      const data = await this.usuarioService.findUsuarioById(parseInt(ID));
      if (data) res.status(200).json(data);
      else res.status(404).json();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
  async updateUsuario(req: Request, res: Response) {
    const { ID } = req.params;
    try {
      const body = { ...req.body }; // Crear una copia del req.body
      if (body.carnet_identidad === "") {
        delete body.carnet_identidad; // Eliminar el parámetro si es vacío
      }
      const data = await this.usuarioService.updateUsuario(parseInt(ID), body);
      res.status(200).json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
  async deleteUsuario(req: Request, res: Response) {
    const { ID } = req.params;
    try {
      const data = await this.usuarioService.deleteUsuario(parseInt(ID));
      res.status(200).json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
  async authUser(req: Request, res: Response) {
    const { nombre_usuario } = req.body;
    const { contrasenna } = req.body;
    console.log(nombre_usuario);
    try {
      const data = await this.usuarioService.findUsuariobyUserName(
        nombre_usuario
      );
      if (data) {
        const { contrasenna: encrypt_password } = data;

        bcryptjs.compare(
          contrasenna,
          encrypt_password,
          (error: any, result: boolean) => {
            if (error) {
              console.log(
                "Ha ocurrido un error Usuario o contraseña incorrecta",
                error
              );
            } else if (result && data.activo) {
              const token = generarJsonWebToken({
                id_usuario: data.id_usuario,
                nombre: data.nombre,
              });
              console.log(data.rol);
              return res.status(200).json({
                id_usuario: data.id_usuario,
                nombre: data.nombre,
                nombre_usuario: data.nombre_usuario,
                msg: "Usuario encontrado",
                token: token,
                rol: data.rol,
                tienda: data.tienda,
              });
            }
            return res.status(404).json({
              msg: "Ha ocurrido un error Usuario o contraseña incorrecta",
            });
          }
        );
      } else {
        res.status(404).json({
          msg: "Usuario o contraseña incorrecto",
        });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
  async getPermisosEspeciales(req: Request, res: Response) {
    const { id_usuario } = req.params;
    try {
      const data = await this.usuarioService.PermisosbyUsuario(
        parseInt(id_usuario)
      );
      data
        ? res
            .status(200)
            .json({ "Permisos especiales": data.permisos_especiales })
        : res.status(404).json("usuario no encontrado");
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
  async PermisoEspecialUsuario(req: Request, res: Response) {
    const { id_usuario, id_permiso } = req.params;
    try {
      const data = await this.usuarioService.PermisoEspecialUsuario(
        parseInt(id_usuario),
        parseInt(id_permiso)
      );
      data != null
        ? res.status(200).json({ tiene: data })
        : res.status(404).json("Not found");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  async changePassword(req: Request, res: Response) {
    const {
      contrasenna_vieja,
      contrasenna_nueva1,
      contrasenna_nueva2,
      nombre_usuario,
    } = req.body;
    try {
      const data = await this.usuarioService.ChangePassword(
        contrasenna_vieja,
        contrasenna_nueva1,
        contrasenna_nueva2,
        nombre_usuario
      );
      data
        ? res.status(200).json({ sucess: data })
        : res.status(404).json({ sucess: data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  async filtrarUsuario(req: Request, res: Response) {
    const { nombre_usuario, email, telefono, id_rol, id_tienda } = req.body;
    try {
      const data: Usuario[] = await this.usuarioService.filtrarUsuario(
        nombre_usuario,
        email,
        telefono,
        id_rol,
        id_tienda
      );
      data
        ? res.status(200).json(
            data.map((usuario: Usuario) => {
              return {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                carnet_identidad: usuario.carnet_identidad,
                nombre_usuario: usuario.nombre_usuario,
                email: usuario.email,
                telefono: usuario.telefono,
                direccion: usuario.direccion,
                detalles_bancarios: usuario.detalles_bancarios,
                rol: usuario.rol,
                tienda: usuario.tienda,
              };
            })
          )
        : res.status(404).json("Not found");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  async OrdenarUsuarios(req: Request, res: Response) {
    let { items, criterio, ascendente } = req.body;
    try {
      console.log(typeof ascendente);
      const data = OrdenarUsuario(ascendente, items, criterio);
      data
        ? res.status(200).json(data)
        : res.status(404).json("no se puede ordenar");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  async obtenerUsuarioPermiso(req: Request, res: Response) {
    const { id_usuario, id_permiso } = req.params;
    try {
      const data = await this.usuarioService.obtenerUsuarioPermiso(
        parseInt(id_usuario),
        parseInt(id_permiso)
      );
      data != null
        ? res.status(200).json({ tiene: data })
        : res.status(404).json("Not found");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async recuperarContrasenna(req: Request, res: Response) {
    const { nombre_usuario } = req.params;
    try {
      const data = await this.usuarioService.recuperarContrasenna(
        nombre_usuario
      );
      data != null
        ? res.status(200).json({ enviado: data })
        : res.status(404).json("Usuario not found");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
