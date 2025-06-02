"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagenRouter = void 0;
const ImagenController_1 = require("../controllers/ImagenController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class ImagenRouter extends router_1.BaseRouter {
    constructor() {
        super(ImagenController_1.ImagenController);
    }
    routes() {
        this.router.get('/Imagen', [jwt_config_1.verifyToken], (req, res) => this.controller.getImagen(req, res));
        // Imagen por id
        this.router.get('/Imagen/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.getImagenById(req, res));
        // adicionar Imagen
        this.router.post('/Imagen/createImagen', [jwt_config_1.verifyToken], (req, res) => { console.log("Llamamos a response, request"); this.controller.createImagen(req, res); });
        //modificar Imagen
        this.router.put('/Imagen/updateImagen/:ID', [jwt_config_1.verifyToken], (req, res) => this.controller.updateImagen(req, res));
        // eliminar Imagen
        this.router.delete('/Imagen/deleteImagen/:ID/:url', [jwt_config_1.verifyToken], (req, res) => this.controller.deleteImagen(req, res));
    }
}
exports.ImagenRouter = ImagenRouter;
