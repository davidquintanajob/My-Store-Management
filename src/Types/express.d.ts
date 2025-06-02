import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
    interface Request {
        user?: string | JwtPayload; // Ajusta el tipo según lo que decodifiques
    }
}