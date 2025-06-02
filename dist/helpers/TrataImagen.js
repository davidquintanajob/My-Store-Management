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
exports.crearRutaSiNoExiste = crearRutaSiNoExiste;
exports.guardarImagen = guardarImagen;
exports.deleteImage = deleteImage;
const fs = require('fs');
const path = require('path');
const fs_1 = require("fs");
const util_1 = require("util");
/*
 * Guarda una imagen en una ruta específica con un nombre personalizado.
 * @param {string} base64Image - La cadena base64 de la imagen.
 * @param {string} outputDir - El directorio donde se guardará la imagen.
 * @param {string} fileName - El nombre que se le dará al archivo de imagen (incluyendo la extensión).
*/
function crearRutaSiNoExiste(ruta) {
    if (!fs.existsSync(ruta)) {
        try {
            fs.mkdirSync(ruta, { recursive: true });
            console.log('Directorio creado con éxito:', ruta);
        }
        catch (err) {
            console.error('Error al crear el directorio:', err);
        }
    }
    else {
        console.log('El directorio ya existe:', ruta);
    }
}
function guardarImagen(base64Image, outputDir, fileName) {
    // Asegúrate de que el URI contenga el prefijo "data:image/png;base64," o similar
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    // Decodificar la cadena base64
    const buffer = Buffer.from(base64Data, 'base64');
    // Crear la ruta completa del archivo usando el nombre proporcionado
    const outputPath = path.join(outputDir, fileName);
    // Verificar si la carpeta de destino existe, si no, crearla
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    // Escribir el buffer en el archivo
    fs.writeFile(outputPath, buffer, (err) => {
        if (err) {
            console.error('Error al guardar la imagen:', err);
        }
        else {
            console.log('Imagen guardada con éxito en:', outputPath);
        }
    });
}
const unlinkAsync = (0, util_1.promisify)(fs_1.unlink);
function deleteImage(imagePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield unlinkAsync(imagePath);
            console.log(`Imagen en ${imagePath} borrada exitosamente.`);
        }
        catch (error) {
            console.error(`Error al borrar la imagen en ${imagePath}:`, error);
            throw error;
        }
    });
}
// Guardar la imagen utilizando rutas relativas al ejecutable
// Guardar la imagen utilizando rutas relativas al ejecutable
/*export function guardarImagen(base64Image: any, outputDir: string, fileName: string) {
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Obtener la ruta del ejecutable real
    const execPath = process.pkg ? path.dirname(process.execPath) : __dirname;

    // Construir la ruta completa del archivo
    const outputPath = path.join(execPath, outputDir, fileName);

    // Verificar si la carpeta de destino existe, si no, crearla
    if (!fs.existsSync(path.dirname(outputPath))) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    // Escribir el buffer en el archivo
    fs.writeFile(outputPath, buffer, (err: any) => {
        if (err) {
            console.error('Error al guardar la imagen:', err);
        } else {
            console.log('Imagen guardada con éxito en:', outputPath);
        }
    });
}*/
