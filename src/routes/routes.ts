import express from 'express';

import authRoutes from './auth';
import surveyRoutes from './survey';

const apiRouter = express.Router();

apiRouter.use('/surveys', surveyRoutes);
apiRouter.use('', authRoutes);

export default apiRouter;
