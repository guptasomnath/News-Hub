import React, { useState } from 'react';
import axios from 'axios';
import cookies from 'js-cookie'
import catagoryCss from '../categories.module.css';
import { useDispatch } from 'react-redux';
import { setNewsList } from '../../../redux/newsSlice';
export let catagoryClickPosition = 0;
export let catagoryClickedName = "";

import { setToastState } from '../../../redux/toastSlice';

function Catlist({catName, index, setController, controller}) {

  const dispatch = useDispatch();
  const userId = cookies.get('userId');
  const newsApiUrl = import.meta.env.VITE_NEWS_API_URL;
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
    //shwo failed toast
    dispatch(
      setToastState({
        isVisiable: true,
        type: "Error",
        title: "Failed",
        subtitle: errMsg,
      })
    );
  };
  
  //when ay catagory will click
  const onCatListClicked = async (indx) => {
    catagoryClickPosition = indx;
    catagoryClickedName = catName;
    setController({
        position : indx,
        bkColor: "gainsboro",
        border: "1px solid gainsboro"
  })

    let getReqUrl = newsApiUrl.replace('{example}', index == 0 ? userId ? cookies.get('myInterestCatList') : "latest" : catName);
   
    //if catagory name is recommendation then hit recommendation api
    if(catName.toLowerCase().includes('recommendation')){
      getReqUrl = newsApiUrl.replace('{example}', cookies.get('recomendTopics'));
    }

  try {
    
    const newsData = await axios.get(getReqUrl);
    dispatch(setNewsList(newsData.data.articles));

  } catch (error) {

    failedToast('Something went wrong try again later');
    removeToast(2000);
    
  }
    
  }

  return (
    <div onClick={() => onCatListClicked(index)} style={{
       backgroundColor : controller.position == index ? controller.bkColor : "#fff",
       border : controller.position == index ? controller.border : "#gainsboro",
    }} className={catagoryCss.listItems}>
        {catName}
    </div>
  )
}

export default Catlist