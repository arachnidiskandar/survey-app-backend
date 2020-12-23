import { Request, Response } from 'express';
import mongoose from 'mongoose';

import Survey from '@models/survey';

const getAllSurveys = (req: Request, res: Response): void => {
  Survey.find()
    .exec()
    .then((results) => res.status(200).json({ surveys: results }))
    .catch((error) => res.status(500).json({ message: error.message, error }));
};

const createSurvey = (req: Request, res: Response): void => {
  const { title, coordinator, questions, availableToAnyone } = req.body;

  const survey = new Survey({
    _id: new mongoose.Types.ObjectId(),
    title,
    coordinator,
    questions,
    availableToAnyone,
  });
  survey
    .save()
    .then((result) => res.status(201).json(result.toJSON()))
    .catch((err) => res.status(500).json({ message: err.message, err }));
};

const deleteSurvey = (req: Request, res: Response): void => {
  const { id } = req.body;

  Survey.deleteOne({ _id: id })
    .then(() => res.status(204).json({}))
    .catch((err) => res.status(500).json({ message: err.message, err }));
};
export default { getAllSurveys, createSurvey, deleteSurvey };
