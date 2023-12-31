import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import cookies from 'js-cookie';
import saveNCss from './savenews.module.css';

//import components
import NewsList from '../shownews/newslist/NewsList';

//redux actions
import { setToastState } from '../../redux/toastSlice';
import { setLoadingState } from '../../redux/loadingSlice';


function SaveNews() {
  const [saveNews, setSaveNews] = useState([]);
  const useEffectReRendring = useSelector((state) => state.rerender)
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
    //shwo failed toast
    loading(false)
    dispatch(
      setToastState({
        isVisiable: true,
        type: "Error",
        title: "Failed",
        subtitle: errMsg,
      })
    );
  };


  const loading = (isLoading) => {
    dispatch(setLoadingState(isLoading));
  }

  useEffect(() => {

    const call = async () => {
    try {
     
    loading(true);
     const res = await axios.post(baseUrl + '/user/exportnews', {
      id : cookies.get('userId')
     });

     setSaveNews(res.data.response.savedNews);
     if(Object.entries(res.data.response.savedNews).length <= 0){
      failedToast("You don't have any saved news");
      removeToast(1800)
      return;
     }

     loading(false);
      
    } catch (error) {
    
      failedToast(!error.response ? error.message : error.response.data.response);
      
    }
     

    }

    call();

  }, [useEffectReRendring.saveNewsComp])

  return (
    <div className={saveNCss.saveNewsLayout}>
      {
        Object.entries(saveNews).map(([key, values], index) => {
          return <NewsList key={index} items = {values} position={index} saveNews = {saveNews} setSaveNews = {setSaveNews}/>
        })
      }
    </div>
  )
}

export default SaveNews