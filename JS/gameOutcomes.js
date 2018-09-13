"use strict";

//Outcomes
function ppPayout(){
  if(pHand.type!="High Card"){
    gctx.strokeText("Pair Plus Winner",cWidth/2,cHeight/2,cWidth*0.8);
    gctx.fillText("Pair Plus Winner",cWidth/2,cHeight/2,cWidth*0.8);
    account.balance+=(pHand.winInfo.pp+1)*account.pairplus;
    slideChipStack('topDown', ['Pair+'],[account.pairplus*pHand.winInfo.pp],()=>{
      displayBetChips(account.pairplus*(pHand.winInfo.pp+1),xBetLocsArr[0],tctx);
      slideChipStack('midDown',['Pair+'], [account.pairplus*(pHand.winInfo.pp+1)],()=>{
        displayBalance();
        glassBtnCanvas.style.zIndex = -1;
        canPlay = true;
        gctx.clearRect(0,cHeight/3,cWidth,cHeight/3);
      },50)
    });
  }else{
    slideChipStack('midUp',['Pair+'],[account.pairplus],()=>{
      glassBtnCanvas.style.zIndex = -1;
      canPlay = true;
    });
  }
}

function dealerDisqualification(){
  // gctx.fillText('Dealer Does Not Quality',cWidth/2,cHeight/2,cWidth*0.8);
  account.balance+=3*account.ante;
  console.log('dealer does not qualify');
  //Animations
  slideChipStack('topDown', ['Ante'],[account.ante],()=>{
    anictx.clearRect(xBetLocsArr[1],0,chipW,cHeight);
    displayBetChips(account.ante*2,xBetLocsArr[1],tctx)
    displayPlayChips(anictx);
      slideChipStack('midDown',['Ante','Play'], [account.ante*2, account.ante],()=>{
        displayBalance();
        discard();
      },50)
  });0
}

function playerWins(){
  gctx.strokeText('Player Wins',cWidth/2,cHeight/2,cWidth);
  gctx.fillText('Player Wins',cWidth/2,cHeight/2,cWidth);
  account.balance+=4*account.ante;//Can change with different game rules
  slideChipStack('topDown', ['Ante','Play'], [account.ante, account.play],()=>{
    anictx.clearRect(xBetLocsArr[1],0,chipW,cHeight);
    anictx.clearRect(xBetLocsArr[2],0,chipW,cHeight);
    displayBetChips(account.ante*2,xBetLocsArr[1],tctx)
    displayBetChips(account.ante*2,xBetLocsArr[2],tctx)
    slideChipStack('midDown',['Ante','Play'], [account.ante*2, account.ante*2],()=>{
      displayBalance();
      discard();
    },50)
  },50);
}

function playerLoses(){
  gctx.strokeText('Dealer Wins',cWidth/2,cHeight/2,cWidth);
  gctx.fillText('Dealer Wins',cWidth/2,cHeight/2,cWidth);
  slideChipStack('midUp',['Ante','Play'], [account.ante, account.play],()=>{
    displayBalance();
    discard();
  },50);
}

function push(){
  gctx.strokeText('Push',cWidth/2,cHeight/2,cWidth);
  gctx.fillText('Push',cWidth/2,cHeight/2,cWidth);
  account.balance+=account.ante;
  account.balance+=account.play;
  slideChipStack('midDown',['Ante','Play'], [account.ante, account.play],()=>{
    displayBalance();
    discard();
  },50);
}
