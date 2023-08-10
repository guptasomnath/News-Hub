import React, {useEffect} from 'react';
import './App.css';

//import components
import Header from './components/header/Header';
import Categories from './components/categories/Categories';
import ShowNews from './components/shownews/ShowNews';
import Auth from './components/auth/Auth';
import SaveNews from './components/savenews/SaveNews';
import ReadNews from './components/readnews/ReadNews';
import Toast from './components/toast/Toast';
import Loading from './components/loading/Loading';

//import packages
import {Routes, Route} from 'react-router-dom';

function App() {

  useEffect(()=>{
    document.documentElement.style.setProperty('--fullPageHeight', window.innerHeight + "px");
  },[]);
  addEventListener('resize', () => {
    document.documentElement.style.setProperty('--fullPageHeight', window.innerHeight + "px");
  })

  return (
    <div className='App'>
       <Loading />
       <Toast />
       <Auth />
       <Header />
       <Routes>
         <Route path='/' element = {<ShowNews />}/>
         <Route path='/read' element = {<ReadNews />} />
         <Route path='/saved' element = {<SaveNews />} />
       </Routes>
    </div>
  )
}

export default App
