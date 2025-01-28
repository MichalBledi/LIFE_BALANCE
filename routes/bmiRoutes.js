import express from 'express';
import { getGlobalBmiData } from '../controllers/bmiController.js';

const router = express.Router();

router.get('/global-bmi-data/:year', getGlobalBmiData);

export default router;
