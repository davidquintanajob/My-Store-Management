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
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearArchivoSiNoExiste = crearArchivoSiNoExiste;
exports.escribirNumero = escribirNumero;
exports.leerNumero = leerNumero;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Método para crear el archivo con el número 330 por defecto si no existe
function crearArchivoSiNoExiste() {
    const execPath = process.pkg ? path.dirname(process.execPath) : __dirname;
    const filePath = path.join(execPath, 'Moneda.txt');
    if (!fs.existsSync(filePath)) {
        try {
            fs.writeFileSync(filePath, '330', { encoding: 'utf8', flag: 'w' });
            console.log('Archivo creado con el número 330 por defecto en:', filePath);
        }
        catch (err) {
            console.error('Error al crear el archivo:', err);
        }
    }
    else {
        console.log('El archivo ya existe:', filePath);
    }
}
// Método para escribir un nuevo número en el archivo
function escribirNumero(nuevoNumero) {
    const execPath = process.pkg ? path.dirname(process.execPath) : __dirname;
    const filePath = path.join(execPath, 'Moneda.txt');
    try {
        fs.writeFileSync(filePath, nuevoNumero.toString(), { encoding: 'utf8', flag: 'w' });
        console.log('Número escrito en el archivo con éxito:', nuevoNumero);
        return true;
    }
    catch (err) {
        console.error('Error al escribir en el archivo:', err);
        return false;
    }
}
// Método para leer el número del archivo
function leerNumero() {
    const execPath = process.pkg ? path.dirname(process.execPath) : __dirname;
    const filePath = path.join(execPath, 'Moneda.txt');
    try {
        const data = fs.readFileSync(filePath, { encoding: 'utf8' });
        const numero = parseInt(data, 10);
        if (isNaN(numero)) {
            console.error('El contenido del archivo no es un número válido.');
            return null;
        }
        console.log('Número leído del archivo con éxito:', numero);
        return numero;
    }
    catch (err) {
        console.error('Error al leer del archivo:', err);
        return null;
    }
}
