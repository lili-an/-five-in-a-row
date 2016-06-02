$(function(){
var canvasS=600;
var row=15;
var blockS=canvasS/row;
var ctx=$('#canvas').get(0).getContext('2d');
$('#canvas').get(0).width=canvasS;
$('#canvas').get(0).height=canvasS;
var draw=function(){
  var jiange=blockS/2+0.5;
  var lineWidth=canvasS-blockS;
  ctx.save();
  ctx.beginPath();
  for(var i=0;i<row;i++){
  if(i===0){
    ctx.translate(jiange,jiange);
  }else{
    ctx.translate(0,blockS);
  }
    ctx.moveTo(0,0);
    ctx.lineTo(lineWidth,0);
  }
  ctx.stroke();
  ctx.closePath();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  for( var i=0 ; i<row ; i++) {
  if( i===0){
    ctx.translate(jiange,jiange);
  }else{
    ctx.translate(blockS,0);
  }
  ctx.moveTo(0,0);
  ctx.lineTo(0,lineWidth);
}
  ctx.stroke();
  ctx.closePath();
  ctx.restore();

  var points=[3.5*blockS+0.5,11.5*blockS+0.5];
  for(var i=0;i<2;i++){
    for(var j=0;j<2;j++){
      var x=points[i];
      var y=points[j];
      ctx.save();
      ctx.beginPath();
      ctx.translate(x,y);
      ctx.arc(0,0,5,0,(Math.PI/180*360));
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }
  }

  ctx.save();
  ctx.beginPath();
  ctx.translate(7.5*blockS+0.5,7.5*blockS+0.5);
  ctx.arc(0,0,5,0,(Math.PI/180*360));
  ctx.fill();
  ctx.closePath();
  ctx.restore();
};
draw();
//画棋子
var qizibanjing=blockS/2*0.8;
 var drop=function(qizi){
  ctx.save();
  ctx.translate((qizi.x+0.5)*blockS,(qizi.y+0.5)*blockS);
  ctx.beginPath();
  ctx.arc(0,0,qizibanjing,0,(Math.PI/180*360));
  if(qizi.color===1){
    ctx.fillStyle="black";
    $('.black_play').get(0).play();
  }else{
    ctx.fillStyle="white";
    $('.white_play').get(0).play();
  }
  ctx.fill();
  ctx.closePath();
  ctx.restore();

 };

var kaiguan=true;
var step=1;
var all={};


var panduan=function(qizi){
  var shuju={};
    $.each(all,function(k,v){
      if(v.color===qizi.color){
        shuju[k]=v;
      }
    });
    var shu=1,hang=1,zuoxie=1,youxie=1;
    var tx,ty;
    tx=qizi.x;ty=qizi.y;
    while(shuju[tx+'-'+(ty+1)]){
      shu++;ty++;
    }
    tx=qizi.x;ty=qizi.y;
    while(shuju[tx+'-'+(ty-1)]){
      shu++;ty--;
    }
    tx=qizi.x;ty=qizi.y;
    while(shuju[(tx+1)+'-'+ty]){
      hang++;tx++;
    }
    tx=qizi.x;ty=qizi.y;
    while(shuju[(tx-1)+'-'+ty]){
      hang++;tx--;
    }
    tx=qizi.x;ty=qizi.y;
    while(shuju[(tx-1)+'-'+(ty-1)]){
      zuoxie++;tx--;ty--;
    }
    tx=qizi.x;ty=qizi.y;
    while(shuju[(tx+1)+'-'+(ty+1)]){
      zuoxie++;tx++;ty++;
    }
    tx=qizi.x;ty=qizi.y;
    while(shuju[(tx+1)+'-'+(ty-1)]){
      youxie++;tx++;ty--;
    }
    tx=qizi.x;ty=qizi.y;
    while(shuju[(tx-1)+'-'+(ty+1)]){
      youxie++;tx--;ty++;
    }
   if( hang>=5 || shu>=5 || zuoxie>=5 || youxie>=5){
     return true;
   }
};

 $('#canvas').on('click',function(e){
   var x=Math.floor(e.offsetX/blockS);
   var y=Math.floor(e.offsetY/blockS);
   if(all[x+'-'+y]){
     return;
   }
   var qizi;
   if(kaiguan){
     qizi={x:x,y:y,color:1,step:step};
     drop(qizi);
     if(panduan(qizi)){
       $('.cart').slideDown().find('p').text('黑棋胜');
       return;
     }
   }else{
     qizi={x:x,y:y,color:0,step:step};
     drop(qizi);
     if(panduan(qizi)){
      $('.cart').slideDown().find('p').text('白棋胜').css('color','white');
       return;
     }
   }
   step+=1;
   kaiguan=!kaiguan;
   all[x+'-'+y]=qizi;
 });

//tip
$('.cart').on('click',function(){
  $(this).hide();
});
$('.tip').on('click',function(e){
    e.stopPropagation();
});
$('.close').on('click',function(){
  $('.cart').hide();
});
$('#restart').on('click',function(){
  $('.cart').hide();
  ctx.clearRect(0,0,600,600);
  draw();
  all={};
  kaiguan=true;
  step=1;
});

$('#qipu').on('click',function(){
  $('.cart').hide();
  $('.save').show();
  ctx.save();
  ctx.font = "20px Calibri";
  for( var i in all){
    if( all[i].color === 1){
        ctx.fillStyle = '#fff';
    }else{
      ctx.fillStyle = 'black';
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(all[i].step,
      (all[i].x+0.5)*blockS,
      (all[i].y+0.5)*blockS);
  }
  ctx.restore();
  var image = $('#canvas').get(0).toDataURL('image/jpg',1);
  $('#save').attr('href',image);
  $('#save').attr('download','qipu.png');
});

});
