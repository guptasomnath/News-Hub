import React from "react";
import loadingCss from './loading.module.css';
import { useSelector } from "react-redux";

function Loading() {
  const loadingBarState = useSelector((state) => state.loading);
  return (
    <div style={{display : loadingBarState? "flex" : "none"}} className={loadingCss.loadingMain}>
      <div className={loadingCss.loadingChild}></div>
    </div>
  );
}

export default Loading;