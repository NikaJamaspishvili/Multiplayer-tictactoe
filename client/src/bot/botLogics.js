const handleBotClick=(chosenBot,array,setArray,setClickPermission,checkWinner)=>{

if(chosenBot === 'drago'){

//if player chose drago it means player wants easy game
//create random number between one and nine
//check if that numbers index is empty in array
//if yes than change the array
//else pick another number and repeat

setClickPermission(true);

randomAttack(array,setArray,checkWinner);

}

if(chosenBot === 'nugo'){

defenceANDattack(array,setArray,randomAttack,checkWinner,'x');

}

if(chosenBot === 'kriko'){

//offense and defence use the same logic with one difference in string letters
//for this reason we use the same function with one different strings for each one

defenceANDattack(array,setArray,randomAttack,checkWinner,'x');

defenceANDattack(array,setArray,()=>{},checkWinner,'o');
}

}

function defenceANDattack(array,setArray,attackFunction,checkWinner,string){

//I am creating the defenceANDattack system for nugo character
//defenceANDattack happens with else if statements where results get compared with each other.
//if two x are side by side, code will automatically put o where it is needed for player not to win.
//if two x are apart from each other and there is open space, code will automatically put o where it is needed for player not to win.

let tempoArray=[...array];

const possibleCombinations = [
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

 for(let i=0;i<possibleCombinations.length;i++){

  const [a,b,c] = possibleCombinations[i]

  if(tempoArray[a] === tempoArray[b] && tempoArray[a] === string && tempoArray[c] ===''){
    tempoArray[c] = 'o';
    setArray(tempoArray);

    checkWinner(tempoArray);
    return
  }
  
  else if(tempoArray[b] === tempoArray[c] && tempoArray[a] === '' && tempoArray[c] ===string){
    tempoArray[a] = 'o';
    setArray(tempoArray);

    checkWinner(tempoArray);

    return
  }
  
  else if(tempoArray[a] === tempoArray[c] && tempoArray[a] === string && tempoArray[b] === ''){
   tempoArray[b] = 'o';
   setArray(tempoArray);

   checkWinner(tempoArray);
   return
  }
 } 

//using props for this function to then use another function code for this place.

attackFunction(array,setArray,checkWinner);
}

function randomAttack(array,setArray,checkWinner){
    let tempoArray=[...array];
    let freeIndexes=[];

for(let i=0;i<tempoArray.length;i++){
    if(tempoArray[i] === ''){
        freeIndexes.push(i);
    }
}

let randomNumber= Math.floor(Math.random() * freeIndexes.length);

let chosenNumber = freeIndexes[randomNumber];

tempoArray[chosenNumber] = 'o';

setArray(tempoArray);

checkWinner(tempoArray);
}

export {handleBotClick};