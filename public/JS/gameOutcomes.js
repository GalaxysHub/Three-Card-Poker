"use strict";

//Outcomes
function ppPayout(){
  if(pHand.type!="High Card"){
    gctx.strokeText("Pair Plus Winner",cWidth/2,cHeight/2,cWidth*0.8);
    gctx.fillText("Pair Plus Winner",cWidth/2,cHeight/2,cWidth*0.8);
    let payout = account.pairplus*(pHand.winInfo.pp+1);
    account.balance+=payout;
    slideChipStack('topDown', ['Pair+'],[account.pairplus*(pHand.winInfo.pp)],()=>{
      let xLoc = xBetLocsArr[0];
      anictx.clearRect(xLoc,-chipW,chipW*2,cHeight);
      displayBetChips(payout,xLoc,tctx,anictx);
      slideChipStack('midDown',['Pair+'], [payout],()=>{
        updateBalance(payout);
        displayBalance();
        glassBtnCanvas.style.zIndex = -1;
        canPlay = true;
        gctx.clearRect(0,cHeight*.375,cWidth,cHeight*.25);
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
    let xLoc = xBetLocsArr[1];
    anictx.clearRect(xLoc,-chipW,chipW*2,cHeight);
    displayBetChips(account.ante*2,xLoc,tctx,anictx);
      slideChipStack('midDown',['Ante','Play'], [account.ante*2, account.ante],()=>{
        updateBalance(account.ante*3);
        displayBalance();
        discard();
      },50)
  });0
}

function playerWins(){
  gctx.strokeText('Player Wins',cWidth/2,cHeight/2,cWidth);
  gctx.fillText('Player Wins',cWidth/2,cHeight/2,cWidth);
  account.balance+=4*account.ante;//Can change with different game rules
  let xLoc1 = xBetLocsArr[1], xLoc2 = xBetLocsArr[2];
  let payout = account.ante*2;
  slideChipStack('topDown', ['Ante','Play'], [account.ante, account.play],()=>{
    anictx.clearRect(xLoc1,-chipW,chipW*2,cHeight);
    anictx.clearRect(xLoc2,-chipW,chipW*2,cHeight);
    displayBetChips(payout,xLoc1,tctx,anictx);
    displayBetChips(payout,xLoc2,tctx,anictx);
    slideChipStack('midDown',['Ante','Play'], [payout, payout],()=>{
      updateBalance(payout*2);
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
    updateBalance(account.ante*2);
    displayBalance();
    discard();
  },50);
}
