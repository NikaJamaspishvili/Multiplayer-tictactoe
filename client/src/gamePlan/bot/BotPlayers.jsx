import { useState } from 'react';

import './botplayer.css';
import Game from './Game';
import BackArrow from '../../components/BackArrow';

function BotPlayers({setBotPlay,setMultiplayer}) {

 const [playerClicked,setPlayerClicked]=useState('');

  return  <div className='botPlayersWrapper' style={{backgroundImage:playerClicked.length > 0 ? "url('https://i.pinimg.com/736x/9f/db/3d/9fdb3d6bafe9083703e539c193ca9a74.jpg')": ''}}>
    <BackArrow setBotPlay={setBotPlay} setMultiplayer={setMultiplayer} id={'backArrow'}/>
  {playerClicked.length === 0 && <div className='difficultyWrapper'>

  <section onClick={()=>{setPlayerClicked('drago')}}>
    <img src="https://i.pinimg.com/236x/5c/7b/ef/5c7befbc351c219cf6e9818fdbc19d49.jpg" alt="drago" />
    <h1>DRAGO</h1>
    <p>(noob)</p>
  </section>

  <section onClick={()=>{setPlayerClicked('nugo')}}>
    <img src="https://i.pinimg.com/564x/f5/b0/bc/f5b0bce4db90f5dace6ec294bd7961c9.jpg" alt="nugo" />
    <h1>NUGO</h1>
    <p>(casual)</p>
  </section>

  <section onClick={()=>{setPlayerClicked('kriko')}}>
    <img src="https://i.pinimg.com/236x/da/79/06/da7906ae4914912a4f4b6c427c5a74ff.jpg" alt="kriko" />
    <h1>KRIKO</h1>
    <p>(pro)</p>
  </section>

</div>}

{playerClicked.length > 0 && <Game chosenBot={playerClicked} setBotPlay={setBotPlay} setPlayerClicked={setPlayerClicked} setMultiplayer={setMultiplayer}/>}

  </div>
}

export default BotPlayers