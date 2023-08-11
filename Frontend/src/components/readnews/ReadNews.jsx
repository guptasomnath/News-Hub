import React, { useEffect } from "react";
import cookies from 'js-cookie';
import axios from "axios";
import readNewsCss from "./readnews.module.css";

//import components
import NewsList from "../shownews/newslist/NewsList";
import { useSelector } from "react-redux";

function ReadNews() {
  const readingData = useSelector((state) => state.readnews);
  const catagoryArray = useSelector((state) => state.catlist);
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

  const sendReadingHabitTopics = async () => {
   //if user not loged in then don't run next line of code
    const findTopicKeyWord = findTopic();
    if(!cookies.get('userId') || findTopicKeyWord == "") return;

    //send user reading habit topic
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const dbRes = await axios.post(baseUrl + '/interest/score/', {
      id : cookies.get('userId'),
      key : findTopicKeyWord,
      value : 1
    });
  }

  function findTopic(){
    let topicName = "";
    for(let i = 0; i < catagoryArray.length; i++){
       if(readingData.title.toLowerCase().includes(catagoryArray[i].toLowerCase())){
        topicName = catagoryArray[i].toLowerCase();
        break;
       }

       if(readingData.description.toLowerCase().includes(catagoryArray[i].toLowerCase())){
        topicName = catagoryArray[i].toLowerCase();
        break;
       }

       if(readingData.content.toLowerCase().includes(catagoryArray[i].toLowerCase())){
        topicName = catagoryArray[i].toLowerCase();
        break;
       }
    }
    return topicName;
  }

  useEffect(()=>{
    sendReadingHabitTopics();
  },[])

  if(Object.keys(readingData).length == 0){
    return (
      <div className={readNewsCss.noDataDiv}>
      <h1>No Data Found</h1>
      </div>
    )
  }

  return (
    <div className={readNewsCss.readNewsLayout}>
      <div className={readNewsCss.articalDetail}>
        <h2>
        {readingData.title}
        </h2>
        <label className={readNewsCss.descriptionText}>{readingData.description}</label>

        <p className={readNewsCss.dateText}>{convartDate(readingData.publishedAt)}</p>

        <div className={readNewsCss.imageView} style={{
          backgroundImage : `url(${readingData.image})`
        }}></div>

        <p className={readNewsCss.articalStoryText}>{readingData.content}</p>
      </div>  
    </div>
  );
}

export default ReadNews;
