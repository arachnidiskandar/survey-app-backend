import { Document } from 'mongoose';

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE CHOICE',
  SELECT_MULTIPLE = 'SELECT MULTIPLE',
  OPEN_TEXT = 'OPEN TEXT',
  YES_NO = 'YES OR NO',
}

interface IQuestion {
  title: string;
  questionType: QuestionType;
  choices?: string[];
}

export default interface ISurvey extends Document {
  title: string;
  coordinator: any;
  questions: IQuestion[];
  availableToAnyone: boolean;
}
