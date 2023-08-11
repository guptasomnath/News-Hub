import { userSchema, userSendOtpSchema, userVerifyOtpSchema } from "../validation/userValidation.js";
import { UserModel } from "../model/userModel.js";
import { verifyToken }  from "../jwt/verifyToken.js";
import { interestCatSchema } from "../validation/userValidation.js";
import { saveNewsSchema, removeSaveNewSchema, exportSaveNewsSchema } from "../validation/userValidation.js";

//import packages
import axios from 'axios';
import jwt from 'jsonwebtoken';

const otps = new Map();

export const signUp = async (req, res) => {
    //check validation
    const {error} = userSchema.validate(req.body);
    //if any error in validation
    if(error) throw error;
  

    //now check is the email already exist to the database or not

    const data = await UserModel.findOne({gmail : req.body.gmail});
    if(data != null) return res.status(403).json({isSuccess : false, response : "Gmail is already exist"});
    

    
    //if no validation error create jwt token and store to database
    const payload = {
        gmail : req.body.gmail,
        password : req.body.password
    }
    //create JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
    const storeData = new UserModel({
        ...payload,
        password : jwt.sign(req.body.password, process.env.JWT_SECRET_KEY), //encode the password
        token : token,
        isVerified : false,
        savedNews: new Map()
    });



   //store data to database
    const dbRes = await storeData.save();
    res.status(200).json({isSuccess : true, response : "Verify your gmail" })
}

export const signin = async (req, res) => {
  //check Joi validation
  const { error } = userSchema.validate(req.body);
  //if Joi validation error happen
  if(error) throw error;

  //check is the user available or not in the databse
    const dbRes = await UserModel.findOne({gmail : req.body.gmail});
    if(dbRes == null) return res.status(404).json({isSuccess: false, response : "Account is not exist"});
    //if user exist then check the password is correct or not?
    const originalPass = await verifyToken(dbRes.password, process.env.JWT_SECRET_KEY);
    if(originalPass != req.body.password){
      //if password is wrong
      return res.status(401).json({isSuccess: false, response : "Password is wrong"});
    }

    //if user gmail is not verified 
    if(!dbRes.isVerified) return res.status(401).json({isSuccess: false, response : "Verify your gmail first"});

    res.status(200).json({isSuccess : true, response : "Login successfull", token : dbRes.token, id : dbRes._id, gmail : dbRes.gmail});

}

export const sendOtp = async (req, res) => {
  const {error} = userSendOtpSchema.validate(req.body);
  if(error) throw error;


  const otp = Math.floor(1000 + Math.random() * 9000);

 const otpApi = process.env.OTP_API;
  const otpRes = await axios.get(
      `${otpApi}?toEmail=${req.body.gmail}&subject=OTP%20From%20Simple%20Login%20App&body=This%20is%20your%20OTP%20:-%20%20${otp}`
  );

  otps.set(req.body.gmail, otp); //'userId', 'otp'
  
  res.status(200).json({isSuccess : true, response : "Otp Sended Successfully"});
}

export const verifyOtp = async (req, res) => {

  const {error} = userVerifyOtpSchema.validate(req.body);
  if(error) throw error

  //if otp is not generated
  const originalOtp = otps.get(req.body.gmail);
  if(originalOtp == null){
    res.status(400).json({isSuccess : false, response : "Generate otp first"});
    return;
  }

  if(originalOtp != req.body.otp){
    res.status(400).json({isSuccess : false, response : "Wrong otp"});
    return;
  }
  
  //now set database isVerified field to true
  const dbResult = await UserModel.findOneAndUpdate({gmail : req.body.gmail}, {isVerified : true});
  otps.delete(req.body.gmail);
  res.status(200).json({isSuccess : true, response : "Otp verified", token : dbResult.token, id : dbResult._id, gmail : dbResult.gmail});

}

export const addInterestCat = async (req, res) => {
   const {error} = interestCatSchema.validate(req.body);
   if(error) throw error;


    const dbData = await UserModel.findByIdAndUpdate(req.body.id, {
      interestedCatagorys : req.body.interestlist,
    })

    res.status(200).json({isSuccess : true, response : "Successfully completed"})

}

export const saveNews = async (req, res) => {
  const {error} = saveNewsSchema.validate(req.body);
  if(error) throw error;

  const user = await UserModel.findById(req.body.id)
  //these api not give news id for that i use publishedAt as an primery key
  user.savedNews.set(req.body.newsdata.publishedAt, req.body.newsdata);

  user.save();

  res.status(200).json({isSuccess : true, response : "News has saved successfully"})

}

export const removeSavedNew = async (req, res) => {
  const {error} = removeSaveNewSchema.validate(req.body);
  if(error) throw error;

  /*Update the user document using the $pull operator
  const dbRes = await UserModel.updateOne(
    { _id: req.body.id },
    { $pull: { savedNews: { _newsID: req.body.newsId } } }
  );*/

  const dbRes = await UserModel.findByIdAndUpdate(req.body.id, {
    $unset: { [`savedNews.${req.body.key}`]: 1 }
  });

  res.status(200).json({isSuccess : true, response : "News has removed successfully"})

}

export const exportSavedNews = async (req, res) => {
  const {error} = exportSaveNewsSchema.validate(req.body);
  if(error) throw error;
  
  const dbResult = await UserModel.findById(req.body.id, 'savedNews');
  if(!dbResult) throw {message : "Id is not exist"};
  
  
  res.status(200).json({isSuccess : true, response : dbResult})

}

export const userInterestNewsList = async (req, res) => {
  
  const {error} = exportSaveNewsSchema.validate(req.params);
  if(error) throw error;

  const dbResult = await UserModel.findById(req.params.id, 'interestedCatagorys');
  if(!dbResult) throw {statusCode : 404, message : "User id is not exist"}

  if(dbResult.interestedCatagorys.length == 0) throw {statusCode : 404, message : "No interest found"}
  
  //after getting all the user interest now i am going to hit the GnewApi api
  
    res.status(200).json({isSuccess : true, response : process.env.NEWS_URL.replace("{element}", dbResult.interestedCatagorys.join(' OR ')), allResponse : dbResult})
}