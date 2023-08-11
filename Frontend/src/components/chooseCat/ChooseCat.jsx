import React, { useState } from 'react';
import chooseCatCss from './choosecat.module.css';


//import packages
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import cookies from 'js-cookie';

//import redux action
import { setCompVisiablity } from '../../redux/compVisiablitySlice';
import { setToastState } from '../../redux/toastSlice';
import { setReRender } from '../../redux/useEffectReRenderSlice';
import { setNewsAvilable} from '../../redux/isNewsAvilable';

//import components
import logSignCss from '../auth/login-signup/logsign.module.css';
import ChooseCatList from './list/ChooseCatList';


function ChooseCat() {
  const compvisiablity = useSelector((state) => state.compVisiablity);
  const catagoryLists = useSelector((state) => state.catlist);
  const dispatch = useDispatch();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const selectCatList = {}


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
          //shwo failed toast
          dispatch(
            setToastState({
              isVisiable: true,
              type: "Error",
              title: "Failed",
              subtitle: errMsg
            })
          ); 
   }

  const successToast = (msg) => {
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

  const closeDialog = () => {
    //on close icon click dismiss the auth popup dialog
    dispatch(setCompVisiablity({
      authPopupVisiable : "none",
      accountBtnVisiable : "none"
    }))

    dispatch(setNewsAvilable(false));
    //get the user picked interest and show news accoding to it
    dispatch(setReRender({
      catagoryComp : Math.round(Math.random() * 100),
      showNewsComp : Math.round(Math.random() * 100),
    }))
    //location.reload()

  }

  const onDoneBtnClicked = async () => {
    if(selectCatList.size < 3) {
      failedToast('Select at least three options');
      removeToast(1500);
      return;
    }

    try {
      
      const res =  await axios.post(baseUrl + '/user/savecat', {
        id : cookies.get('userId'), //localStorage.getItem('userId'),
        interestlist : Object.keys(selectCatList)
      })
  
      if(res.data.isSuccess){
        successToast(res.data.response);
        removeToast(1500, () => {
          closeDialog();
        });

        return;
      }

    } catch (error) {
      
      //show a error toast
      failedToast(error.response? error.response.data.response : error.message);

    }
    
   

    removeToast(1500);

  }

  return (
    <div style={{display : compvisiablity.chooseCatCompVisiablity}}>
     <div className={logSignCss.dialogHead}>
        <h1>CHOOSE YOUR INTEREST</h1>
        {/*<div className={logSignCss.closeIcon}><iconify-icon onClick = {onPopupCloseIconClicked} icon="ri:close-line" width="25" height="25"></iconify-icon></div>*/}
     </div>
     <div className={chooseCatCss.chooseInterestCatLayout}>
      <div className={chooseCatCss.listViewLayout}>
         {
          catagoryLists.map((catagoryName, index) => {
            return index != 0? <ChooseCatList key={index} name = {catagoryName} selectCatList = {selectCatList}/> : ""
          })
         }
      </div>
      <div onClick={onDoneBtnClicked} className={chooseCatCss.doneIcon}><iconify-icon icon="ion:checkmark-done-circle" width="30" height="30"></iconify-icon></div>
     </div>
    </div>
  )
}

export default ChooseCat;