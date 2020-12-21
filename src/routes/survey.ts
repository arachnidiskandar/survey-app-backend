import express from 'express';

import controller from '@controllers/survey';

const router = express.Router();

router.get('', controller.getAllSurveys);
router.post('', controller.createSurvey);

export = router;
