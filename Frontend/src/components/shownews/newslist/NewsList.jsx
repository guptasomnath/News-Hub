import React, { useEffect } from 'react';
import newsListCss from './newslist.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import cookies from 'js-cookie';
import { v4 as uuid } from 'uuid';

import { useDispatch } from 'react-redux';

//import redux actions
import { setToastState } from '../../../redux/toastSlice';
import { setReadNewsState } from '../../../redux/readNewsSlice';
import { setCompVisiablity } from '../../../redux/compVisiablitySlice';
import { setReRender } from '../../../redux/useEffectReRenderSlice';

function NewsList({items, position}) {
  
  const navigate = useNavigate();
  const routeLocation = useLocation().pathname;
  const dispatch = useDispatch();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const onNewsListItemClicked = async () => {
    //set data to news list redux
    dispatch(setReadNewsState(items));
    //navigate to read news page
    navigate('/read');
  }

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

  const successToast = (msg) => {
    //shwo failed toast
    dispatch(
      setToastState({
        isVisiable: true,
        type: "Success",
        title: "Success",
        subtitle: msg,
      })
    );
  };

  const removeSavedNews = async () => {

    try{
      
      const res = await axios.post(baseUrl + '/user/removenews', {
        id : cookies.get('userId'),
        //these apis not give news id for that i use publishedAt as a primery key
        key : items.publishedAt
       });

       successToast(res.data.response);
       removeToast(1500, () => {
        dispatch(setReRender({
          saveNewsComp : Math.round(Math.random() * 100)
        }));
        //location.reload();
      });

    }catch(err){
     
      failedToast(!err.response? err.message : err.response.data.response);
      removeToast(1500);
  
    }

  }

  const onSaveNewsIconClicked = async () => {
    //save news to the user database
    //need to check is this users login or not?
    if(!cookies.get('userId')) {
      dispatch(setCompVisiablity({
        authPopupVisiable : "flex"
      }))
      return;
    }

    if(routeLocation == "/saved") {
      //if user in /saved page and user click on save news button than we can
      //easily detect that user want to delete the saved news
      removeSavedNews();
      return;
    }

    try{
      
      const res = await axios.post(baseUrl + '/user/savenews', {
        id : cookies.get('userId'),
        newsdata : items
       });

       successToast(res.data.response);
       removeToast(1500);

    }catch(err){
     
      failedToast(!err.response? err.message : err.response.data.response);
      removeToast(1500);
  
    }
     
  }

  const convartDate = (date) => {
    const currentDate = new Date(date);

    // Define options for formatting the date
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };

    // Format the date using toLocaleString method
    const formattedDate = currentDate.toLocaleString("en-US", options);
    return formattedDate;
  };



  return (
    <div className={newsListCss.listItem}>
        <div onClick={onNewsListItemClicked}  className={newsListCss.imageView} style={{
          backgroundImage : `url(${items? items.image : ""})`
        }}></div>
        <div className={newsListCss.newsDetails}>
            <div onClick={onNewsListItemClicked} className={newsListCss.titleDescription}>
                <h1>{items? items.title.substring(0,40) + ".." : ""}</h1>
                <p>{items? items.description.substring(0, 120) + ".." : ""}</p>
            </div>
        <div className={newsListCss.bottomDiv}>
            <label>{convartDate(items? items.publishedAt : "")}</label>
            <div className={newsListCss.fabIcon} style={{color : routeLocation == "/saved" ? "red" : ""}} onClick={onSaveNewsIconClicked}>
                <iconify-icon icon={routeLocation == "/saved" ? "ic:outline-favorite" : "material-symbols:favorite-outline"} width="18" height="18"></iconify-icon>
            </div>
        </div>
        </div>
    </div>
  )
}

export default NewsList