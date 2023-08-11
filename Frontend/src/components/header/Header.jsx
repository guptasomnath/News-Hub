import React, { useRef, useState } from 'react';
import headerCss from './header.module.css';

//import packages
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import cookies from 'js-cookie';
import axios from 'axios';

//import redux actions
import { setCompVisiablity } from '../../redux/compVisiablitySlice';
import { setNewsList } from '../../redux/newsSlice';
import { setToastState } from '../../redux/toastSlice';
import { setReRender } from '../../redux/useEffectReRenderSlice';
import { setNewsAvilable } from '../../redux/isNewsAvilable';

function Header() {
  const dispatch = useDispatch();
  const accountBtnVisiablity = useSelector((state) => state.compVisiablity.accountBtnVisiable);
  const navigate = useNavigate();

  const searchRef = useRef(null)

  const [state, setState] = useState({
    searchBar : {
      display : addEventListener('resize', () => window.innerWidth <= 710 ? "none" : "flex",)
    },
    otherNavOption : {
      display : "flex"
    }
  });

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

  const accountBtnClicked = () => {
    //signin / signup btn on clicked show auth popup
     dispatch(setCompVisiablity({
       authPopupVisiable : "flex"
     }));
  }

  const onSaveNewsBtnClicked = () => {
    if(!cookies.get('userId')){
       //if user not login
       dispatch(setCompVisiablity({
        authPopupVisiable : "flex"
      }));
    }else{
      navigate('/saved')
    }
    
  }

  const onMobileSearchBtnClicked = () => {
    //on mobile search btn clicked invisiable all the element from navbar and 
    //visiable searbar only
    setState({
      searchBar : {
        display : "flex",
      },
      otherNavOption : {
        display : "none"
      }
    });
  }

  const onLeftBackBtnClicked = () => {
    setState({
      searchBar : {
        display : "none",
      },
      otherNavOption : {
        display : "flex"
      }
    });
  }

  const onAccountIconClicked = () => {
    if (confirm("Are you sure you want to logout")) {
      cookies.remove('userId');
      cookies.remove('userGmail');
      cookies.remove('recomendTopics');
      cookies.remove('myInterestCatList');
      dispatch(setCompVisiablity({
        accountBtnVisiable : "block"
      }))

      successToast('Successfully Logout');
      removeToast(1500, () => {
        dispatch(setNewsAvilable(false));
         dispatch(setReRender({
          catagoryComp : Math.round(Math.random() * 100),
          showNewsComp : Math.round(Math.random() * 100),
          saveNewsComp :  Math.round(Math.random() * 100)
         }))
        //location.reload();
      })
    }
  }

  const onSearch = async () => {
     if(searchRef.current.value.length == 0) {
      failedToast("Type something");
      removeToast(1500);
      return;
     }

    try {

      const searchData = await axios.get(import.meta.env.VITE_NEWS_API_URL.replace('{example}', searchRef.current.value.toLowerCase()));
      dispatch(setNewsList(searchData.data.articles));
      searchRef.current.value = "";
      
    } catch (error) {

      failedToast(!error.response ? error.message : error.response.data.response);
      removeToast(1500);
      searchRef.current.value = "";

    }
     
  }

  return (
    <header className={headerCss.headerDiv}>
       {/* This is the title */}
       <h1 style={state.otherNavOption}>News Hub</h1> 
       {/* This is the Search bar */}
       <div style={state.searchBar} className={headerCss.searchBar}> 
          <div className={`${headerCss.leftSearchIcon} ${headerCss.searchIcon}`}><iconify-icon icon="iconamoon:search-thin" width ="20" height = "20"></iconify-icon></div>
          {/* This is the back button of mobile search bar view it only visiable in mobile view */}
          <div onClick={onLeftBackBtnClicked} className={`${headerCss.leftBackIcon} ${headerCss.searchIcon}`}><iconify-icon icon="mdi:arrow-back" width ="23" height = "23"></iconify-icon></div>
          <input ref={searchRef} type='text' placeholder='Search' />
          <div onClick={onSearch} className={`${headerCss.rightSearchIcon} ${headerCss.searchIcon}`}><iconify-icon icon="gg:search" width="20" height="20"></iconify-icon></div>
       </div>
       {/* This is the Right side icons layout/div */}
       <div style={state.otherNavOption} className={headerCss.rightLayout}>
        <div onClick={onMobileSearchBtnClicked} className={`${headerCss.searchIcon} ${headerCss.mobileSearchIcon}`}>
          <iconify-icon icon="gg:search" width="20" height="20"></iconify-icon>
          </div>
          <div className={headerCss.favIconDiv}>
          <div className={headerCss.fabIcon}><iconify-icon onClick = {onSaveNewsBtnClicked} icon="material-symbols:favorite-outline" width="20" height="20"></iconify-icon></div>
          {/*<label>2</label>*/}
        </div>
         {/* This is the login/signup button*/}
        <div className={headerCss.accountDiv}>
          <button style={{display : accountBtnVisiablity}} onClick={accountBtnClicked}>Account</button>
          <div onClick={onAccountIconClicked} style={{display : accountBtnVisiablity == "block" ? "none" : "flex"}} className={headerCss.profile}>
            <label>{cookies.get('userGmail')?.toUpperCase().substring(0,1)}</label>
          </div>
        </div>
       </div>
    </header>
  )
}

export default Header;