import { configureStore } from "@reduxjs/toolkit";
import compVisiablityReducer from "./compVisiablitySlice";
import toastReducer from './toastSlice';
import readNewsReducer from "./readNewsSlice";
import isNewsAvilableReducer from "./isNewsAvilable";
import newsReducer from "./newsSlice";
import catListReducer from "./catListSlice";
import useEffectReReducer from "./useEffectReRenderSlice";
import loadingReducer from "./loadingSlice";

export const store = configureStore({
    reducer : {
       newslist : newsReducer,
       catlist : catListReducer,
       compVisiablity : compVisiablityReducer,
       toast : toastReducer,
       readnews : readNewsReducer,
       isnewsavilable : isNewsAvilableReducer,
       rerender : useEffectReReducer,
       loading : loadingReducer
    }
});