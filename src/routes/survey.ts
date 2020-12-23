import express from 'express';
import Joi from 'joi';

import controller from '@controllers/survey';
import validateBodyRequest from '@middlewares/bodyValidation';

const surveyRoutes = express.Router();

surveyRoutes.get('', controller.getAllSurveys);
surveyRoutes.post(
  '',
  (req, res, next) => {
    const questionSchema = Joi.object({
      title: Joi.string().required(),
      questionType: Joi.string().valid('MULTIPLE CHOICE', 'MULTIPLE SELECT', 'OPEN TEXT', 'YES OR NO'),
      choices: Joi.when('questionType', {
        is: Joi.string().valid('OPEN TEXT', 'YES OR NO'),
        then: Joi.forbidden(),
        otherwise: Joi.array().min(2).items(Joi.string()).required(),
      }),
    });
    const surveySchema = Joi.object({
      title: Joi.string().required(),
      coordinator: Joi.required(),
      questions: Joi.array().items(questionSchema),
      availableToAnyone: Joi.boolean().required(),
    });
    validateBodyRequest(surveySchema, req, res, next);
  },
  controller.createSurvey
);

export default surveyRoutes;
