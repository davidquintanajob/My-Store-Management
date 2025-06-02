"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SecureLicenseManager_1 = require("./SecureLicenseManager");
const readline_1 = __importDefault(require("readline"));
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log('Herramienta de Administración de Licencia\n');
const menu = () => {
    rl.question('¿Qué acción deseas realizar?\n' +
        '1. Crear nueva licencia (30 días por defecto)\n' +
        '2. Crear licencia con días personalizados\n' +
        '3. Ver estado actual\n' +
        '> ', (answer) => {
        switch (answer) {
            case '1':
                const result = SecureLicenseManager_1.SecureLicenseManager.createNewLicense();
                console.log(result.message);
                rl.close();
                break;
            case '2':
                rl.question('\nIngrese el número de días para la licencia: ', (daysInput) => {
                    const days = parseInt(daysInput);
                    if (isNaN(days) || days <= 0) {
                        console.log('Error: Debe ingresar un número entero positivo.');
                        rl.close();
                        return;
                    }
                    const customResult = SecureLicenseManager_1.SecureLicenseManager.createNewLicense(days);
                    console.log(customResult.message);
                    rl.close();
                });
                break;
            case '3':
                const info = SecureLicenseManager_1.SecureLicenseManager.getLicenseInfo();
                if (info) {
                    console.log('\nInformación de Licencia:');
                    console.log(`- Fecha inicial: ${info.initialDate}`);
                    console.log(`- Último acceso: ${info.lastAccess}`);
                    console.log(`- Días restantes: ${info.remainingDays}`);
                }
                else {
                    console.log('No se encontró licencia válida.');
                }
                rl.close();
                break;
            default:
                console.log('Opción no válida.');
                rl.close();
        }
    });
};
menu();
