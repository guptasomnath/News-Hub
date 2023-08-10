import { createSlice } from "@reduxjs/toolkit";
import cookies from 'js-cookie';

export const compVisiablitySlice = createSlice({
    name : "ComponentVisiablity",
    initialState : {
        authPopupVisiable : "none", //"flex" from visiable true and "none" for false
        logSignUpCompVisiablity : "block", //"block" from visiable true and "none" for false
        otpCompVisiablity : "none", //"block" from visiable true and "none" for false
        chooseCatCompVisiablity : "none", //"block" from visiable true and "none" for false
        accountBtnVisiable : !cookies.get('userId')? "block" : "none",//"block" from visiable true and "none" for false
    },

    reducers : {
        setCompVisiablity : (state, action) => {
            return {...state, ...action.payload};
        }
    }
});

export const { setCompVisiablity } = compVisiablitySlice.actions;
export default compVisiablitySlice.reducer;
