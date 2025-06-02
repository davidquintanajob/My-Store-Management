import { Request, Response } from "express";
import { Pool } from "pg";

import dotenv from "dotenv";

dotenv.config();
const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
  });

export class MonedaController {
    async getMonedaByArchivo(req: Request, res: Response): Promise<void> {
        try {
          const resultado = await pool.query(
            "SELECT valor FROM moneda WHERE nombre = $1",
            ["USD"]
          );
          if (resultado.rows.length === 0) {
            throw new Error(`Moneda no encontrada`);
          }
          res.status(200).json(resultado.rows[0].valor);
        } catch (error) {
          res.status(404).json({ error: "Moneda no encontrada" });
        }
      }

  async updateMonedaByArchivo(req: Request, res: Response): Promise<void> {
    try {
      const valor = parseInt(req.params.valor);
      const resultado = await pool.query(
        "UPDATE moneda SET valor = $1 WHERE nombre = $2",
        [valor, "USD"]
      );
      if (resultado.rowCount === 0) {
        throw new Error(`Moneda no encontrada`);
      }
      res.status(200).json({ message: "Moneda actualizada" });
    } catch (error) {
      res.status(404).json({ error: "Moneda no encontrada" });
    }
  }
}
