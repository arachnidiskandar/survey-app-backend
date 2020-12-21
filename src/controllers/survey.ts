import { Request, Response } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';

import Survey from '@models/survey';

const getAllSurveys = (req: Request, res: Response): void => {
  Survey.find()
    .exec()
    .then((results) => res.status(200).json({ surveys: results }))
    .catch((error) => res.status(500).json({ message: error.message, error }));
};

const createSurvey = (req: Request, res: Response) => {
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
  const { value, error } = surveySchema.validate(req.body);
  const { title, coordinator, questions, availableToAnyone } = value;
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const survey = new Survey({
    _id: new mongoose.Types.ObjectId(),
    title,
    coordinator,
    questions,
    availableToAnyone,
  });
  return survey
    .save()
    .then((result) => res.status(201).json(result.toJSON()))
    .catch((err) => res.status(500).json({ message: err.message, err }));
};
export default { getAllSurveys, createSurvey };
