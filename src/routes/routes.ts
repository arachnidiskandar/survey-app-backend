import express from 'express';

import surveyRoutes from './survey';

const apiRouter = express.Router();

apiRouter.use('/surveys', surveyRoutes);

export default apiRouter;
