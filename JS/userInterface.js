"use strict";

const btncHeight = Math.floor(cHeight/5);

const btnCanvas = document.getElementById('btnCanvas'),
  btnBGCanvas = document.getElementById('btnBGCanvas'),
  btnAniCanvas = document.getElementById('btnAniCanvas'),
  glassBtnCanvas = document.getElementById('glassBtnCanvas');
const BTNctx = btnCanvas.getContext('2d'),
  BGBTNctx = btnBGCanvas.getContext('2d'),
  aniBTNctx = btnAniCanvas.getContext('2d'),
  gBtnctx = glassBtnCanvas.getContext('2d');

const btnCanvasArr = [btnCanvas, btnBGCanvas, btnAniCanvas,glassBtnCanvas];
const btnctxArr = [BTNctx, BGBTNctx, aniBTNctx, gBtnctx];

btnCanvasArr.forEach(cnv=>{
  cnv.style.position = 'absolute';
  cnv.width = cWidth;
  cnv.height = btncHeight;
  cnv.style.top = cHeight+'px';
  cnv.style.marginLeft = xMargin+'px';
})
btnBGCanvas.style.zIndex = -1;
glassBtnCanvas.style.zIndex = -1;
btnAniCanvas.style.zIndex = -1;

btnctxArr.forEach(ctx=>{
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
})

function setBtnCtxProps(){
  let btnFontSize = Math.floor(btncHeight/3);
  BTNctx.fillStyle = 'white';
  BTNctx.font = btnFontSize+'px Arial';
  aniBTNctx.textAlign = 'left';
}

const btnsPics = ['RedButtonMain.png', 'ButtonBackground.jpg'];

const chipBtnsPics = [
  'WhiteChip1Top.png',
  'RedChip5Top.png',
  'GreenChip25Top.png',
  'BlackChip100Top.png',
  'PurpleChip500Top.png'
]

const chipPics = [
  'WhiteChip1Side.png',
  'RedChip5Side.png',
  'GreenChip25Side.png',
  'BlackChip100Side.png',
  'PurpleChip500Side.png'
]

const chipValues = {
  PurpleChip500Side: 500,
  BlackChip100Side: 100,
  GreenChip25Side: 25,
  RedChip5Side: 5,
  WhiteChip1Side: 1
}

const btnsPicLoc = './Images/Misc/',
  chipsTopLoc = './Images/Misc/ChipsTopView/',
  chipsSideLoc = './Images/Misc/ChipsSideView/'

const buttonsImgMap = new Map(),
  chipImgMap = new Map(),
  chipBtnImgMap = new Map();

const promiseButtonsImgArr = asyncHelperFunctions.createPromImgArr(btnsPics, buttonsImgMap, btnsPicLoc),
  promiseChipSideViewImgArr = asyncHelperFunctions.createPromImgArr(chipPics, chipImgMap, chipsSideLoc),
  promisechipBtnImgArr = asyncHelperFunctions.createPromImgArr(chipBtnsPics, chipBtnImgMap, chipsTopLoc);

Promise.all(promiseButtonsImgArr.concat(promiseChipSideViewImgArr).concat(promisechipBtnImgArr)).then(()=>{
  BGBTNctx.drawImage(buttonsImgMap.get('ButtonBackground'),0,0,cWidth,btncHeight);//draws Background
  BGBTNctx.strokeRect(0,0,cWidth,btncHeight);
  document.fonts.load("12px Chela").then(()=>{
    document.fonts.load("12px TheBlacklist").then(()=>{
      drawChipButtons();
      setBtnCtxProps();
      drawButtons();
      displayBalance();
    })
  })
});

const optionButtonsMap = new Map(),
  chipBtnMap = new Map(),
  betOptionsMap = new Map();

