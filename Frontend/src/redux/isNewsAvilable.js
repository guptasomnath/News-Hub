import { createSlice } from "@reduxjs/toolkit";

const isNewsAvilableSlice = createSlice({
    name : "isNewsAvilable",
    initialState : false,
    reducers : {
        setNewsAvilable : (state, action) => {
            return action.payload
        }
    }
});

export const { setNewsAvilable } = isNewsAvilableSlice.actions;
export default isNewsAvilableSlice.reducer;