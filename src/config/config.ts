import * as dotenv from "dotenv";
export abstract class ConfigServer {
    
    constructor(){
        const nodeNameEnv = this.createPathEnv(this.nodeEnv);
        dotenv.config({
            path: nodeNameEnv,
        });
        
    }
    get nodeEnv (): string {
        return this.getEnvironment( "NODE_ENV")?.trim() || " ";
     }
     public getEnvironment(k: string): string | undefined{
        return process.env[k];
     }
         getNumberEnv(k: string): number{
         return Number(this.getEnvironment(k));
     }
         createPathEnv (path: string): string {
        const arrEnv: Array<string> = ["env "];
          if (path.length > 0){
          const stringToArray = path.split(".");
          arrEnv.unshift(...stringToArray);
          }
          return "." + arrEnv.join(".");
        }
         
}