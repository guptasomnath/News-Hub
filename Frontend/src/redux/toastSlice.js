import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
    name : "toast",
    initialState : {
        isVisiable : false,
        type : 'Success', //Success, Error, Warning
        title : "Success",
        subtitle : "Your changes are saved successfully"
    },
    reducers : {
        setToastState : (state, action) => {
            return { ...state, ...action.payload };
        }
    }
});

export const { setToastState } = toastSlice.actions;
export default toastSlice.reducer;