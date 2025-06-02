import { BaseEntity, EntityTarget, ObjectLiteral, Repository } from "typeorm";
//import { BaseEntity }  from "./base.entity";
import { ConfigServer } from "./config";
import connectDB from "./ormconfig";
export class BaseService<T extends BaseEntity> extends ConfigServer{
    public execRepository: Promise<Repository<T>>
    constructor(private getEntity: EntityTarget<T>){
        super();
        this.execRepository = this.initRepository(getEntity);
    }
    async initRepository<T extends ObjectLiteral>(e: EntityTarget<T>): Promise<Repository<T>> {
        return connectDB.getRepository(e);
    }
}