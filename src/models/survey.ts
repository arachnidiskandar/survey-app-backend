import { bool, boolean } from 'joi';
import mongoose, { Schema } from 'mongoose';

import ISurvey from '@interfaces/survey';

const QuestionSchema: Schema = new Schema({
  title: { type: String, required: true },
  questionType: { type: String, required: true },
  choices: [{ type: String }],
});
const SurveySchema: Schema = new Schema({
  title: { type: String, required: true },
  coordinator: { type: Number, required: true },
  questions: [QuestionSchema],
  availableToAnyone: { type: Boolean, required: true },
});

export default mongoose.model<ISurvey>('Survey', SurveySchema);
