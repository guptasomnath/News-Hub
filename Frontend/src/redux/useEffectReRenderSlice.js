import { createSlice } from "@reduxjs/toolkit";

const useEffectReRenderSlice = createSlice({
    name : "useEffectReRender",
    initialState : { 
        catagoryComp : 0, //i will pass random number
        showNewsComp : 0, //i will pass random number
        saveNewsComp : 0 //i will pass random number
    },
    reducers : {
        setReRender : (state, action) => {
            return {...state, ...action.payload}
        }
    }
});

export const { setReRender } = useEffectReRenderSlice.actions;
export default useEffectReRenderSlice.reducer;