import { interestScoreSchema } from "../validation/interestScoreValidation.js";
import { InterestScore } from "../model/interestScoreModule.js";

//accoding to the score i am going to recomend news to the user
export const storeInterestScore = async (req, res) => {

    const {error} = interestScoreSchema.validate(req.body);
    if(error) throw error;

    const user = await InterestScore.findOne({_userID : req.body.id});
    //if document is not exist create a new document
    if(!user) {
     const payload = {
        _userID : req.body.id,
        interestsscore : new Map()
    } 

    const storeData = new InterestScore({
        ...payload,
    });

    const dbRes = await storeData.save();
    return res.status(200).json({isSuccess : true, response : "New interest score document created" })
    }
   
    const oldScore = user.interestsscore.get(req.body.key) || 0;
    user.interestsscore.set(req.body.key, oldScore + req.body.value);
    user.save();
    res.status(200).json({isSuccess : true, response : user.interestsscore.get(req.body.key)})

  
}

