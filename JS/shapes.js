"use strict";

const shapes = (()=>{
  function roundRect(ctx, x, y, width, height, lnWid=5, radius=5, fill, color='black') {

    y = y - height/2;
    ctx.strokeStyle = color;
    ctx.lineWidth = lnWid;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.stroke();
    if (fill) {ctx.fillStyle = color; ctx.fill(); }
  }

  function diamond(ctx,x,y,width,height,lnWid=5,fill,color='black'){
    y=y-height/2;
    ctx.strokeStyle = color;
    ctx.lineWidth = lnWid;
    ctx.beginPath();
    ctx.moveTo(x+width/2,y);
    ctx.lineTo(x+width,y+height/2);
    ctx.lineTo(x+width/2,y+height);
    ctx.lineTo(x,y+height/2);
    ctx.closePath();
    ctx.stroke();
    if(fill){ctx.fillStyle=color; ctx.fill();}
  }

  function circle(ctx,x,y,r,lnWid=5,fill,color='black'){
    x=x+r;
    ctx.strokeStyle = color;
    ctx.lineWidth = lnWid;
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.stroke();
    if(fill){ctx.fillStyle=color; ctx.fill();}
  }

  return{
    roundRect:roundRect,
    diamond:diamond,
    circle:circle,
  }
})()
