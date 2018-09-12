"use strict";

const animations = (()=>{

  function slide(img,xStart,yStart,xFin,yFin,w,h,n,s,cvs,callback=()=>{}){
    if(s>0){//Delays execution by s frames
      requestAnimationFrame(()=>{slide(img,xStart,yStart,xFin,yFin,w,h,n,s-1,cvs,callback)});
    }else{
      if(n>0){
        let dx = Math.floor((xFin-xStart)/n),
          dy = Math.floor((yFin-yStart)/n),
          x = xStart+dx,
          y = yStart+dy;
        cvs.clearRect(x-dx,y-dy,w,h);
        cvs.drawImage(img,x,y,w,h)
        requestAnimationFrame(()=>{slide(img,x,y,xFin,yFin,w,h,n-1,s,cvs,callback)});
      }else{callback();}
    }
  }

  function flip(img1,img2,x,y,w,h,n,inc,cvs,callback){
    w-=inc;
    if(w>0){
      cvs.clearRect(x-w,y,2*w,h);
      cvs.drawImage(img1,x-w/2,y,w,h);
    }
    else{cvs.drawImage(img2,x-w/2,y,w,h);}
    if(n>1){
      requestAnimationFrame(()=>{flip(img1,img2,x,y,w,h,n-1,inc,cvs,callback)})
    }else{callback();}
  }

  let firstTime = true;
  function slideCanvas(cvs=ctx, cnv=canvas, xStart,yStart,xFin,yFin,n,s,fn=()=>{},callback=()=>{}){
    if(s>0){
      requestAnimationFrame(()=>{slideCanvas(ctx, cnv, xStart,yStart,xFin,yFin,n,s-1,fn,callback)});
    }else{
      if(n>0){
        if(firstTime){
          firstTime=false;
          cvs.translate(xStart,yStart);
          console.log('translated');
        }
        let dx = Math.floor((xFin-xStart)/n),
          dy = Math.floor((yFin-yStart)/n),
          x = xStart+dx,
          y = yStart+dy;
        cvs.translate(dx,dy);
        fn();
        requestAnimationFrame(()=>{slideCanvas(cvs,cnv,x,y,xFin,yFin,n-1,s,fn,callback)});
      }else{callback();firstTime=true;}
    }
  }

  function fadeOut(text,cvs,a,x,y,dir,callback=()=>{}){
    cvs.font = "48px Quantico" //make dynamic
    cvs.clearRect(x,y-100,400,200);
    cvs.globalAlpha = a;

    if(a>0){
      a-=0.01;
      if(dir=="up"){
        cvs.fillStyle = 'green';
        cvs.fillText('+'+text,x,y);
        y-=1;
      }else{
        cvs.fillStyle = 'red';
        cvs.fillText('-'+text,x,y);
        y+=1;
      }
      window.requestAnimationFrame(()=>{
        fadeOut(text,cvs,a,x,y,dir,callback);
      });
    }else{
      cvs.globalAlpha = 1;
      callback();
    }
  }

  return{
    slide:slide,
    flip: flip,
    slideCanvas: slideCanvas,
    fadeOut:fadeOut
  }

})()
