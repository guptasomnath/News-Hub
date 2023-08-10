import { createSlice } from "@reduxjs/toolkit";

const catListSlice = createSlice({
    name : "catList",
    initialState : [],
    reducers : {
        setCatList : (state, action) => {
            return action.payload
        }
    }
});

export const { setCatList } = catListSlice.actions;
export default catListSlice.reducer;