(function setButtons(){
  const xPos = Math.floor(cWidth/2), yPos = Math.floor(btncHeight*.65),
    maxWid = Math.floor(cWidth/2), fontSize = Math.floor(btncHeight/2);

  // const vertGap = Math.floor(btncHeight/20);

  const btnWid =  3*fontSize,
    btnHeight = fontSize,
    btnSize = Math.floor(btncHeight*0.6),
    btnXPos = xPos-btnWid/2,
    btnYPos = Math.floor((btncHeight-btnSize)/2);
  const chipSize = Math.floor(btncHeight*0.5),
    chipsXDif = Math.floor(chipSize*1.1),
    chipsXPosStart = Math.floor(cWidth*0.25-3*chipSize-2*(chipsXDif-chipSize));

  optionButtonsMap.set("Deal",{img:'RedButtonMain',x:cWidth/2-1.5*btnSize, y:btncHeight*0.2, w:3*btnSize, h:btncHeight*0.6});
  optionButtonsMap.set("Play",{img:'RedButtonMain',x:cWidth/2-1.5*btnSize, y:btncHeight/10, w:3*btnSize, h:btncHeight*0.4});
  optionButtonsMap.set("Fold",{img:'RedButtonMain',x:cWidth/2-1.5*btnSize, y:btncHeight*0.55, w:3*btnSize, h:btncHeight*0.4});
  optionButtonsMap.set("Rebet",{img:'RedButtonMain',x:cWidth/2-1.5*btnSize, y:btncHeight/10, w:3*btnSize, h:btncHeight*0.4});
  optionButtonsMap.set("New Bet",{img:'RedButtonMain',x:cWidth/2-1.5*btnSize, y:btncHeight*0.55, w:3*btnSize, h:btncHeight*0.4});

  const chipXPosArr = [];
  for(let i = 0; i<5; i++){
    chipXPosArr.push(Math.floor(chipsXPosStart+chipsXDif*i-chipSize/2));
  }
  let yPosChip = Math.floor(btncHeight/2-chipSize/2);

  chipBtnMap.set('WhiteChip',{img:'WhiteChip1Top',x:chipXPosArr[0],y:yPosChip,h:chipSize,w:chipSize,v:chipValues.WhiteChip1Side, s:"WhiteChip1Side"});
  chipBtnMap.set('RedChip',{img:'RedChip5Top',x:chipXPosArr[1],y:yPosChip,h:chipSize,w:chipSize,v:chipValues.RedChip5Side, s:"RedChip5Side"});
  chipBtnMap.set('GreenChip',{img:'GreenChip25Top',x:chipXPosArr[2],y:yPosChip,h:chipSize,w:chipSize, v:chipValues.GreenChip25Side, s:"GreenChip25Side"});
  chipBtnMap.set('BlackChip',{img:'BlackChip100Top',x:chipXPosArr[3],y:yPosChip,h:chipSize,w:chipSize, v:chipValues.BlackChip100Side, s:"BlackChip100Side"});
  chipBtnMap.set('PurpleChip',{img:'PurpleChip500Top',x:chipXPosArr[4],y:yPosChip,h:chipSize,w:chipSize, v:chipValues.PurpleChip500Side, s:"PurpleChip500Side"});
})()

let chipW = Math.floor(cardW*0.7),
  chipH = Math.floor(chipW*0.7),
  chipYDif = Math.floor(chipH/4),
  chipYLoc = Math.floor(cHeight/2-chipH/2),
  betYLoc = Math.floor(chipYLoc+chipH);
let chips = Object.keys(chipValues);

function displayBetChips(qnty,chipXLoc,cvs=anictx,cvs2=null){
  let numChips = calcMinChips(qnty);
  let xPos = Math.floor(chipXLoc+chipW/2),
    yPos = Math.floor(betYLoc+chipYDif/2),
    dif = 0;
  cvs.clearRect(chipXLoc,0,chipW,cHeight);
  if(cvs2){
    cvs2.strokeText(qnty,xPos,yPos,chipW);
    cvs2.fillText(qnty,xPos,yPos,chipW);
  }
  for(let i = 0, len = chips.length; i<len; i++){
    for(let j = 0; j<numChips[i]; j++){
      cvs.drawImage(chipImgMap.get(chips[i]),chipXLoc,chipYLoc-dif*chipYDif,chipW,chipH);
      dif +=1;
    }
  }
}

function displayPairPlusChips(cvs=anictx,cvs2=null){
  displayBetChips(account.disPairplus,xBetLocsArr[0],cvs,cvs2);
}

function displayAnteChips(cvs=anictx,cvs2=null){
  displayBetChips(account.disAnte,xBetLocsArr[1],cvs,cvs2);
}

function displayPlayChips(cvs=anictx,cvs2=null){
  if(account.play){displayBetChips(account.play,xBetLocsArr[2],cvs,cvs2);}
}


function displayAllBetChips(){
  displayPairPlusChips(anictx,anictx);
  displayAnteChips(anictx,anictx);
  displayPlayChips(anictx,anictx);
}

//calculates minimum number of each chip need to make a bet
function calcMinChips(bet){
  let values = Object.values(chipValues);
  let chipStack = [];
  let len = values.length
  for(let i = 0; i<len; i++){
    chipStack[i] = Math.floor(bet/values[i]);
    bet = bet%values[i];
  }
  return chipStack;
}

function drawChipButtons(){
  chipBtnMap.forEach((b)=>{
    BGBTNctx.drawImage(chipBtnImgMap.get(b.img),b.x,b.y,b.w,b.h);
  })
}

