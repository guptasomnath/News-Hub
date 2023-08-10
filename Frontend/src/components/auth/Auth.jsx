import React from "react";
import authCss from "./auth.module.css";

//import components
import LoginSignup from "./login-signup/LoginSignup";
import Otp from "./otp/Otp";
import ChooseCat from "../chooseCat/ChooseCat";

//import packages
import { useSelector } from "react-redux";

function Auth() {
  const compvisiablity = useSelector((state) => state.compVisiablity);
  return (
    <div style={{display : compvisiablity.authPopupVisiable}} className={authCss.authMainLayout}>
      <div className={authCss.cardView}>
         <LoginSignup />
         <Otp />
         <ChooseCat />
      </div>
    </div>
  );
}

export default Auth;
