"use strict";

const btnCanvas = document.getElementById('btnCanvas');
const btnBGCanvas = document.getElementById('btnBGCanvas');
const glassBtnCanvas = document.getElementById('glassBtnCanvas');

const btncHeight = Math.floor(cHeight/5);
btnCanvas.width = btnBGCanvas.width = glassBtnCanvas.width= cWidth;
btnCanvas.height = btnBGCanvas.height = glassBtnCanvas.height= btncHeight;
btnCanvas.style.top = btnBGCanvas.style.top = glassBtnCanvas.style.top = cHeight+'px';
btnCanvas.style.position = btnBGCanvas.style.position = glassBtnCanvas.style.position = 'absolute';
btnBGCanvas.style.zIndex = -1;
glassBtnCanvas.style.zIndex = -1;

const BTNctx = btnCanvas.getContext('2d');
const BGBTNctx = btnBGCanvas.getContext('2d');
const gBtnctx = glassBtnCanvas.getContext('2d');

BTNctx.strokeRect(0,0,cWidth,btncHeight);

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

const btnsPicLoc = './Images/Misc/'
const chipsTopLoc = './Images/Misc/ChipsTopView/'
const chipsSideLoc = './Images/Misc/ChipsSideView/'

const buttonsImgMap = new Map();
const chipImgMap = new Map();
const chipBtnImgMap = new Map();

const promiseButtonsImgArr = asyncHelperFunctions.createPromImgArr(btnsPics, buttonsImgMap, btnsPicLoc);
const promiseChipSideViewImgArr = asyncHelperFunctions.createPromImgArr(chipPics, chipImgMap, chipsSideLoc);
const promisechipBtnImgArr = asyncHelperFunctions.createPromImgArr(chipBtnsPics, chipBtnImgMap, chipsTopLoc);

Promise.all(promiseButtonsImgArr.concat(promiseChipSideViewImgArr).concat(promisechipBtnImgArr)).then(()=>{
  BGBTNctx.drawImage(buttonsImgMap.get('ButtonBackground'),0,0,cWidth,btncHeight);//draws Background
  drawChipButtons();
  setBtnCtxProps();
  drawButtons();
  displayBalance();
});

const buttonsMap = new Map();
const optionButtonsMap = new Map();
const chipBtnMap = new Map();
const betOptionsMap = new Map();

function setBtnCtxProps(){
  let aniFontSize = Math.floor(cHeight/20);
  anictx.font= aniFontSize+"px Arial";
  anictx.textAlign = 'center';
  anictx.textBaseline = 'hanging';
  anictx.fillStyle = 'white';

  let btnFontSize = Math.floor(btncHeight/3);
  BTNctx.fillStyle = 'white';
  BTNctx.font = btnFontSize+'px Arial';
  BTNctx.textAlign = 'center';
  BTNctx.textBaseline = 'middle';
}
setBtnCtxProps();

