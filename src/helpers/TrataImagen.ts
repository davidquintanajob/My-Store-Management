const fs = require('fs');
const path = require('path');
import { unlink } from 'fs';
import { promisify } from 'util';

/*
 * Guarda una imagen en una ruta específica con un nombre personalizado.
 * @param {string} base64Image - La cadena base64 de la imagen.
 * @param {string} outputDir - El directorio donde se guardará la imagen.
 * @param {string} fileName - El nombre que se le dará al archivo de imagen (incluyendo la extensión).
*/
export function crearRutaSiNoExiste(ruta: string) { 
  if (!fs.existsSync(ruta)) {
     try { 
      fs.mkdirSync(ruta, { recursive: true });
       console.log('Directorio creado con éxito:', ruta);
       } catch (err) { 
        console.error('Error al crear el directorio:', err); 
      } } else {
         console.log('El directorio ya existe:', ruta);
         } 
        }
export function guardarImagen(base64Image: any, outputDir: string, fileName: string) {
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
  fs.writeFile(outputPath, buffer, (err: any) => {
    if (err) {
      console.error('Error al guardar la imagen:', err);
    } else {
      console.log('Imagen guardada con éxito en:', outputPath);
    }
  });
}
const unlinkAsync = promisify(unlink);

export async function deleteImage(imagePath: string): Promise<void> {
    try {
        await unlinkAsync(imagePath);
        console.log(`Imagen en ${imagePath} borrada exitosamente.`);
    } catch (error) {
        console.error(`Error al borrar la imagen en ${imagePath}:`, error);
        throw error;
    }
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
