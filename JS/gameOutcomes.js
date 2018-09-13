"use strict";

//Outcomes
function ppPayout(){
  if(pHand.type!="High Card"){
    account.balance+=(pHand.winInfo.pp+1)*account.pairplus;
    slideChipStack('topDown', ['Pair+'],[account.pairplus*pHand.winInfo.pp],()=>{
      displayBetChips(account.pairplus*(pHand.winInfo.pp+1),xBetLocsArr[0],anictx);
      slideChipStack('midDown',['Pair+'], [account.pairplus*(pHand.winInfo.pp+1)],()=>{
        displayBalance();
        glassBtnCanvas.style.zIndex = -1;
        canPlay = true;
      },50)
    });
  }else{
    slideChipStack('midUp',['Pair+'],[account.pairplus],()=>{
      glassBtnCanvas.style.zIndex = -1;
      canPlay = true;
    });
  }
}

function playerWins(){
  gctx.fillText('Player Wins',cWidth/2,cHeight/2,cWidth);
  console.log('PlayerWins');
  account.balance+=4*account.ante;//Can change with different game rules
  slideChipStack('topDown', ['Ante','Play'], [account.ante, account.play],()=>{
    anictx.clearRect(xBetLocsArr[1],0,chipW,cHeight);
    anictx.clearRect(xBetLocsArr[2],0,chipW,cHeight);
    displayBetChips(account.ante*2,xBetLocsArr[1],anictx)
    displayBetChips(account.ante*2,xBetLocsArr[2],anictx)
    slideChipStack('midDown',['Ante','Play'], [account.ante*2, account.ante*2],()=>{},50)
  });
}

function playerLoses(){
  gctx.fillText('Dealer Wins',cWidth/2,cHeight/2,cWidth);
  console.log('Player loses');
  slideChipStack('midUp',['Ante','Play'], [account.ante, account.play],()=>{},50);
}

function push(){
  console.log('push');
  gctx.fillText('Push',cWidth/2,cHeight/2,cWidth);
  account.balance+=account.ante;
  account.balance+=account.play;
  slideChipStack('midDown',['Ante','Play'], [account.ante, account.play],()=>{});
}
