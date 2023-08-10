import { createSlice } from "@reduxjs/toolkit";

const readNewsSlice = createSlice({
    name : "readNews",
    initialState : {},
    reducers : {
        setReadNewsState : (state, action) => {
            return action.payload
        }
    }
});

export const { setReadNewsState } = readNewsSlice.actions;
export default readNewsSlice.reducer;