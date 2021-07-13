import { Request, Response } from "express";
import { EntityManager } from "typeorm";
export interface MyContext {
    req: Request;
    res: Response;
    payload?: {userId: string, username: string}
    em: EntityManager
}