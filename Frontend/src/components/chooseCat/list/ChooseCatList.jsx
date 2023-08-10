import React, { useState } from 'react';
import chooseCatCss from '../choosecat.module.css';

function ChooseCatList({name, selectCatList}) {
  const [state ,setState] = useState({
    color : "#000",
    backgroundColor : "#fff"
  });
  const onCatItemClicked = () => {
    
    if(!Object.hasOwn(selectCatList, name)) {
      selectCatList[name] = name.toLowerCase();
    }else{
      delete selectCatList[name];
    }

    setState({
      color : state.color == "#000" ? "#fff" : "#000",
      backgroundColor : state.backgroundColor == "#fff" ? "#32CD32" : "#fff"
    })
  }
  return (
    <div style={state} onClick={onCatItemClicked} className={chooseCatCss.listItem}>
        <label>{name}</label>
    </div>
  )
}

export default ChooseCatList