"use strict";

const cHeight = Math.floor(window.innerHeight*0.8),
  cWidth = Math.floor(cHeight*3/2);

const cShiftY = -5;
const xMargin = 0;

const bCanvas = document.getElementById("bannerCanvas"),
  BGCanvas = document.getElementById('BGCanvas'),
  mainCanvas = document.getElementById('mainCanvas'),
  aniCanvas = document.getElementById('aniCanvas'),
  pAniCanvas = document.getElementById('pAniCanvas'),
  transCanvas = document.getElementById('transCanvas'),
  glassCanvas = document.getElementById('glassCanvas');
const BGctx = BGCanvas.getContext('2d'),
  ctx = mainCanvas.getContext('2d'),
  anictx = aniCanvas.getContext('2d'),
  pAnictx = pAniCanvas.getContext('2d'),
  gctx = glassCanvas.getContext('2d'),
  tctx = transCanvas.getContext('2d');

  const canvasArr = [bCanvas, BGCanvas, mainCanvas,aniCanvas,pAniCanvas,transCanvas,glassCanvas];
  const ctxArr = [BGctx, ctx, anictx, pAnictx, gctx, tctx];

  canvasArr.forEach(cnv=>{
    cnv.style.position = 'absolute';
    cnv.style.marginTop = cShiftY+'px';
    cnv.width = cWidth;
    cnv.height = cHeight;
  })

  ctxArr.forEach(cvs=>{
    cvs.globalCompositionOperation = 'destination-over';
    cvs.textAlign = 'center';
    cvs.textBaseline = 'middle';
  })
  
const numCards = 3,
  xDif = Math.floor(cWidth/20),
  cardW = Math.floor(cWidth/8),
  HWr = 3/2,
  cardH = Math.floor(cardW*HWr);

const minBet = 100,
  maxBet = minBet*20;


BGCanvas.style.zIndex = -1;
glassCanvas.style.zIndex = -1;
aniCanvas.style.zIndex = 2;
mainCanvas.style.zIndex = 1;
pAniCanvas.style.zIndex = 3;
transCanvas.style.zIndex = 0;

function setMainctxProps(){
  let fontSize =  Math.floor(cHeight/8),
    gFontSize = fontSize*1.5;

  ctx.fillStyle = 'red';
  gctx.fillStyle = 'red';
  ctx.font = fontSize+'px Arial';
  gctx.font = gFontSize+'px Arial';
}
setMainctxProps();

const paytableMap = new Map([
  ["Royal Flush", {pp: 250, pos: 6}],
  ["Straight Flush", {pp: 40, pos: 5}],
  ["3 of a Kind", {pp: 30, pos: 4}],
  ["Straight", {pp: 6, pos: 3}],
  ["Flush", {pp: 3, pos: 2}],
  ["Pair", {pp: 1, pos: 1}]
])

