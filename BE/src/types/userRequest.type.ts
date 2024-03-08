import { Request, Response, NextFunction } from 'express';
import {PartialUserUpdate} from "../controllers/user.controller";

export type UserUpdate = (
    req: Request<{}, {}, PartialUserUpdate>, // {} for ParamsDictionary if not using params, PartialUserUpdate for the body type
    res: Response,
    next: NextFunction
) => Promise<void> | void;