function displayHandType(hand){
  let yPos, msg;
  if(hand==pHand){
    yPos=pYLoc+cardH/2;
    if(hand.type=="High Card"){
      let hc = hand.sort[2];
      switch(hc){
        case 11: msg = "Jack High"; break;
        case 12: msg = "Queen High"; break;
        case 13: msg = "King High"; break;
        case 14: msg = "Ace High"; break;
        default: msg = hc+" High";
      }
    }else{msg = hand.type}
  }else if(hand==dHand){
    yPos=dYLoc+cardH/2;
    if(hand.type=="High Card"){
      let hc = hand.sort[2];
      switch(hc){
        case 12: msg = "Queen High"; break;
        case 13: msg = "King High"; break;
        case 14: msg = "Ace High"; break;
        default: msg = "Doesn't Qualify"
      }
    }else{msg = hand.type}
  }
  gctx.strokeText(msg,cWidth/2, yPos,cWidth*75);
  gctx.fillText(msg,cWidth/2, yPos,cWidth*75);
}

function drawButtons(){
  const btnFontSize = Math.floor(btncHeight*0.5);
  BTNctx.clearRect(cWidth/3,0,cWidth*0.3,btncHeight);
  //draws deal button
  if(startGame==true){
    BTNctx.font = btnFontSize+'px Chela';
    let d = optionButtonsMap.get('Deal');
    BTNctx.drawImage(miscImgMap.get(d.img),d.x,d.y,d.w,d.h);
    let rBet = minBet-account.ante;
    if(rBet>0){
      BTNctx.font = btnFontSize/2+'px Chela';
      BTNctx.strokeText('Bet '+ rBet+ ' more to play', d.x+d.w/2, d.y+d.h/2, d.w*0.9);
      BTNctx.fillText('Bet '+ rBet+ ' more to play', d.x+d.w/2, d.y+d.h/2, d.w*0.9);
    }else{
      BTNctx.strokeText('Deal', d.x+d.w/2, d.y+d.h/2, d.w);
      BTNctx.fillText('Deal', d.x+d.w/2, d.y+d.h/2, d.w);
    }
  }else if(canPlay){
    BTNctx.font = btnFontSize/2+'px Chela';
    let p = optionButtonsMap.get('Play');
    let f = optionButtonsMap.get('Fold');

    BTNctx.drawImage(miscImgMap.get(p.img),p.x,p.y,p.w,p.h);
    BTNctx.strokeText('Play', p.x+p.w/2, p.y+p.h/2, p.w);
    BTNctx.fillText('Play', p.x+p.w/2, p.y+p.h/2, p.w);
    BTNctx.drawImage(miscImgMap.get(f.img),f.x,f.y,f.w,f.h);
    BTNctx.strokeText('Fold', f.x+f.w/2, f.y+f.h/2, f.w);
    BTNctx.fillText('Fold', f.x+f.w/2, f.y+f.h/2, f.w);
  }else if(!startGame&&!canPlay){
    BTNctx.font = btnFontSize/2+'px Chela';
    let p = optionButtonsMap.get('Rebet');
    let f = optionButtonsMap.get('New Bet');

    BTNctx.drawImage(miscImgMap.get(p.img),p.x,p.y,p.w,p.h);
    BTNctx.strokeText('Rebet', p.x+p.w/2, p.y+p.h/2, p.w);
    BTNctx.fillText('Rebet', p.x+p.w/2, p.y+p.h/2, p.w);
    BTNctx.drawImage(miscImgMap.get(f.img),f.x,f.y,f.w,f.h);
    BTNctx.strokeText('New Bet', f.x+f.w/2, f.y+f.h/2, f.w);
    BTNctx.fillText('New Bet', f.x+f.w/2, f.y+f.h/2, f.w);
  }
}

const xBalPos = Math.floor(cWidth*0.8);
const yBalPos = Math.floor(btncHeight*0.7);
function updateBalance(amt){
  let font = Math.floor(btncHeight/3)+'px TheBlacklist';
  animations.fadeOut(amt,aniBTNctx,1,xBalPos,yBalPos,"up",font);
}

function displayBalance(){
  let fontSize = Math.floor(btncHeight/3);
  BTNctx.textAlign = 'center';
  BTNctx.font= fontSize+'px TheBlacklist';
  BTNctx.clearRect(cWidth*0.7,0,cWidth*0.25,btncHeight);
  BTNctx.strokeText('Balance',xBalPos,btncHeight*0.3);
  BTNctx.strokeText(account.balance,xBalPos,yBalPos);
  BTNctx.fillText('Balance',xBalPos,btncHeight*0.3);
  BTNctx.fillText(account.balance,xBalPos,yBalPos);
}

