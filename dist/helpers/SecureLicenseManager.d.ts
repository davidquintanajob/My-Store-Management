export declare class SecureLicenseManager {
    private static LICENSE_FILE;
    private static MAX_DAYS;
    private static SECRET_KEY;
    private static IV;
    static checkLicense(): {
        isValid: boolean;
        remainingDays: number;
        message: string;
    };
    static createNewLicense(days?: number): {
        success: boolean;
        message: string;
    };
    private static saveLicense;
    private static encryptData;
    private static decryptData;
    static getLicenseInfo(): any;
}
