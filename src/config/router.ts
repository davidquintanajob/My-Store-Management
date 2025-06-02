
import { Router } from "express";
import { verifyToken } from "./jwt.config";
export class BaseRouter<T>{
    public router:Router;
    public controller:T

    constructor(TController:{new():T}){
        this.router=Router();
        this.controller=new TController();
        this.routes();
    }
    routes():void{
    }
}