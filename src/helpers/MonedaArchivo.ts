import * as fs from 'fs';
import * as path from 'path';

// Método para crear el archivo con el número 330 por defecto si no existe
export function crearArchivoSiNoExiste() {
    const execPath = process.pkg ? path.dirname(process.execPath) : __dirname;
    const filePath = path.join(execPath, 'Moneda.txt');

    if (!fs.existsSync(filePath)) {
        try {
            fs.writeFileSync(filePath, '330', { encoding: 'utf8', flag: 'w' });
            console.log('Archivo creado con el número 330 por defecto en:', filePath);
        } catch (err) {
            console.error('Error al crear el archivo:', err);
        }
    } else {
        console.log('El archivo ya existe:', filePath);
    }
}

// Método para escribir un nuevo número en el archivo
export function escribirNumero(nuevoNumero: number) {
    const execPath = process.pkg ? path.dirname(process.execPath) : __dirname;
    const filePath = path.join(execPath, 'Moneda.txt');

    try {
        fs.writeFileSync(filePath, nuevoNumero.toString(), { encoding: 'utf8', flag: 'w' });
        console.log('Número escrito en el archivo con éxito:', nuevoNumero);
        return true;
    } catch (err) {
        console.error('Error al escribir en el archivo:', err);
        return false;
    }
}

// Método para leer el número del archivo
export function leerNumero(): number | null {
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
    } catch (err) {
        console.error('Error al leer del archivo:', err);
        return null;
    }
}
