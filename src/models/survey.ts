import mongoose, { Schema } from 'mongoose';

import ISurvey from '@interfaces/survey';

const questionSchema: Schema = new Schema({
  title: { type: String, required: true },
  questionType: { type: String, required: true },
  choices: [{ type: String }],
});
const surveySchema: Schema = new Schema({
  title: { type: String, required: true },
  coordinator: { type: Number, required: true },
  questions: [questionSchema],
  availableToAnyone: { type: Boolean, required: true },
});

export default mongoose.model<ISurvey>('survey', surveySchema);
