"use strict";

const cHeight = Math.floor(window.innerHeight*0.8),
  cWidth = Math.floor(cHeight*1.8);

const cShiftY = -5;
let xMargin=0;

if(window.innerWidth>cWidth){xMargin = Math.floor((window.innerWidth-cWidth)/2);}

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
    cnv.style.marginLeft = xMargin+'px';
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

const minBet = 250,
  maxBet = minBet*20;

BGCanvas.style.zIndex = -1;
glassCanvas.style.zIndex = -1;
aniCanvas.style.zIndex = 2;
mainCanvas.style.zIndex = 1;
pAniCanvas.style.zIndex = 3;
transCanvas.style.zIndex = 0;

function setMainctxProps(){
  let fontSize =  Math.floor(cHeight/8),
    gFontSize = fontSize*1.5,
    aniFontSize = Math.floor(cHeight/20);
  anictx.font= aniFontSize+"px Chela";
  anictx.textBaseline = 'hanging';
  ctx.font = fontSize+'px Chela';
  gctx.font = gFontSize+'px TheBlacklist';
  anictx.fillStyle = 'white';
  ctx.fillStyle = 'red';
  gctx.lineWidth = Math.floor(cWidth/120);
  gctx.strokeStyle = 'black';
  gctx.fillStyle = 'rgb(180,15,15)';
  gctx.shadowOffsetX = gFontSize/15;
  gctx.shadowOffsetY = gFontSize/15;
  gctx.shadowColor = "rgba(0,0,0,0.5)";
  gctx.shadowBlur = 4;
}


const paytableMap = new Map([
  // ["Royal Flush", {pp: 250, pos: 6}],
  ["Straight Flush", {pp: 40, pos: 5}],
  ["3 of a Kind", {pp: 30, pos: 4}],
  ["Straight", {pp: 6, pos: 3}],
  ["Flush", {pp: 3, pos: 2}],
  ["Pair", {pp: 1, pos: 1}]
])

// const setUp = (function(){
  const cardPicLoc = "./Images/Cards/",
    picLoc = "./Images/Misc/";
  const cardImgMap = new Map(),
    miscImgMap = new Map();
  const pics = ['GreenFelt.jpg','RedButtonMain.png','GhostBack.png'],
    btnPics = [];
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
    for(let i = 2; i<=13; i++){deckCards.push(i+suit);}
    deckCards.push(14+suit);
  });

  const deckPics = [];
  deckCards.forEach((card)=>{deckPics.push(card+'.png');})

  const promiseCardImgArr = asyncHelperFunctions.createPromImgArr(deckPics, cardImgMap, cardPicLoc),
    promiseMiscPicArr = asyncHelperFunctions.createPromImgArr(pics, miscImgMap, picLoc);

  Promise.all(promiseCardImgArr.concat(promiseMiscPicArr)).then(()=>{
    setMainctxProps();
    drawBG();

  });

  function displayPairPlusPT(){
    BGctx.lineWidth = Math.floor(cHeight/200);
    BGctx.strokeStyle = 'black';
    let fontSize = cHeight/20;
    let yCord = cHeight/3;

    BGctx.font = fontSize+'px Chela';
    BGctx.fillStyle = 'white';
    BGctx.strokeText("PairPlus  PayTable",cWidth*0.15,yCord,cWidth*0.25);
    BGctx.fillText("PairPlus  PayTable",cWidth*0.15,yCord,cWidth*0.25);
    paytableMap.forEach((value,key)=>{
      yCord+=cHeight/12;
      BGctx.strokeText(key,cWidth/8,yCord,cWidth*0.15);
      BGctx.fillText(key,cWidth/8,yCord,cWidth*0.15);
      BGctx.strokeText(value.pp,cWidth/4,yCord);
      BGctx.fillText(value.pp,cWidth/4,yCord);
    })
  }

  function displayInstructions(){
    let msg = ['Dealer','Qualifies', 'on Queen', 'High and', 'Better'];
    let xPos = cWidth*7/8, yPos = cHeight*0.4, yDif = cHeight/12;
    for(let i = 0, j=msg.length; i<j; i++){
      BGctx.strokeText(msg[i],xPos,yPos+i*yDif);
      BGctx.fillText(msg[i],xPos,yPos+i*yDif);
    }
  }

  function drawBG(){
    BGctx.drawImage(miscImgMap.get('GreenFelt'),0,0,cWidth,cHeight);
    BGctx.strokeRect(0,0,cWidth,cHeight);
    drawBetFillers();
    displayPairPlusPT();
    displayInstructions();
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

  const pYLoc = cHeight-cardH-Math.floor(xDif/2),
    dYLoc = Math.floor(xDif/2);
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
  function drawBetFillers(){
    const yLoc = Math.floor(cHeight/2);
    let size = Math.floor(cardW*0.7);
    let xDif = Math.floor(size*0.9),
      lnWid = Math.floor(size/15);
    let xLocStart = cWidth/2-(1.5*size+xDif);
    for(let i = 0; i<3; i++){
      xBetLocsArr.push(xLocStart+i*(size+xDif))
    }

    betOptionsMap.set('Pair+',{x:xBetLocsArr[0],y:yLoc-size/2,w:size,h:size});
    betOptionsMap.set('Ante',{x:xBetLocsArr[1],y:yLoc-size/2,w:size,h:size});

    let fontSize = cHeight/25;
    BGctx.font = fontSize+'px Chela';

    BGctx.strokeStyle = 'black';
    BGctx.lineWidth = Math.floor(cHeight/200);
    BGctx.strokeText('Pair+',xBetLocsArr[0]+size/2,yLoc,size-lnWid*2);
    BGctx.strokeText('Ante',xBetLocsArr[1]+size/2,yLoc,size-lnWid*2);
    BGctx.strokeText('Play',xBetLocsArr[2]+size/2,yLoc,size-lnWid*2);

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
