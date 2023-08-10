import mongoose, {Schema} from "mongoose";

const userSchema = {
    gmail : {
        require : true,
        type : String
    },

    password : {
        require : true,
        type : String
    },

    token : {
        require : true,
        type : String
    },

    isVerified : {
        require : true,
        type : Boolean
    },

    interestedCatagorys : {
        type : Array,
        require : true
    },

    savedNews: {
        type: Map,
        of: Object
    },

}

export const UserModel = mongoose.model('users', userSchema);