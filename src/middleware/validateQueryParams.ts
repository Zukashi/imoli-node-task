import {validate, validateOrReject, ValidationError} from 'class-validator';
import { plainToClass } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';

export const validateQueryParams = <T extends  object>(type: new () => T) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = await validate(plainToClass(type, req.query), {
                whitelist:true,
                forbidUnknownValues:true
            });


            if (errors.length > 0) {
                const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
                return res.status(400).json({ error: message });
            }
            return next();
        } catch (errors) {
            return res.status(400).json({ errors });
        }
    };
};