function checkBalance(inc){
  gctx.clearRect(0,0,cWidth,cHeight);
  let balanceNeeded =  account.balance-(account.pairplus+account.ante+inc);
  if(balanceNeeded<account.ante){
    gctx.strokeText("Insufficient",cWidth/2,cHeight*0.4,cWidth*0.9)
    gctx.strokeText("Balance to Play",cWidth/2,cHeight*0.6,cWidth*0.9)
    gctx.fillText("Insufficient",cWidth/2,cHeight*0.4,cWidth*0.9)
    gctx.fillText("Balance to Play",cWidth/2,cHeight*0.6,cWidth*0.9)
    return false;
  }else if(balanceNeeded>=account.ante){return true;}
}

function getMousePos(cvn, evt){
  var rect = cvn.getBoundingClientRect();
  return{
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
}

function isInside(pos, rect){
  return pos.x > rect.x && pos.x < rect.x+rect.w && pos.y < rect.y+rect.h && pos.y > rect.y
}

let canRebet;
btnCanvas.addEventListener('click', function(evt){
  let mousePos = getMousePos(btnCanvas,evt);
  //Changes bet based on chips selected
  if(startGame){
    if(account.ante>=minBet){
      let deal = optionButtonsMap.get('Deal');
      if(isInside(mousePos, deal)){
        glassCanvas.style.zIndex = 10;
        glassBtnCanvas.style.zIndex = 10;
        startGame = false;
        newGame();
      }
    }
    //allows player to change bet with chip buttons
    chipBtnMap.forEach(chip=>{
      if(isInside(mousePos,chip)){
        let inc = chip.v;
        if(selector==="Ante"){
          if(checkBalance(inc)===true){
            account.ante+=inc;
            //animations
            animations.slide(chipImgMap.get(chip.s),chip.x,cHeight,xBetLocsArr[1],cHeight/2-chipH/2,chipW,chipH,25,0,anictx,()=>{
              account.disAnte+=inc;
              displayAnteChips(anictx,anictx);
            });
          }else{console.log('insufficient balance to play');}
        }
        if(selector==="Pair+"){
          if(checkBalance(inc)===true){
            account.pairplus+=inc;
            //animations
            animations.slide(chipImgMap.get(chip.s),chip.x,cHeight,xBetLocsArr[0],cHeight/2-chipH/2,chipW,chipH,25,0,anictx,()=>{
              account.disPairplus+=inc;
              displayPairPlusChips(anictx,anictx);
            });
          }else{console.log('insufficient balance to play');}
        }
      }
      drawButtons();
    })
  }else if(canPlay){
    let p = optionButtonsMap.get('Play');
    let f = optionButtonsMap.get('Fold');
    if(isInside(mousePos,p)){
      glassBtnCanvas.style.zIndex = 10;
      play();
      canPlay = false;
    }else if(isInside(mousePos, f)){
      glassBtnCanvas.style.zIndex = 10;
      fold();
      canPlay = false;
    }
    drawButtons();
  }else if(!canPlay&&!startGame&&canRebet){
    let r = optionButtonsMap.get('Rebet');
    let n = optionButtonsMap.get('New Bet');
    if(isInside(mousePos,r)){
      // glassBtnCanvas.style.zIndex = 10;
      console.log('rebet click');
      if(checkBalance(0)){
        canPlay = true;
        glassBtnCanvas.style.zIndex = 10;
        rebet();
      }
    }else if(isInside(mousePos, n)){
      // glassBtnCanvas.style.zIndex = 10;
      glassCanvas.style.zIndex = -1;
      account.pairplus = 0;
      account.disPairplus = 0;
      account.ante = 0;
      account.disAnte = 0;
      startGame = true;
      console.log('bet cleared');
    }
    drawButtons();
  }
  displayBalance();
},false);

let selector="Ante";
pAniCanvas.addEventListener('click', function(evt){
  let mousePos = getMousePos(aniCanvas,evt);
  if(isInside(mousePos,betOptionsMap.get('Ante'))){
    if(selector=='Ante'){account.ante=0;account.disAnte=0;}
    selector = 'Ante';
    console.log('Ante clicked');
  }
  if(isInside(mousePos,betOptionsMap.get('Pair+'))){
    if(selector=='Pair+'){account.pairplus=0;account.disPairplus=0;}
    selector = 'Pair+';
    console.log('Pair+ clicked');
  }
  drawButtons();
  displayAllBetChips();
},false);
