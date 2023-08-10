import { createSlice } from "@reduxjs/toolkit";

const newsSlice = createSlice({
    name : "isNewsAvilable",
    initialState : [],
    reducers : {
        setNewsList : (state, action) => {
            return action.payload
        }
    }
});

export const { setNewsList } = newsSlice.actions;
export default newsSlice.reducer;