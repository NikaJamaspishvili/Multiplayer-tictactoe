import './App.css';
import { useState,useEffect } from 'react';

import BotPlayers from './gamePlan/bot/BotPlayers';
import Game from './gamePlan/bot/Game';

import io from 'socket.io-client';


const socket = io.connect(import.meta.env.VITE_SERVER_URL);

function App() {

const [isFirstRender,setIsFirstRender]=useState(true);
const [botPlay,setBotPlay]=useState(false);
const [multiplayer,setMultiplayer]=useState(false);



window.onbeforeunload = function() {

  if(multiplayer === true){ 
    socket.emit('disconnecting');
  }
  
};

useEffect(()=>{

if(isFirstRender === true) {
  setIsFirstRender(false);
  return
}

socket.emit('join_room',localStorage.getItem('roomId'));

},[multiplayer === true]);

 
 
 return <div>

 {!botPlay && !multiplayer ? <div className='wrapper'>

  <button onClick={()=>{setBotPlay(true)}}>Bot Match</button>

  <button onClick={()=>{setMultiplayer(true)}}>Multiplayer</button>
  
  </div>:null}

{botPlay && <BotPlayers />}

{multiplayer && <div className='multiplayerGameDiv'> <Game multiplayer = 'true' socket={socket} /> </div>}


  </div>
  
}

export default App
