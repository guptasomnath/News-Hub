import React from "react";
import logSignCss from '../login-signup/logsign.module.css';

//import packages
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import cookies from 'js-cookie';

//import redux actions
import { setCompVisiablity } from "../../../redux/compVisiablitySlice";
import { setToastState } from '../../../redux/toastSlice';
import { setReRender } from "../../../redux/useEffectReRenderSlice";
import { setLoadingState } from '../../../redux/loadingSlice';


function Otp() {

  const compvisiablity = useSelector((state) => state.compVisiablity);
  const dispatch = useDispatch();
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
    loading(false)
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
  //shwo failed toast
  loading(false)
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
    otp: Yup.number("Otp Must Be In Numbers").positive("Otp Must Be Positive Numbers").integer("Otp Must Be Positive Integer").required("Otp is required"),
  });

  // Initial form values
  const initialValues = {
    otp : ""
  };

  const onPopupCloseIconClicked = () => {
    //on close icon click dismiss the auth popup dialog
    dispatch(setCompVisiablity({
      authPopupVisiable : "none"
    }))
  }

  const afterOtpVerified = () => {
    //after otp verified i will visiable chooseCat component
    dispatch(setCompVisiablity({
      otpCompVisiablity : "none",
      chooseCatCompVisiablity : "block"
    }))

    dispatch(setReRender({
      catagoryComp : Math.round(Math.random() * 100),
      showNewsComp : Math.round(Math.random() * 100)
    }));
  }

    // Handle form submission
  const onSubmit = async (values) => {
      //now i need to verify the otp
      try {
        
        loading(true);
        const res = await axios.post(baseUrl + '/user/verifyotp', {
          //id : cookies.get('userId'),
          gmail : cookies.get('userGmail'),
          otp : values.otp
        });

        if(!res.data.isSuccess){ //if response is not success
          failedToast(res.data.response);
          removeToast(1500);
          return;
        }
        
        cookies.set('userId', res.data.id);
        successToast(res.data.response);
        afterOtpVerified();
        
      } catch (error) {

         //show a error toast
         failedToast(error.response? error.response.data.response : error.message);
        
      }

      removeToast(1500);

  };


  return (
    <div style={{display : compvisiablity.otpCompVisiablity}}>
      <div className={logSignCss.dialogHead}>
            <h1>VERIFY OTP</h1>
           <div className={logSignCss.closeIcon}><iconify-icon onClick = {onPopupCloseIconClicked} icon="ri:close-line" width="25" height="25"></iconify-icon></div>
        </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form>
            {/* This is a otp div */}
            <div className={logSignCss.formDivs}>
              <label htmlFor="otp">Otp</label>
              <Field className = {logSignCss.inputs} type="text" id="otp" name="otp" />
              <div className = {logSignCss.errorMsg}><ErrorMessage name="otp" component="div" /></div>
            </div>
            <div>
              <button className={logSignCss.submitBtn} type="submit">VERIFY OTP</button>
            </div>
        </Form>
      </Formik>
      {/* This is a other information div */}
      <div className={logSignCss.label}>
          <label>Otp not recived? <label className={logSignCss.spanTxt}>Resend Otp</label></label>
      </div>
    </div>
  );
}

export default Otp;
