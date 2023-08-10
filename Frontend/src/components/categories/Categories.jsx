import React, { useEffect, useState } from 'react';
import cookies from 'js-cookie';
import axios from 'axios';
import catagoryCss from './categories.module.css';
import { useDispatch, useSelector } from 'react-redux';

//import redux actions
import { setToastState } from '../../redux/toastSlice';
import { setCatList } from '../../redux/catListSlice';

import { catagoryClickPosition, catagoryClickedName } from './catlist/Catlistitem';

//import components
import Catlist from './catlist/Catlistitem';

function Categories() {
  
  const useEffectReRendring = useSelector((state) => state.rerender);
  //const [catList, setCatList] = useState([]);
  const catagoryArray = useSelector((state) => state.catlist);
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
    dispatch(
      setToastState({
        isVisiable: true,
        type: "Error",
        title: "Failed",
        subtitle: errMsg,
      })
    );
  };


  const [controller, setController] = useState({
    position : catagoryArray[catagoryClickedName] || catagoryClickPosition,
    bkColor: "gainsboro",
    border: "1px solid gainsboro"
  })

  useEffect(()=>{

     const getCatagorys = async () => {
        try {
          
          //i am calling the global catagory (not user selected catagory) from my server
          const catagorys = await axios.get(import.meta.env.VITE_BASE_URL + '/catagorys/' + cookies.get('userId') || "");
          let catagoryList = catagorys.data.response;
          if(catagorys.data.InterestScore){
             //will came an object
             cookies.set('recomendTopics', Object.keys(catagorys.data.InterestScore).join(' '));
          }
          if(!cookies.get('userId')){
            catagoryList[0] = "All News";
          }
          dispatch(setCatList(catagoryList));
          
        } catch (error) {

          failedToast(!error.response ? error.message : error.response.data.response);
          removeToast(1500);
          
        }

     }

     getCatagorys();
  },[useEffectReRendring.catagoryComp])

  return (
    <div className={catagoryCss.catagorysDiv}>
       {
        catagoryArray.map((value, index) => {
          return <Catlist key={index} catName={value} index = {index} controller = {controller} setController = {setController}/>
        })
       }
      
    </div>
  )
}

export default Categories