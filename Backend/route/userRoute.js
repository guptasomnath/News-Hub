import express from 'express';
const userRoute = express.Router();
import tryCatch from '../utils/tryCatch.js';

//import controllers
import { signUp, signin, sendOtp, verifyOtp, addInterestCat, saveNews, exportSavedNews, removeSavedNew, userInterestNewsList } from '../controller/userController.js';

userRoute
    .post('/signup', tryCatch(signUp))
    .post('/signin', tryCatch(signin))
    .post('/sendotp', tryCatch(sendOtp))
    .post('/verifyotp', tryCatch(verifyOtp))
    .post('/savecat', tryCatch(addInterestCat))
    .post('/savenews', tryCatch(saveNews))
    .post('/exportnews', tryCatch(exportSavedNews))
    .post('/removenews', tryCatch(removeSavedNew))
    .get('/getuserinterest/:id', tryCatch(userInterestNewsList))



export default userRoute;