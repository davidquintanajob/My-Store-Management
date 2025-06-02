/*const concurrently = require('concurrently');
const path = require('path');
const execPath = process.execPath;
const imagePath = path.join(path.dirname(execPath), 'Imagenes');

concurrently([
    { command: 'tsc && node dist/server.js', name: 'server' },
    { command: `cd ${imagePath} && http-server -p 8080`, name: 'images' }
], {
    prefix: 'name',
    killOthers: ['failure', 'success'],
    restartTries: 3
}).then(success, failure);

function success() {
    console.log('Both processes running successfully.');
}

function failure() {
    console.error('One of the processes failed.');
}*/
const { exec } = require('child_process'); // Solo una declaración
const fs = require('fs');
const path = './Imagenes';

// Crear la carpeta "Imagenes" si no existe
if (!fs.existsSync(path)){
    fs.mkdirSync(path);
}

// Comandos a ejecutar
const commands = [
];

// Ejecutar los comandos en paralelo
commands.forEach(command => {
    const child = exec(command, { shell: true });

    child.stdout.on('data', (data) => {
        console.log(`[${child.pid}] ${data}`);
    });

    child.stderr.on('data', (data) => {
        console.error(`[${child.pid}] Error: ${data}`);
    });

    child.on('close', (code) => {
        console.log(`[${child.pid}] Proceso finalizado con código ${code}`);
    });
});

// Mantener la terminal abierta
process.stdin.resume();
