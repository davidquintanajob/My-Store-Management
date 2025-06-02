// src/controllers/DiarioController.ts
import { Response, Request } from "express";
import { DiarioService } from "../services/DiarioService";

export class DiarioController {
  constructor(private readonly diarioService: DiarioService = new DiarioService()) {}

  async createDiario(req: Request, res: Response) {
    try {
      const data = await this.diarioService.createDiario(req.body);
      res.status(200).json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  async getDiario(req: Request, res: Response) {
    try {
      const data = await this.diarioService.findAllDiaros();
      res.status(200).json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  async getDiarioById(req: Request, res: Response) {
    const { ID } = req.params;
    try {
      const data = await this.diarioService.findDiarioById(parseInt(ID));
      if (data) res.status(200).json(data);
      else res.status(404).json();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  async updateDiario(req: Request, res: Response) {
    const { ID } = req.params;
    try {
      const data = await this.diarioService.updateDiario(parseInt(ID), req.body);
      res.status(200).json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  async deleteDiario(req: Request, res: Response) {
    const { ID } = req.params;
    try {
      const data = await this.diarioService.deleteDiario(parseInt(ID));
      res.status(200).json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
}