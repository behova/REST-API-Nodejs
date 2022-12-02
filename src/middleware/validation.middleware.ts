import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi from 'joi';

function validationMiddleware(
    schema: Joi.Schema,
    property: string,
): RequestHandler {
    return async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        const validationOptions = {
            abortEarly: false,
            allowUknown: true,
            stripUnknown: true,
        };
        try {
            if (property === 'body') {
                const value = await schema.validateAsync(
                    req.body,
                    validationOptions,
                );

                req.body = value;
            } else if (property === 'params') {
                const params = await schema.validateAsync(
                    req.params,
                    validationOptions,
                );

                req.params = params;
            }

            next();
        } catch (e: any | Joi.ValidationError) {
            const errors: string[] = [];
            e.details.forEach((error: Joi.ValidationErrorItem) => {
                errors.push(error.message);
            });
            res.status(400).send({ errors });
        }
    };
}

export default validationMiddleware;
