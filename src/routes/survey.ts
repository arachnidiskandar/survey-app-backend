import express from 'express';

import controller from '@controllers/survey';

const surveyRoutes = express.Router();

surveyRoutes.get('', controller.getAllSurveys);
surveyRoutes.post('', controller.createSurvey);

export default surveyRoutes;
