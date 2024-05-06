import './game.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX,faO,faArrowsRotate } from '@fortawesome/free-solid-svg-icons'

import { useRef } from 'react';
import { useState,useEffect } from "react";
import { handleBotClick } from './botLogics.js';

function Game({chosenBot}) {

const [clickPermission,setClickPermission]=useState(true);
const [array,setArray]=useState(["","","","","","","","",""]);
const [gameover,setGameover]=useState(false);
const [wonBy,setWonBy]=useState('');
const [scoreX,setScoreX]=useState(0);
const [ScoreO,setScoreO]=useState(0);

function handleClick(result,index){


if(!result && clickPermission){

setClickPermission(false);

let tempoArray=[...array];

tempoArray[index] = 'x';

setArray(tempoArray);

checkWinner(tempoArray);

handleBotClick(chosenBot,tempoArray,setArray,setClickPermission,checkWinner);

}

}

function checkWinner(tempoArray){


let won=false;

    const winningCombinations = [
        // Rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Diagonals
        [0, 4, 8],
        [2, 4, 6]
      ];

//if game has been over by someone winning it

for(let i=0;i<winningCombinations.length;i++){

const [a,b,c]=winningCombinations[i];

if(tempoArray[a] !== '' && tempoArray[a] === tempoArray[b] && tempoArray[a] === tempoArray[c]){
  setGameover(true);
  setClickPermission(false);

  won=true;
  if(tempoArray[a] === 'x'){
    setScoreX(scoreX + 1);
    setWonBy('x')
  }else if(tempoArray[a] === 'o'){
   setScoreO(ScoreO + 1);   
   setWonBy('o');
  }

  return
}
}

//if game ended by draw

if(won!==true && tempoArray.find(element => element === '') === undefined){
    setGameover(true);
    setWonBy('');
}


}


function restartGame(){
 
 setGameover(false);
 setArray(["","","","","","","","",""]);
 setClickPermission(true);
 setWonBy('');
}


return  <div className="gameMainDiv">

{gameover && <button onClick={restartGame}><FontAwesomeIcon icon={faArrowsRotate} /></button>}

<div className='scoreDiv'>
<p style={{color:wonBy === 'x' && 'red', transform: wonBy === 'x' && 'scale(1.3)'}}>{<FontAwesomeIcon icon={faX} />}: {scoreX}</p>
<p style={{color:wonBy === 'o' && 'red', transform: wonBy === 'o' && 'scale(1.3)'}}>{<FontAwesomeIcon icon={faO} />}: {ScoreO}</p>
</div>

<div className="boardWrapper">

   {array.map((result,index)=>{

  return <div onClick={()=>{handleClick(result,index)}} key={index}>{result === 'x' ? <FontAwesomeIcon icon={faX} /> : result === 'o' && <FontAwesomeIcon icon={faO} />}</div>

   })}

    </div>
    </div>
}

export default Game