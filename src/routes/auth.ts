import { Router } from 'express';
import Joi from 'joi';

import controller from '@controllers/auth';
import validateBodyRequest from '@middlewares/bodyValidation';

const authRoutes = Router();

authRoutes.post(
  '/signup',
  (req, res, next) => {
    const userSchema = Joi.object({
      name: Joi.string().required().label('Name'),
      email: Joi.string().email().required().label('Email'),
      password: Joi.string().length(6).required().label('Password'),
      confirmPass: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' }),
      coordinator: Joi.boolean().required(),
    });
    validateBodyRequest(userSchema, req, res, next);
  },
  controller.signUp
);
authRoutes.post('/login', controller.login);

export default authRoutes;
