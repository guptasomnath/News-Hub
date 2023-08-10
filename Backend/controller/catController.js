import { InterestScore } from "../model/interestScoreModule.js";

export const getCatList = async (req, res) => {
  const catList = ['Your Interest', 'Technology', 'Sports', 'Politics', 'Health', 'Businesses'];
  if(!req.params.id || req.params.id == "undefined"){
    return res.status(200).json({isSuccess : true, response : catList});
  }

  const dbRes = await InterestScore.findOne({_userID : req.params.id});
  if(!dbRes){
    return res.status(200).json({isSuccess : true, response : catList});
  }

  res.status(200).json({isSuccess : true, response : catList.slice(0, 1).concat('Recommendation' ,catList.slice(1, catList.length)), InterestScore : dbRes.interestsscore});
  
}