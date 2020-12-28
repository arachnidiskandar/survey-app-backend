import { Router } from 'express';
import Joi from 'joi';

import controller from '@controllers/survey';
import verifyAuthorization from '@middlewares/authMiddleware';
import validateBodyRequest from '@middlewares/bodyValidation';

const surveyRoutes = Router();

surveyRoutes.post(
  '',
  verifyAuthorization,
  (req, res, next) => {
    const questionSchema = Joi.object({
      title: Joi.string().required().label('Question Title'),
      questionType: Joi.string()
        .valid('MULTIPLE CHOICE', 'MULTIPLE SELECT', 'OPEN TEXT', 'YES OR NO')
        .label('Question Type'),
      choices: Joi.when('questionType', {
        is: Joi.string().valid('OPEN TEXT', 'YES OR NO'),
        then: Joi.forbidden(),
        otherwise: Joi.array().min(2).items(Joi.string()).required(),
      }),
    });
    const surveySchema = Joi.object({
      title: Joi.string().required().label('Survey Title'),
      coordinator: Joi.required().label('Coordinator'),
      questions: Joi.array().required().items(questionSchema).min(1).label('Questions'),
      availableToAnyone: Joi.boolean().required().label('Available to Anyone'),
    });
    validateBodyRequest(surveySchema, req, res, next);
  },
  controller.createSurvey
);
surveyRoutes.delete('/:id', verifyAuthorization, controller.deleteSurvey);

export default surveyRoutes;
