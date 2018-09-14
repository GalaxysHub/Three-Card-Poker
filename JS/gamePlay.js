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
  canPlay = true;
  dQlfy = true;
  tctx.clearRect(0,0,cWidth,cHeight);

  account.play = 0;
  account.balance -= (account.ante+account.pairplus)
  deck = deckCards.slice(0,52);
  pHand = dealHand();
  getWinInfo(pHand);
  dealCards();
  setTimeout(()=>{
    displayHandType(pHand);
    if(account.pairplus>0) ppPayout();
    else{
      glassBtnCanvas.style.zIndex = -1;
      canPlay = true;
    }
  },2000);
}

function play(){
  account.play = account.ante;
  account.balance -= account.play;
  // animations
  slideChipStack('bottomUp',['Play'],[account.play],()=>{
    displayPlayChips(anictx,anictx);
    setTimeout(()=>{
      dealerAction();
      findWinner();
    },500);
  });
}

function fold(){
  slideChipStack('midUp', ['Ante'],[account.ante],()=>{
    dealerAction();
    setTimeout(discard,1000);
  });
}

function dealerAction(){
    dHand = dealHand();
    drawDealerHand();
    getWinInfo(dHand);
    displayHandType(dHand);
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
    dealerDisqualification();
  }else if(dQlfy){
    let dPos = dHand.winInfo.pos,
      pPos = pHand.winInfo.pos;
    if(dPos<pPos){playerWins();}
    else if(dPos==pPos){settlePush();}
    else{playerLoses();}
  }
}

//compares dealer and player hands if type is the same
function settlePush(){
  let pSort = pHand.sort,
    dSort = dHand.sort;

  if(pHand.type=="Pair"){
    let pPair = pSort[1],
      dPair = dSort[1];
    //Find Higher Pair
    if(pPair>dPair){playerWins()}
    else if(pPair<dPair){playerLoses();}
    else{compareHighCard(2);}//same pair
  }else{
    if(pHand.type=="Straight"||pHand.type=="Straight Flush"){
      //Looks for lower straight condition else compares normally
      if(dSort[2]==14&&dSort[1]<pSort[1]){playerWins();}
      else if(pSort[2]==14&&pSort[1]<dSort[1]){playerLoses();}
      else{compareHighCard(2);}
    }else{compareHighCard(2);}
  }

  function compareHighCard(n){
    let p = pSort[n], d = dSort[n];
    if(p>d){playerWins();}
    else if(p<d){playerLoses();}
    else{
      if(n==0){push();}
      else{compareHighCard(n-1)}
    }
  }
}

function discard(){
  account.play = 0;
  account.disPlay = 0;
  anictx.clearRect(0,0,cWidth,cHeight);
  gctx.clearRect(0,0,cWidth,cHeight);
  glassBtnCanvas.style.zIndex = -1;
  let pace = 40,
    delay = 10;

  for(let i = 0; i<numCards; i++){
    let pCard = cardImgMap.get(pHand[i]),
      dCard = cardImgMap.get(dHand[i]),
      xStart = cardXLocArr[i];

    animations.slide(pCard, xStart, pYLoc, -2*cardW, -2*cardH, cardW, cardH, pace, delay*i, pAnictx, ()=>{});
    animations.slide(dCard, xStart, dYLoc, -2*cardW, -2*cardH, cardW, cardH, pace, delay*i, ctx, ()=>{
      canRebet = true;
    });
  }
}

function rebet(){
  slideChipStack('bottomUp',['Pair+','Ante'], [account.pairplus, account.ante],()=>{
    displayAllBetChips();
    newGame();
    displayBalance();
  },50);
}
