import './game.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faO, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { handleBotClick } from './botLogics.js';
import BackArrow from '../../components/BackArrow.jsx';

function Game({ chosenBot, multiplayer, socket,setBotPlay,setMultiplayer,setPlayerClicked }) {
  const [clickPermission, setClickPermission] = useState(true);
  const [array, setArray] = useState(["", "", "", "", "", "", "", "", ""]);
  const [gameover, setGameover] = useState(false);
  const [wonBy, setWonBy] = useState('');
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);
  const [whoseTurn,setWhoseTurn]= useState('x');
  const [notification,setNotification] = useState(false);
  const [notifyMessage,setNotifyMessage] = useState('');
  const [firstMove,setFirstMove] = useState(false);
  const [seconds, setSeconds] = useState(5);
  const [btnPressed,setBtnPressed] = useState(false);

  useEffect(() => {
if(gameover === false && multiplayer){
    if(seconds > 0 && btnPressed === true){
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);
  
    return () => clearInterval(intervalId);
    }
    
    if(seconds === 0){
      setGameover(true);      
     
      if(whoseTurn === 'x'){
       setWonBy('o');
       setScoreO(scoreO + 1);
      }else{
      setWonBy('x');
      setScoreX(scoreX + 1);
      }
    }
  }
  }, [seconds,gameover === false,btnPressed]);


useEffect(() => {

if(multiplayer === 'true'){

    const handleReceiveArray = (object) => {
   checkWinner(object.tempoArray,object.scoreX,object.scoreO);
   setArray(object.tempoArray);
   setWhoseTurn(object.playerTurn);
   setClickPermission(true);
   setSeconds(5);
   setBtnPressed(true);
    };
    
    const restart = ()=>{
      setGameover(false);
      setArray(["", "", "", "", "", "", "", "", ""]);
      setClickPermission(true);
      setWonBy('');
      setWhoseTurn('x');
      setSeconds(5);
    }

    const handleDisconnect = (object)=>{    
      setNotification(true);
      setClickPermission(false);
      setGameover(false);
      setNotifyMessage(object.message);
      setBtnPressed(false);
    }

    const handleRoomJoin = (object)=>{
    setClickPermission(true);
    setArray(["", "", "", "", "", "", "", "", ""]);
    setScoreO(0);
    setScoreX(0);
    setWhoseTurn('x');
    setWonBy('');
    setGameover(false);
    setNotification(false);
    setSeconds(5);

    if(object.moveOption === 'x'){
      setFirstMove(true);
    }


  }

    socket.on('clientRestartGame',restart)          //this connection handles restart function

    socket.on('receiveArray', handleReceiveArray);  //this connection handles making moves function
  
    socket.on('userDisconnected',handleDisconnect); //this connection handles notification when user disconencts from room

    socket.on('joinedRoom',handleRoomJoin);


    // Cleanup listener on component unmount
    return () => {
      socket.off('receiveArray', handleReceiveArray);
      socket.off('clientRestartGame',restart);
      socket.off('userDisconnected',handleDisconnect);
      socket.off('joinedRoom',handleRoomJoin);
    };
}
  }, [socket]);



  function handleClick(result, index) {
    if (!result && clickPermission) {

      if(multiplayer && !array.find(item => item === 'x') && firstMove!==true){
        alert("you can't make the first move, because you aren't the creator of match game or other player hasn't joined yet");
      }else{
      setClickPermission(false);
      setSeconds(5);
      setBtnPressed(true);

      let tempoArray = [...array];
      tempoArray[index] = whoseTurn;
      setArray(tempoArray);

     {multiplayer ? checkWinner(tempoArray,scoreX,scoreO) : checkWinner(tempoArray)}

      if (multiplayer === 'true') {
        multiplayerModeClick(index,tempoArray);
      } else {
        handleBotClick(chosenBot, tempoArray, setArray, setClickPermission, checkWinner);
      }
    }
  }
  }

//solve the array problem

  const multiplayerModeClick = (index,tempoArray) => {
   
  let playerTurn = whoseTurn;

  if(playerTurn === 'x'){
    playerTurn = 'o';
  }else{
    playerTurn = 'x'
  }

setWhoseTurn(playerTurn);

socket.emit('sendArray', {tempoArray,playerTurn,scoreX,scoreO});
}

  function checkWinner(tempoArray,Xscore,Oscore) {
    let won = false;
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

    // Check for a win
    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];

      if (tempoArray[a] !== '' && tempoArray[a] === tempoArray[b] && tempoArray[a] === tempoArray[c]) {
        setGameover(true);
        setClickPermission(false);
        won = true;

        if (tempoArray[a] === 'x') {
          setScoreX(multiplayer ? Xscore + 1 : scoreX + 1);
          setWonBy('x');
        } else if (tempoArray[a] === 'o') {
          setScoreO(multiplayer ? Oscore + 1 : scoreO + 1);
          setWonBy('o');
        }
        return;
      }
    }

    // Check for a draw
    if (!won && tempoArray.every(element => element !== '')) {
      setGameover(true);
      setWonBy('');
    }
  }

  function restartGame() {
    setGameover(false);
    setArray(["", "", "", "", "", "", "", "", ""]);
    setClickPermission(true);
    setWonBy('');
    setWhoseTurn('x');
    setSeconds(5);
  
  {multiplayer && socket.emit('restartGame',{status:1})}
  }

  return (
    <div className="gameMainDiv">
      <BackArrow id={'back'} multiplayer={multiplayer} setPlayerClicked={setPlayerClicked} setBotPlay={setBotPlay} setMultiplayer={setMultiplayer}/>
    {multiplayer && <p id='timer'>{seconds}</p>}

    {notification && <div className='disconnectNotification'> 
      <p>{notifyMessage}</p>
     </div>}

     {multiplayer && gameover === false ? <h1 id='playerStatement'>{whoseTurn}'s Turn</h1> : null}

      {gameover && <button onClick={restartGame}><FontAwesomeIcon icon={faArrowsRotate} /></button>}

      <div className='scoreDiv'>
        <p style={{ color: wonBy === 'x' ? 'red' : '', transform: wonBy === 'x' ? 'scale(1.3)' : '' }}>
          <FontAwesomeIcon icon={faX} />: {scoreX}
        </p>
        <p style={{ color: wonBy === 'o' ? 'red' : '', transform: wonBy === 'o' ? 'scale(1.3)' : '' }}>
          <FontAwesomeIcon icon={faO} />: {scoreO}
        </p>
      </div>

      <div className="boardWrapper">
        {array.map((result, index) => (
          <div onClick={() => handleClick(result, index)} key={index}>
            {result === 'x' ? <FontAwesomeIcon icon={faX} /> : result === 'o' ? <FontAwesomeIcon icon={faO} /> : ''}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Game;