// const setUp = (function(){
  const cardPicLoc = "./Images/Cards/";
  const picLoc = "./Images/Misc/";
  const cardImgMap = new Map();
  const miscImgMap = new Map();
  const pics = ['GreenFelt.jpg','RedButtonMain.png','GhostBack.png'];
  const btnPics = [];
  const cardSuits = ['C','H','S','D'];

  const cardXLocArr = [];

  (function setCardXLocs(){
    const xStart = cWidth/2-numCards*cardW/2-numCards%2*xDif;
    for(let i = 0; i<numCards; i++){
      cardXLocArr.push(Math.floor(xStart+i*(cardW+xDif)));
    }
  })()

  const deckCards = []; //All cards in array unshuffled
  cardSuits.forEach((suit)=>{
    for(let i = 2; i<=14; i++){deckCards.push(i+suit);}
    // deckCards.push(14+suit);
  });

  const deckPics = [];
  deckCards.forEach((card)=>{deckPics.push(card+'.png');})

  const promiseCardImgArr = asyncHelperFunctions.createPromImgArr(deckPics, cardImgMap, cardPicLoc);
  const promiseMiscPicArr = asyncHelperFunctions.createPromImgArr(pics, miscImgMap, picLoc);

  Promise.all(promiseCardImgArr.concat(promiseMiscPicArr)).then(()=>{
    drawBG();
    // newGame();
    // play();
  });

  function drawBG(){
    BGctx.drawImage(miscImgMap.get('GreenFelt'),0,0,cWidth,cHeight);
    drawBetFillers1();
  }

  let deck, pHand, dHand;

  function dealHand(){
    let hand = new Array(numCards);
    const xStart = cWidth/2-numCards*cardW/2-numCards%2*xDif;
    for(let i = 0; i<numCards; i++){hand[i] = draw();}
    return hand;
  }

  function draw(){
    //Replace with difference random number generator
    let r = Math.floor(Math.random()*deck.length)
    return deck.splice(r,1)[0];
  }

  // defines card clickboxes and draws cards
  const pYLoc = cHeight-cardH-xDif,
    dYLoc = xDif;

  function dealCards(){
    ctx.clearRect(0,cHeight*0.5,cWidth,cHeight/2);
    //draws players cards
    let delay = 20;
    let cardBack = miscImgMap.get('GhostBack');
    let pace = 40,
      flipPace = 30;

    for(let i = 0; i<numCards; i++){
      let card = cardImgMap.get(pHand[i]),
        xFin = cardXLocArr[i];

      //Deal player's cards
      animations.slide(cardBack,cWidth+cardW,-cardH, xFin, pYLoc, cardW, cardH, pace, delay*i, pAnictx, ()=>{
        animations.flip(cardBack,card,xFin+cardW/2,pYLoc,cardW,cardH,flipPace,cardW/(0.5*flipPace),pAnictx,()=>{
          pAnictx.drawImage(card,xFin,pYLoc,cardW,cardH);
        })
      })
      //Deal dealer's cards face down;
      animations.slide(cardBack,cWidth+cardW,-cardH, xFin, dYLoc, cardW, cardH, pace/2, delay*i, ctx, ()=>{
        ctx.drawImage(cardBack,xFin,dYLoc,cardW,cardH);
      })
    }
  }

  function drawDealerHand(){
    let cardBack = miscImgMap.get('GhostBack');
    //Add animations here
    let pace = 40,
      flipPace = 30;
    for(let i=0; i<numCards; i++){
      let card = cardImgMap.get(dHand[i])
      animations.flip(cardBack,card,cardXLocArr[i]+cardW/2,dYLoc,cardW,cardH,flipPace,cardW/(0.5*flipPace),ctx,()=>{
        ctx.drawImage(card,cardXLocArr[i],dYLoc,cardW,cardH);
      })
    }
  }

  //Move to UserInterface file
  const xBetLocsArr = [];
  function drawBetFillers1(){
    const yLoc = Math.floor(cHeight/2);
    let size = Math.floor(cardW*0.7);
    let xDif = Math.floor(size*0.9),
      lnWid = Math.floor(size/15);
    let xLocStart = cWidth/2-(1.5*size+xDif);
    for(let i = 0; i<3; i++){
      xBetLocsArr.push(xLocStart+i*(size+xDif))
      // BGctx.fillRect(xBetLocsArr[i], yLoc-size/2, size, size);
    }

    betOptionsMap.set('Pair+',{x:xBetLocsArr[0],y:yLoc-size/2,w:size,h:size});
    betOptionsMap.set('Ante',{x:xBetLocsArr[1],y:yLoc-size/2,w:size,h:size});

    let fontSize = cHeight/25;
    BGctx.font = fontSize+'px Arial';
    BGctx.textAlign = 'center';
    BGctx.textBaseline = 'middle';
    BGctx.fillStyle = 'yellow';
    shapes.circle(BGctx,xBetLocsArr[0],yLoc,size/2,lnWid,false,'yellow');
    BGctx.fillText('Pair+',xBetLocsArr[0]+size/2,yLoc,size-lnWid*2);
    BGctx.fillStyle = 'white';
    shapes.diamond(BGctx,xBetLocsArr[1],yLoc,size,size,lnWid,false,'red');
    BGctx.fillText('Ante',xBetLocsArr[1]+size/2,yLoc,size-lnWid*2);
    shapes.diamond(BGctx,xBetLocsArr[2],yLoc,size,size,lnWid,false,'red');
    shapes.roundRect(BGctx,xBetLocsArr[2]-size*0.1-lnWid,yLoc,size*1.2+lnWid*2,size+lnWid*2,lnWid,20,false,'white');
    BGctx.fillText('Play',xBetLocsArr[2]+size/2,yLoc,size-lnWid*2);
  }


//   return{
//     draw:draw,
//     dealCards: dealCards,
//     hand: hand,
//     numCards: numCards,
//     dealHand:dealHand,
//     cardImgMap:cardImgMap,
//     miscImgMap:miscImgMap,
//   }
//
// })()
