import { Request, Response } from 'express';
import mongoose from 'mongoose';

import Survey from '@models/survey';

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
  const { id } = req.params;

  Survey.deleteOne({ _id: id })
    .then(() => res.status(204).json({}))
    .catch((err) => res.status(500).json({ message: err.message, err }));
};
export default { createSurvey, deleteSurvey };
