import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const validateBodyRequest = (joiSchema: Joi.ObjectSchema, req: Request, res: Response, next: NextFunction): void => {
  const { error } = joiSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  } else {
    next();
  }
};

export default validateBodyRequest;
