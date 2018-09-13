"use strict";

let dQlfy;
let canPlay = true;
let startGame = true;
const account = {
  balance: 10000,
  pairplus: 0,
  ante: 0,
  play: 0,
  disBalance: 10000,
  disPairplus: 0,
  disAnte: 0,
  disPlay: 0,
}

function newGame(){
  glassBtnCanvas.style.zIndex = 10;
  glassCanvas.style.zIndex =10;
  //Move these later
  tctx.clearRect(0,0,cWidth,cHeight);
  pAnictx.clearRect(0,0,cWidth,cHeight);
  gctx.clearRect(0,0,cWidth,cHeight);
  ctx.clearRect(0,0,cWidth,cHeight);

  account.play = 0;
  account.balance -= (account.ante+account.pairplus)
  deck = deckCards.slice(0,52);
  pHand = dealHand();
  getWinInfo(pHand);
  dealCards();
  setTimeout(()=>{
    gctx.fillText(pHand.type,cWidth/2, pYLoc+cardH/2,cWidth/2);
    if(account.pairplus>0) ppPayout();
    else{
      glassBtnCanvas.style.zIndex = -1;
      canPlay = true;
    }
    //write player's hand type
  },2000);
  console.log(account.balance);

}

function play(){
  if(canPlay){
    canPlay = false;
    glassBtnCanvas.style.zIndex = 10;
    account.balance -= account.ante;
    account.play = account.ante;
    // animations
    slideChipStack('bottomUp',['Play'],[account.play],()=>{
      displayPlayChips(anictx);
      setTimeout(()=>{
        dealerAction();
        findWinner();
      },500);
    });
  }
}

function fold(){
  if(canPlay){
    canPlay = false;
    slideChipStack('midDown', ['Ante'],[account.ante],()=>{
      dealerAction();
    });
  }
}

function dealerAction(){
    glassBtnCanvas.style.zIndex = 10;
    dHand = dealHand();
    drawDealerHand();
    console.log(account.balance);
    getWinInfo(dHand);
    gctx.fillText(dHand.type,cWidth/2, dYLoc+cardH/2,cWidth/2);
    // startGame = true;
    getChipStacks();
    setTimeout(()=>{
      discard();
    },2000)
}

//Algorithiums hardcoded for 3 card hands due to computational simplicity
//Dynamic algos can be seen in Video Poker game
function findHandType(hand){
  let cardVals = hand.map(c=>{return parseInt(c.slice(0,c.length-1))});
  let cardSuits = hand.map(c=>{return c.slice(c.length-1,c.length)});
  let uniqVals = [...new Set(cardVals)];
  let uniqSuits = [...new Set(cardSuits)];

  // adds sorted values to hand
  let cSort = cardVals.sort(function(a, b){return a-b})
  hand.sort = cSort;

  if(uniqVals.length==2){return 'Pair';}//Pair
  else if(uniqVals.length==1){return '3 of a Kind';}//3 of a Kind
  else if(uniqSuits.length==1){//Flush condition
    //checks for A as low card and normal straight.
    if(cSort[2]-cSort[0]==2||(cSort[2]==14&&cSort[0]==2&&cSort[1]==3)){return 'Straight Flush';}
    else{return 'Flush';};
  }
  if(cSort[2]-cSort[0]==2||(cSort[2]==14&&cSort[0]==2&&cSort[1]==3)){return 'Straight';}

  if(hand===dHand){
    if(cSort[2]<12){dQlfy=false;}
  }
  return 'High Card';
}

//appends properties to hand Array object
function getWinInfo(hand){
  hand.type = findHandType(hand);//This is Javascript
  if(hand.type!='High Card'){hand.winInfo = paytableMap.get(hand.type)}
  else(hand.winInfo = {pos: 0})
}

//Looks for condition for Player Win or Push. Player loses by default.
function findWinner(){
  if(dQlfy==false){
    gctx.fillText('Dealer Does Not Quality',cWidth/2,cHeight/2,cWidth*0.8);
    account.balance+=3*account.ante;
    console.log('dealer does not qualify');
    //Animations
    slideChipStack('topDown', ['Ante'],[account.ante],()=>{
      anictx.clearRect(xBetLocsArr[1],0,chipW,cHeight);
      displayBetChips(account.ante*2,xBetLocsArr[1],anictx)
      displayPlayChips(anictx);
        slideChipStack('midDown',['Ante','Play'], [account.ante*2, account.ante],()=>{
        },50)
    });
  }else if(dQlfy){
    let dPos = dHand.winInfo.pos,
      pPos = pHand.winInfo.pos;
    if(dPos<pPos){playerWins();}
    else if(dPos==pPos){settlePush();}
    else{playerLoses();}
  }
  console.log(account.balance);
  setTimeout(()=>{
    account.play = 0; //Move later;
  },1000);
}

//finds winner if player and dealer have same type of hand
function settlePush(){
  let pSort = pHand.sort,
  dSort = dHand.sort;

  if(pHand.type=="Pair"){
    let pPair = pSort[1],
      dPair = dSort[1];
    //Find Higher Pair
    if(pPair>dPair){playerWins()}
    else if(pPair==dPair){compareHighCard();}
    else{playerLoses();}
  }else{
    if((pHand.type=="Straight"||pHand.type=="Straight Flush")&&dSort[3]==14&&dSort[2]<pSort[2]){playerWins();}//Looks for lower straight condition
    else{compareHighCard();}
  }

  function compareHighCard(){
    if(pSort[2]>dSort[2]){playerWins();}
    else if(pSort[2]==dSort[2]){
      if(pSort[1]>dSort[1]){playerWins();}
      else if(pSort[1]==dSort[1]){
        if(pSort[0]>dSort[0]){playerWins();}
        else if(pSort[0]==dSort[0]){push();}
      }
    }
    else{playerLoses();}
  }
}

function discard(){
  account.play = 0;
  account.disPlay = 0;
  anictx.clearRect(0,0,cWidth,cHeight);
  gctx.clearRect(0,0,cWidth,cHeight);
  let pace = 40,
    delay = 10;

  for(let i = 0; i<numCards; i++){
    let pCard = cardImgMap.get(pHand[i]),
      dCard = cardImgMap.get(dHand[i]),
      xStart = cardXLocArr[i];

    animations.slide(pCard, xStart, pYLoc, -2*cardW, -2*cardH, cardW, cardH, pace, delay*i, pAnictx, ()=>{});
    animations.slide(dCard, xStart, dYLoc, -2*cardW, -2*cardH, cardW, cardH, pace, delay*i, ctx, ()=>{
      glassCanvas.style.zIndex = -1;
      glassBtnCanvas.style.zIndex = -1;
    });
  }
}

function rebet(){
  slideChipStack('bottomUp',['Pair+','Ante'], [account.pairplus, account.ante],()=>{
    displayPairPlusChips(anictx);
    displayAnteChips(anictx);
  },50);
}
