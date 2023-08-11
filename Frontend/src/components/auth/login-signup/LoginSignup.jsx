import React, { useState } from 'react';
import logSignCss from './logsign.module.css';

//import package
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import cookies from 'js-cookie';

//import redux actions
import { setCompVisiablity } from '../../../redux/compVisiablitySlice';
import { setToastState } from '../../../redux/toastSlice';
import { setReRender } from '../../../redux/useEffectReRenderSlice';
import { setLoadingState } from '../../../redux/loadingSlice';

function LoginSignup() {
  const dispatch = useDispatch();
  const compvisiablity = useSelector((state) => state.compVisiablity);
  const [signInOrSignup, setSignInOrSignup] = useState('SIGN IN');
  const baseUrl = import.meta.env.VITE_BASE_URL;


  const removeToast = (dealy, callback) => {
      const timeoutId = setTimeout(() => {
        dispatch(
          setToastState({
            isVisiable: false,
          })
        );
        clearTimeout(timeoutId);
        //if callback exist than call this function
        //if we want to do any other work than we can pass a callback function
        if (callback) {
          callback();
        }
      }, dealy);
  };

  const failedToast = (errMsg) => {
    loading(false);
            //shwo failed toast
            dispatch(
              setToastState({
                isVisiable: true,
                type: "Error",
                title: "Failed",
                subtitle: errMsg//err.response.data.response,
              })
            ); 
  }

  const successToast = (msg) => {
    loading(false);
    //shwo failed toast
    dispatch(
      setToastState({
        isVisiable: true,
        type: "Success",
        title: "Success",
        subtitle: msg
      })
    ); 
  }

  const loading = (isLoading) => {
    dispatch(setLoadingState(isLoading));
  }

  // Define the validation schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Initial form values
  const initialValues = {
    email: "",
    password: "",
  };

  const onPopupCloseIconClicked = () => {
    //on close icon click dismiss the auth popup dialog
    dispatch(setCompVisiablity({
      authPopupVisiable : "none"
    }))
  }

  const onLoginOrSignupLblClicked = () => {
    if(signInOrSignup == "SIGN IN") return setSignInOrSignup("SIGN UP");
    setSignInOrSignup("SIGN IN");
  }

  const sendOtp = async (userGmail) => {
    //when need otp verification
    dispatch(setCompVisiablity({
      logSignUpCompVisiablity : "none",
      otpCompVisiablity : "block"
    }))

    //hit sendOtp api
    try {
      
      cookies.set('userGmail', userGmail); //set the gmail for otp verification
      const res = await axios.post(baseUrl + '/user/sendotp', {
        gmail : userGmail
      });

      if(!res.data.isSuccess) {
        failedToast(res.data.response);
        return;
      }

    } catch (error) {

         //show a error toast
         failedToast(error.response? error.response.data.response : error.message);

    }

    removeToast(1500);

  }

  // Handle form submission
  const onSubmit = async (values) => {
      const endPoint = signInOrSignup == "SIGN UP"? '/user/signup' : '/user/signin';

        try {

           loading(true);
           const res = await axios.post(baseUrl + endPoint, {
             gmail : values.email,
             password : values.password
           });

           if(!res.data.isSuccess) {
            failedToast(res.data.response);
            removeToast(1500);
            return;
           } 


           successToast(res.data.response) //show a success toast
           if(signInOrSignup == "SIGN UP"){
            //after account created, verify the otp
            sendOtp(values.email);
           }else{
             //after login complete successfully
             cookies.set('userId', res.data.id);
             cookies.set('userGmail', res.data.gmail);
             removeToast(1500, () => {
              //after toast removed invisiable the login popup
              dispatch(setCompVisiablity({
                authPopupVisiable : "none",
                accountBtnVisiable : "none"
              }))
              dispatch(setReRender({
                catagoryComp : Math.round(Math.random() * 100),
                showNewsComp : Math.round(Math.random() * 100)
              }));
             });
             return;
           }


        } catch (error) {


           //show a error toast
           if(error.response){
            failedToast(error.response.data.response);
            if(error.response.data.response == "Verify your gmail first"){
              sendOtp(values.email);
             }
             removeToast(1500);
             return;
           }
           failedToast(error.response? error.response.data.response : error.message);
           removeToast(1500);
        }
  };

  return (
    <div style={{display : compvisiablity.logSignUpCompVisiablity}}>
        {/* This is auth dialog head */}
        <div className={logSignCss.dialogHead}>
            <h1>{signInOrSignup}</h1>
           <div className={logSignCss.closeIcon}><iconify-icon onClick = {onPopupCloseIconClicked} icon="ri:close-line" width="25" height="25"></iconify-icon></div>
        </div>
        {/* This is a formik form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            {/* This is a email div */}
            <div className={logSignCss.formDivs}>
              <label htmlFor="email">Email</label>
              <Field className = {logSignCss.inputs} type="email" id="email" name="email" />
              <div className = {logSignCss.errorMsg}><ErrorMessage name="email" component="div" /></div>
            </div>
            {/* This is a password div */}
            <div className={logSignCss.formDivs}>
              <label htmlFor="password">Password</label>
              <Field className = {logSignCss.inputs} type="password" id="password" name="password" />
              <div className = {logSignCss.errorMsg}><ErrorMessage name="password" component="div" /></div>
            </div>
            {/* This is a submit button div */}
            <div>
              <button className={logSignCss.submitBtn} type="submit">{signInOrSignup}</button>
            </div>
          </Form>
        </Formik>
        {/* This is a other information div */}
        <div className={logSignCss.label}>
            <label>{signInOrSignup == "SIGN IN" ? "Don't have account? " : "Already have account? " }<label onClick={onLoginOrSignupLblClicked} className={logSignCss.spanTxt}>{signInOrSignup == "SIGN IN" ? "SIGNUP" : "LOGIN"}</label></label>
        </div>
    </div>
  )
}

export default LoginSignup;