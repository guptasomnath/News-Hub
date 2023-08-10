import express from 'express';
import tryCatch from '../utils/tryCatch.js';
import { getCatList } from '../controller/catController.js';
const catagoryRoute = express.Router();

catagoryRoute
    .get('/:id', tryCatch(getCatList))

export default catagoryRoute;