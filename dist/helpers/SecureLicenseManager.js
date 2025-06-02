"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureLicenseManager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
class SecureLicenseManager {
    // Verifica la licencia (devuelve false si no existe el archivo)
    static checkLicense() {
        if (!fs_1.default.existsSync(this.LICENSE_FILE)) {
            return {
                isValid: false,
                remainingDays: 0,
                message: 'Archivo de licencia no encontrado. Tiempo expirado.'
            };
        }
        try {
            // Leer y desencriptar el archivo
            const encryptedData = fs_1.default.readFileSync(this.LICENSE_FILE, 'utf8');
            const licenseData = this.decryptData(encryptedData);
            const now = new Date();
            const lastAccess = new Date(licenseData.lastAccess);
            // Calcular días transcurridos
            const daysPassed = Math.floor((now.getTime() - lastAccess.getTime()) / (1000 * 60 * 60 * 24));
            // Actualizar licencia si han pasado días
            if (daysPassed > 0) {
                licenseData.remainingDays = Math.max(0, licenseData.remainingDays - daysPassed);
                licenseData.lastAccess = now.toISOString();
                this.saveLicense(licenseData);
            }
            return {
                isValid: licenseData.remainingDays > 0,
                remainingDays: licenseData.remainingDays,
                message: licenseData.remainingDays > 0
                    ? `Días restantes: ${licenseData.remainingDays}`
                    : 'Licencia expirada. El servicio se detendrá.'
            };
        }
        catch (error) {
            return {
                isValid: false,
                remainingDays: 0,
                message: 'Licencia corrupta o inválida. Tiempo expirado.'
            };
        }
    }
    // Método para crear una nueva licencia (solo para uso interno/administrativo)
    static createNewLicense(days) {
        try {
            // Validar el parámetro days si fue proporcionado
            if (days !== undefined) {
                if (!Number.isInteger(days)) {
                    return {
                        success: false,
                        message: 'Error: El número de días debe ser un valor entero.'
                    };
                }
                if (days <= 0) {
                    return {
                        success: false,
                        message: 'Error: El número de días debe ser mayor a cero.'
                    };
                }
            }
            const newLicense = {
                initialDate: new Date().toISOString(),
                lastAccess: new Date().toISOString(),
                remainingDays: days !== undefined ? days : this.MAX_DAYS
            };
            this.saveLicense(newLicense);
            return {
                success: true,
                message: `Licencia creada exitosamente con ${newLicense.remainingDays} días de uso.`
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Error al crear la licencia: ' + error.message
            };
        }
    }
    // Encripta y guarda la licencia
    static saveLicense(data) {
        const encryptedData = this.encryptData(JSON.stringify(data));
        fs_1.default.writeFileSync(this.LICENSE_FILE, encryptedData);
    }
    // Métodos de encriptación
    static encryptData(text) {
        const cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(this.SECRET_KEY), Buffer.from(this.IV));
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }
    static decryptData(encryptedText) {
        const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', Buffer.from(this.SECRET_KEY), Buffer.from(this.IV));
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }
    // Método para ver información (solo para depuración)
    static getLicenseInfo() {
        if (!fs_1.default.existsSync(this.LICENSE_FILE))
            return null;
        try {
            const encryptedData = fs_1.default.readFileSync(this.LICENSE_FILE, 'utf8');
            return this.decryptData(encryptedData);
        }
        catch (_a) {
            return null;
        }
    }
}
exports.SecureLicenseManager = SecureLicenseManager;
SecureLicenseManager.LICENSE_FILE = path_1.default.join(process.cwd(), 'daily_license.lic');
SecureLicenseManager.MAX_DAYS = 30;
SecureLicenseManager.SECRET_KEY = 'clave_de_32_bytes_12345678901234'; // Cambia esto por una clave segura
SecureLicenseManager.IV = '1234567890123456'; // 16 bytes para AES-256-CBC
