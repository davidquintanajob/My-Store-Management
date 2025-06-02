// src/routes/DiarioRoutes.ts
import { Request, Response } from "express";
import { DiarioController } from "../controllers/DiarioController";
import { BaseRouter } from "../config/router";
import { verifyToken } from "../config/jwt.config";

export class DiarioRouter extends BaseRouter<DiarioController> {
  constructor() {
    super(DiarioController);
  }

  routes(): void {
    this.router.get("/Diario", [verifyToken], (req: Request, res: Response) =>
      this.controller.getDiario(req, res)
    );

    this.router.get("/Diario/:ID", [verifyToken], (req: Request, res: Response) =>
      this.controller.getDiarioById(req, res)
    );

    this.router.post("/Diario/createDiario", [verifyToken], (req: Request, res: Response) =>
      this.controller.createDiario(req, res)
    );

    this.router.put("/Diario/updateDiario/:ID", [verifyToken], (req: Request, res: Response) =>
      this.controller.updateDiario(req, res)
    );

    this.router.delete("/Diario/deleteDiario/:ID", [verifyToken], (req: Request, res: Response) =>
      this.controller.deleteDiario(req, res)
    );
  }
}