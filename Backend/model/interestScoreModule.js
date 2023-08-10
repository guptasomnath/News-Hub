import mongoose, {Schema} from "mongoose";

const interestScroSchema = {
   
    _userID : {
        type : String,
        require : true
    },
    
    interestsscore : {
          type : Map,
          of : Number
    }
    
}

export const InterestScore = mongoose.model('interestscore', interestScroSchema);