/*

Code by G. Otani P. - April 2018

*/

var dot = [];
var d_cont = 0;

var ctx;

var dirx = [];
var diry = [];
var speed = 15;
var pos_jump = 1;
var intervalo = [];
var cor = 'lime';
var custom_cor = false;
const tam = 2; //tamanho

var autodot = false;

var f_select = 0;

function carregar() {
  area.start();
  gerar_direcao();
  dot[d_cont] = new component(2, 2, getRandomColor(), area.canvas.width/2, area.canvas.height/2);
  dot[d_cont].update();
  intervalo = [setInterval(atualizar, speed), setInterval(atualizar_lento, 7000)];
  autodot = true;
}

function atualizar() {
  area.clear();
  for (var i = 0; i < dot.length; i++) {
    trocar_direcao(dot[i], i);
    dot[i].x += dirx[i]*pos_jump;
    dot[i].y += diry[i]*pos_jump;
    dot[i].update();
  }
  if (autodot == true) {
    novo_dot();
  }
}

function atualizar_lento() {
  //console.log(area.canvas.width,window.innerWidth)
  if (Math.abs(area.canvas.width-window.innerWidth) > 300) {
    area.start();
  }
}

var area = {
  canvas : document.createElement("canvas"),
  start : function() {
      this.canvas.width = window.innerWidth - 20;
      this.canvas.height = window.innerHeight - 20;
      this.context = this.canvas.getContext("2d");
      document.getElementById('canvas-here').insertBefore(this.canvas, document.getElementById('canvas-here').childNodes[0]);
  },
  clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
}

// Main/automatic functions

function component(width, height, cor, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.update = function() {
    ctx = area.context;
    ctx.fillStyle = cor;
    ctx.fillRect(this.x, this.y, this.width, this.height);  
    //ctx.shadowBlur = 10;
    //ctx.shadowColor = 'white';
  }
}

function gerar_direcao() {
  var angulo = 2*Math.PI*Math.random();
  dirx[d_cont] = Math.cos(angulo); //cos -> X
  diry[d_cont] = Math.sin(angulo); //sen -> Y
  //console.log('Direção do ponto #'+(d_cont+1)+' X: ' + (Math.round(dirx[d_cont] * 1000)/1000) + ' Y: ' + (-(Math.round(diry[d_cont] * 1000)/1000)));
  //console.log('cos: ' + (Math.round(dirx[d_cont] * 1000)/1000) + ' sen: ' + (-(Math.round(diry[d_cont] * 1000)/1000)));
  //console.log('cos²+sen²: ' + ((dirx[d_cont]**2)+(diry[d_cont]**2)));
}

function trocar_direcao(dot_n, id) {
  if (dot_n.x > area.canvas.width || dot_n.x < 0) {
    dirx[id] = -dirx[id];
  } 
  if (dot_n.y > area.canvas.height || dot_n.y < 0) {
    diry[id] = -diry[id];
  }
}

function pos(event) {
  //console.log(event.clientX, ', ', event.clientY);
  if (f_select == 0) {
    for (var i = 0; i < dot.length; i++) { //formula #1 (dots heads towards pointer)
      dirx[i] = Math.sin(Math.atan2(event.clientX-dot[i].x-10, event.clientY-dot[i].y-10));
      diry[i] = Math.cos(Math.atan2(event.clientX-dot[i].x-10, event.clientY-dot[i].y-10));
    }  
  } else if (f_select == 1) {
    for (var i = 0; i < dot.length; i++) { //formula #2 (dots run away from pointer)
      dirx[i] = Math.cos(Math.atan2(event.clientX-dot[i].x, event.clientY-dot[i].y)*-1)*-1;
      diry[i] = Math.sin(Math.atan2(event.clientX-dot[i].x, event.clientY-dot[i].y)*-1)*-1;
    }             
  } else if (f_select == 2) {
    for (var i = 0; i < dot.length; i++) { //formula #3 (dots do a magnetic field)
      dirx[i] = Math.cos((Math.atan2(event.clientX-dot[i].x-10, event.clientY-dot[i].y-10))*-4)*-1;
      diry[i] = Math.sin((Math.atan2(event.clientX-dot[i].x-10, event.clientY-dot[i].y-10))*-4)*-1;
    }   
  } else if (f_select == 3) {
    for (var i = 0; i < dot.length; i++) { //formula #4 (a lot of stuff)
      if (i%4==0) { //dot run closer
        dirx[i] = Math.sin(Math.atan2(event.clientX-dot[i].x-10, event.clientY-dot[i].y-10));
        diry[i] = Math.cos(Math.atan2(event.clientX-dot[i].x-10, event.clientY-dot[i].y-10));
      } else if (i%4==1) { //dot run away
        dirx[i] = Math.cos(Math.atan2((event.clientX-dot[i].x-10)*2, (event.clientY-dot[i].y-10)*2)*-1);
        diry[i] = Math.sin(Math.atan2((event.clientX-dot[i].x-10)*2, (event.clientY-dot[i].y-10)*2)*-1);
      } else if (i%4==2) { //align horizontal
        dirx[i] = Math.cos(Math.atan2(event.clientY-dot[i].y-10, event.clientX-dot[i].x-10)*-1);
        diry[i] = Math.cos(Math.atan2(event.clientY-dot[i].y-10, event.clientX-dot[i].x-10)*-1);
      } else { //align vertical
        dirx[i] = Math.cos(Math.atan2(event.clientX-dot[i].y-10, event.clientY-dot[i].y-10));
        diry[i] = Math.cos(Math.atan2(event.clientX-dot[i].y-10, event.clientY-dot[i].y-10));     
      }
    }
  }
}

/* getRandomColor function credits: https://stackoverflow.com/a/1484514 */
function getRandomColor() {
  if (custom_cor === false) {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  } else {
    return cor;
  }
}

// Button/user-interaction functions

function mudarvelocidade(qnt) {
  if ((speed > 5 && speed < 1000) || (speed < 6 && qnt > 0) || (speed > 999 && qnt < 0)) {
    if (speed < 50) {
      speed += qnt;    
    } else if (speed < 150) {
      speed += qnt*5;
    } else {
      speed += qnt*15;
    }
    clearInterval(intervalo[0]);
    intervalo[0] = setInterval(atualizar, speed);
    console.log('intervalo: ' + speed);
  }
}

function trocar_pos_jump() {
  if (pos_jump < 6) {
    pos_jump++;
  } else {
    pos_jump = 1;
  }
  console.log('pos_jump: ' + pos_jump);
}

function novo_dot() {
  if (dot.length < 2000) {
    d_cont++;
    dot[d_cont] = new component(tam, tam, getRandomColor(), area.canvas.width/2, area.canvas.height/2);
    gerar_direcao();
  } else {
    autodot = false;
  }
}

function limpar_dots() {
  dot = [];
  dirx = []; //não necessário
  diry = []; //não necessário
  d_cont = -1;
}

function mudar_cor(nova_cor) {
  cor = nova_cor;
  console.log('Nova cor: ' + cor);
  custom_cor = true;
}

function mudar_formula() {
  f_select++;
  if (f_select > 3) {
    f_select = 0;
  }
  console.log('f_select: '+f_select);
}

// CSS functions

function aside_css(value) {
  document.getElementsByTagName('input')[0].style.display = value;
  for (var i = 0; i < document.getElementsByTagName('p').length; i++) {
    document.getElementsByTagName('p')[i].style.display = value;
  }
}