(function setButtons(){
  const xPos = Math.floor(cWidth/2), yPos = Math.floor(btncHeight*.65),
    maxWid = Math.floor(cWidth/2), fontSize = Math.floor(btncHeight/2);

  const vertGap = Math.floor(btncHeight/20);

  const btnWid =  3*fontSize,
    btnHeight = fontSize,
    btnSize = Math.floor(btncHeight*0.6),
    btnXPos = xPos-btnWid/2,
    btnYPos = Math.floor((btncHeight-btnSize)/2),

    chipSize = Math.floor(btncHeight*0.5),
    chipsXPosStart = Math.floor(chipSize*0.8),
    chipsXDif = chipSize;

  optionButtonsMap.set("Deal",{img:'RedButtonMain',x:cWidth/2-1.5*btnSize, y:btncHeight*0.2, w:3*btnSize, h:btncHeight*0.6});
  optionButtonsMap.set("Play",{img:'RedButtonMain',x:cWidth/2-1.5*btnSize, y:btncHeight/10, w:3*btnSize, h:btncHeight*0.4});
  optionButtonsMap.set("Fold",{img:'RedButtonMain',x:cWidth/2-1.5*btnSize, y:btncHeight*0.55, w:3*btnSize, h:btncHeight*0.4});

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

function displayBetChips(qnty,chipXLoc,cvs=anictx){
  let numChips = calcMinChips(qnty);
  let betXLoc = Math.floor(chipXLoc+chipW/2),
    dif = 0;
  cvs.clearRect(chipXLoc,0,chipW,cHeight);
  cvs.fillText(qnty,betXLoc,betYLoc);
  for(let i = 0, len = chips.length; i<len; i++){
    for(let j = 0; j<numChips[i]; j++){
      cvs.drawImage(chipImgMap.get(chips[i]),chipXLoc,chipYLoc-dif*chipYDif,chipW,chipH);
      dif +=1;
    }
  }
}

function displayPairPlusChips(cvs=anictx){
  displayBetChips(account.disPairplus,xBetLocsArr[0],cvs);
}

function displayAnteChips(cvs=anictx){
  displayBetChips(account.disAnte,xBetLocsArr[1],cvs);
}

function displayPlayChips(cvs=anictx){
  if(account.play){displayBetChips(account.play,xBetLocsArr[2],cvs);}
}

function displayAllBetChips(){
  displayPairPlusChips(anictx);
  displayAnteChips(anictx);
  displayPlayChips(anictx);
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

const chipStacks = {}
function getChipStacks(){
  chipStacks.pairplus = calcMinChips(account.pairplus)
  chipStacks.ante = calcMinChips(account.ante);
  chipStacks.play = calcMinChips(account.play);
}

function displayBalance(){
  let fontSize = Math.floor(btncHeight/3);
  let xPos = Math.floor(cWidth*0.8)
  BTNctx.textAlign = 'center';
  BTNctx.font= fontSize+'px Arial';
  BTNctx.clearRect(cWidth*0.7,0,cWidth*0.25,btncHeight);
  BTNctx.fillText('Balance',xPos,btncHeight*0.3);
  BTNctx.fillText(account.balance,xPos,btncHeight*0.7);
}

function drawChipButtons(){
  chipBtnMap.forEach((b)=>{
    BGBTNctx.drawImage(chipBtnImgMap.get(b.img),b.x,b.y,b.w,b.h);
  })
}

function displayHandType(hand){

}

const btnFontSize = Math.floor(btncHeight/3);
function drawButtons(){
  BTNctx.clearRect(cWidth/3,0,cWidth*0.45,btncHeight);
  //draws deal button
  if(startGame==true){
    BTNctx.font = btnFontSize+'px Arial';
    let d = optionButtonsMap.get('Deal');
    BTNctx.drawImage(miscImgMap.get(d.img),d.x,d.y,d.w,d.h);
    let rBet = minBet-account.ante;
    if(rBet>0){
      BTNctx.font = btnFontSize/2+'px Arial';
      BTNctx.fillText('Bet '+ rBet+ ' more to play', d.x+d.w/2, d.y+d.h/2, d.w);
    }else{
      BTNctx.fillText('Deal', d.x+d.w/2, d.y+d.h/2, d.w);
    }
  }else if(canPlay==true){
    let p = optionButtonsMap.get('Play');
    let f = optionButtonsMap.get('Fold');

    BTNctx.drawImage(miscImgMap.get(p.img),p.x,p.y,p.w,p.h);
    BTNctx.fillText('Play', p.x+p.w/2, p.y+p.h/2, p.w);
    BTNctx.drawImage(miscImgMap.get(f.img),f.x,f.y,f.w,f.h);
    BTNctx.fillText('Fold', f.x+f.w/2, f.y+f.h/2, f.w);
  }
}

function displayAll(){
  drawButtons();
  displayAllBetChips();
  displayBalance();
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

function checkBalance(inc){
  let totalBet =  account.pairplus+account.ante+inc;
  if((account.balance-totalBet)<account.ante){return false}
  else{return true;}
}

btnCanvas.addEventListener('click', function(evt){
  let mousePos = getMousePos(btnCanvas,evt);
  //Changes bet based on chips selected
  if(startGame){
    if(account.ante>=minBet){
      let deal = optionButtonsMap.get('Deal');
      if(isInside(mousePos, deal)){
        // glassCanvas.style.zIndex = 10;
        // glassBtnCanvas.style.zIndex = 10;
        startGame = false;
        dQlfy = true;
        canPlay = true;
        newGame();
      }
    }
    //allows player to change bet with chip buttons
    chipBtnMap.forEach(chip=>{
      if(isInside(mousePos,chip)){
        if(selector==="Ante"){
          if(checkBalance(chip.v)){
            account.ante+=chip.v;
            //animations
            animations.slide(chipImgMap.get(chip.s),chip.x,cHeight,xBetLocsArr[1],cHeight/2,chipW,chipH,25,0,anictx,()=>{
              account.disAnte+=chip.v;//Need different display variable for security
              displayAnteChips();
            });
          }else{console.log('insufficient balance to play');}
        }
        if(selector==="Pair+"){
          if(checkBalance(chip.v)){
            account.pairplus+=chip.v;
            //animations
            animations.slide(chipImgMap.get(chip.s),chip.x,cHeight,xBetLocsArr[0],cHeight/2,chipW,chipH,25,0,anictx,()=>{
              account.disPairplus+=chip.v;
              displayPairPlusChips();
            });
          }else{console.log('insufficient balance to play');}
        }
      }
      // displayAll();
      drawButtons();
    })
  }else if(canPlay){
    let p = optionButtonsMap.get('Play');
    let f = optionButtonsMap.get('Fold');
    if(isInside(mousePos,p)){
      // glassBtnCanvas.style.zIndex = 10;
      play();
      canPlay = false;
      startGame = true;
    }else if(isInside(mousePos, f)){
      // glassBtnCanvas.style.zIndex = 10;
      fold();
      canPlay = false;
      startGame = true;
    }
  }
  drawButtons();
  displayBalance();
},false);

let selector="Ante";
pAniCanvas.addEventListener('click', function(evt){
  console.log('clicked');
  let mousePos = getMousePos(aniCanvas,evt);
  if(isInside(mousePos,betOptionsMap.get('Ante'))){
    if(selector=='Ante'){account.ante=0;account.disAnte=0;}
    console.log('Ante clicked');
    selector = 'Ante';
  }
  if(isInside(mousePos,betOptionsMap.get('Pair+'))){
    if(selector=='Pair+'){account.pairplus=0;account.disAnte=0;}
    selector = 'Pair+';
    console.log('Pair+ clicked');
  }
  displayAll();
},false);
