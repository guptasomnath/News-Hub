import express from 'express';
import dotenv from 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';

//import routes
import userRoute from './route/userRoute.js';
import catagoryRoute from './route/catagoryRoute.js';
import interestScoreRoute from './route/interestScoreRoute.js';

//error handler js file
import errorHandler from './middleware/errorHandler.js';

const app = express();

//connect to db
const connectDb = async () => {
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("Database Connected");
    }catch(err){
        console.log({message : 'Database not connected', error : err});
    }
}

connectDb();

//middlewares
app.use(cors({
   origin: process.env.FRONTEND_DOMAIN,
   methods: 'GET,POST',
   allowedHeaders: 'Content-Type,Authorization',
}));

app.use(express.json());
app.use('/user', userRoute);
app.use('/catagorys', catagoryRoute);
app.use('/interest', interestScoreRoute);

app.all('*', (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on the server`);
    err.statusCode = 404
    return next(err);
});

app.use(errorHandler);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server is running at port ' + PORT));