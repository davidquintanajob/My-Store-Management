"use strict";
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
exports.ImagenService = void 0;
const base_service_1 = require("../config/base.service");
const Imagen_1 = require("../entities/Imagen");
const TrataImagen_1 = require("../helpers/TrataImagen");
class ImagenService extends base_service_1.BaseService {
    constructor() {
        super(Imagen_1.Imagen);
    }
    // servicio para obtener todos los Imagens
    findAllImagenes() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).find();
        });
    }
    findImagenById(id_imagen) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).findOneBy({ id_imagen });
        });
    }
    // servicio para crear un Imagens
    createImagen(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uri, url, producto } = body;
            const auxiliarPath = 'C:\\Solutel_web_Imagenes';
            const uri1 = uri.uri;
            const imagen = {
                url: url,
                producto: producto
            };
            console.log(auxiliarPath);
            (0, TrataImagen_1.guardarImagen)(uri1, auxiliarPath, url);
            return (yield this.execRepository).save(imagen);
        });
    }
    deleteImagen(id, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const auxiliarPath = `C:\\Solutel_web_Imagenes`;
            console.log(auxiliarPath + "\\" + url);
            yield (0, TrataImagen_1.deleteImage)(auxiliarPath + "\\" + url);
            return (yield this.execRepository).delete(id);
        });
    }
    // actualizar un Imagens
    updateImagen(id, infoUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.execRepository).update(id, infoUpdate);
        });
    }
}
exports.ImagenService = ImagenService;
