import express from 'express';
import tryCatch from '../utils/tryCatch.js';
import { storeInterestScore } from '../controller/interestScroreController.js';
const interestScoreRoute = express.Router();

interestScoreRoute
    .post('/score', tryCatch(storeInterestScore))


export default interestScoreRoute;