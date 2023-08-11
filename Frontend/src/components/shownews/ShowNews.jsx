import React, { useEffect, useState } from 'react';
import showNewsCss from './shownews.module.css';

import axios from 'axios';
import cookie from 'js-cookie';

import { setNewsAvilable } from '../../redux/isNewsAvilable';
import { setNewsList } from '../../redux/newsSlice';
import { setToastState } from '../../redux/toastSlice';
import { setCompVisiablity } from '../../redux/compVisiablitySlice';
import { setLoadingState } from '../../redux/loadingSlice';

//import components
import NewsList from './newslist/NewsList';
import Categories from '../categories/Categories';

import { useDispatch, useSelector } from 'react-redux';

function ShowNews() {
  const newsList = useSelector((state) => state.newslist);
  const useEffectReRendring = useSelector((state) => state.rerender);
  const isNewsAvilable = useSelector((state) => state.isnewsavilable);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const dispatch = useDispatch();

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
    loading(false);
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

  useEffect(()=>{
    
    const getNews = async (newsApi) => {
      try {

        const newsData = await axios(newsApi);
        dispatch(setNewsAvilable(true));
        loading(false);
        dispatch(setNewsList(newsData.data.articles));
        
      } catch (error) {

        failedToast(!error.response? error.message : error.response.data.response);
        removeToast(1500);
        
      }
      
    }

    const getInterestList = async () => {

      if(isNewsAvilable){
        return;
      }

      try{
        
        //if user not login then show him any(latest) topic 
        loading(true);
        if(!cookie.get('userId')){
          getNews(import.meta.env.VITE_NEWS_API_URL.replace('{example}', 'latest'));
          return;
        }
        //if user login the first get user interest list first then call news api
        //my server give me the news api
        const res = await axios(baseUrl + '/user/getuserinterest/' + cookie.get('userId'));
        cookie.set('myInterestCatList', res.data.allResponse.interestedCatagorys.join(" "));
        getNews(res.data.response)

      }catch(err){

        console.log(err)
  
        if(!err.response){ //it will be network error
          failedToast(err.message);
          removeToast(1500)
          return;
        }
        if(!err.response.data.response){ //it might be news api error
          failedToast('Something wrong try again later');
          removeToast(1500);
          return;
        }

        failedToast('Choose your interests first'); //it will come if the user did not choose the interests options
        removeToast(1800, () => {
          dispatch(setCompVisiablity({
            authPopupVisiable : "flex",
            chooseCatCompVisiablity : "block",
            logSignUpCompVisiablity : "none",
            otpCompVisiablity : "none"
          }))
        });
        
      }
    }

    getInterestList();

  },[useEffectReRendring.showNewsComp])
  return (
    <div className={showNewsCss.showNewsListDiv}>
      <Categories />
        {
          newsList.map((items, index) => {
            return <NewsList key={index} items = {items} position = {index}/>
          })
        }
    </div>
  )
}

export default ShowNews