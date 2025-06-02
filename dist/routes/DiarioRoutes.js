"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiarioRouter = void 0;
const DiarioController_1 = require("../controllers/DiarioController");
const router_1 = require("../config/router");
const jwt_config_1 = require("../config/jwt.config");
class DiarioRouter extends router_1.BaseRouter {
    constructor() {
        super(DiarioController_1.DiarioController);
    }
    routes() {
        this.router.get("/Diario", [jwt_config_1.verifyToken], (req, res) => this.controller.getDiario(req, res));
        this.router.get("/Diario/:ID", [jwt_config_1.verifyToken], (req, res) => this.controller.getDiarioById(req, res));
        this.router.post("/Diario/createDiario", [jwt_config_1.verifyToken], (req, res) => this.controller.createDiario(req, res));
        this.router.put("/Diario/updateDiario/:ID", [jwt_config_1.verifyToken], (req, res) => this.controller.updateDiario(req, res));
        this.router.delete("/Diario/deleteDiario/:ID", [jwt_config_1.verifyToken], (req, res) => this.controller.deleteDiario(req, res));
    }
}
exports.DiarioRouter = DiarioRouter;
