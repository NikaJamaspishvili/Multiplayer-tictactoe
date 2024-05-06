import './App.css';
import { useState } from 'react';

import BotPlayers from './bot/BotPlayers';

function App() {

const [botPlay,setBotPlay]=useState(false);
const [multiplayer,setMultiplayer]=useState(false);



  return <div>

 {!botPlay && !multiplayer ? <div className='wrapper'>

  <button onClick={()=>{setBotPlay(true)}}>Bot Match</button>

  <button onClick={()=>{setMultiplayer(true)}}>Multiplayer</button>
  
  </div>:null}

{botPlay && <BotPlayers/>}

{multiplayer && <div>
  
<h1>people are playing with you...</h1>
 
</div>}

  </div>
  
}

export default App
