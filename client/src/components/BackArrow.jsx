function BackArrow({setBotPlay,setMultiplayer,multiplayer,id,setPlayerClicked}) {

 function handleClick(){
    if(id === "backArrow"){
      setBotPlay(false);
    }else if(id === "back"){
     if(multiplayer === "true"){
        setMultiplayer(false);
     }else{
        setPlayerClicked('');
     }
    }
 }

  return <img onClick={handleClick} id={id} src="icons/arrow-left.svg" alt="arrow left button" />
}

export default BackArrow;
