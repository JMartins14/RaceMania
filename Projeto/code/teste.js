const imgFolder = "../resources/images/";
(function()
{
	window.addEventListener("load", main);
}());
function queryString(parameter) {
	var loc = location.search.substring(1, location.search.length);
	var param_value = false;
	var params = loc.split("?");
	for (var i=0; i<params.length;i++) {
		 var param_name = params[i].substring(0,params[i].indexOf('='));
		if (param_name == parameter) {
			param_value = params[i].substring(params[i].indexOf('=')+1)
		}
	}
	if (param_value) {
		return param_value;
	}
	else {
		return false;
	}
}
var Mouse = {
	mouseX : 0,
	mouseY: 0,
	mouseClick: function (e) {
		this.mouseX = e.pageX - Context.canvas.offsetLeft;
		this.mouseY = e.pageY - Context.canvas.offsetTop;
	}
};
var button = function (xl,xr,yt,yb) {
	this.xLeft = xl;
	this.xRight = xr;
	this.yTop = yt;
	this.yBottom = yb;

	this.checkMouse = function () {
		if(this.xLeft<=Mouse.mouseX && Mouse.mouseX<=this.xRight && this.yTop <=Mouse.mouseY && Mouse.mouseY <=this.yBottom)return true;
	};
};
var Sprite = function (ficheiro,padrao) {
	this.imagem = null;
	this.padrao = null;
	this.TO_RADIAN = Math.PI/180;

	if(ficheiro != undefined && ficheiro!="" && ficheiro!=null){
		this.imagem = new Image();
		this.imagem.src = ficheiro;

		if(padrao)
			this.padrao = Context.context.createPattern(this.imagem,'repeat');
	}
	else
		console.log("Erro ao abrir sprite");


	this.draw = function (x, y,width,heigth) {
		if(this.padrao != null){
			//Desenha padrao
			Context.context.fillStyle = this.padrao;
			Context.context.fillRect(x,y,width,heigth);
		}
		else{
			//Desenha Imagem
			if(width!=undefined || heigth!=undefined){
				Context.context.drawImage(this.imagem,x,y,this.imagem.width,this.imagem.height);
			}
			else{
				Context.context.drawImage(this.imagem,x,y,width,heigth);
			}
		}
	};

	this.rotate = function (x,y,angle) {
		Context.context.save();
		Context.context.translate(x,y);
		Context.context.rotate(angle * this.TO_RADIAN);
		Context.context.drawImage(this.imagem,-(this.imagem.width)/2,-(this.imagem.height)/2);
		Context.context.restore();
	}

};

var Carro = function () {
	this.nitro = 200;
	this.x = 0;
	this.y = 0;
	this.speed = 5;
	this.wheelAngle = 180;
	this.mod = 0;
	this.width=40;
	this.height=20;
	this.colisao = function (mapa) {
		var aux = (this.speed*this.mod) * Math.sin(this.wheelAngle*(Math.PI/180));
		var aux2 = ((-this.speed*this.mod) * Math.cos(this.wheelAngle* (Math.PI/180)));
		for(var i=10;i<14;i++){
			if ((mapa[Math.floor((this.x + aux) / 75) + (17 * Math.floor((this.y + aux2) / 75))] == i)) {
				return true;
			}
		}
		return false;
	}
	this.atualizax = function(mapa){
		var aux = (this.speed*this.mod) * Math.sin(this.wheelAngle*(Math.PI/180));
		if(((this.x-this.width/2)+aux>0)&&((this.x+this.width/2)+aux<1275)&&(!this.colisao(mapa))) {
			return aux;
		}
		else {
			return 0;
		}
	};
	this.atualizay = function(mapa){
		var aux = ((-this.speed*this.mod) * Math.cos(this.wheelAngle* (Math.PI/180)));
		if((this.y-this.height+aux>0)&&(this.y+this.height+aux<675)&&(!this.colisao(mapa)))
			return aux;
		else
			return 0;
		//return ((-speed*mod) * Math.cos(angle* (Math.PI/180)));
	};
	this.Check = function () {
		if (Keyboard.pressedKeys[Keyboard.backspace]) {
			location.reload();
		}
		if (Keyboard.pressedKeys[Keyboard.up] == false && Keyboard.pressedKeys[Keyboard.down] == false) {
			this.mod = 0;
		}
		else {
			if (Keyboard.pressedKeys[Keyboard.up]) {
				this.mod = 1;
			}
			if (Keyboard.pressedKeys[Keyboard.down]) {
				this.mod = -1;
			}
			if (Keyboard.pressedKeys[Keyboard.left]) {
				this.wheelAngle += 4 * this.mod;
			}
			if (Keyboard.pressedKeys[Keyboard.right]) {
				this.wheelAngle -= 4 * this.mod;

			}
			if (Keyboard.pressedKeys[Keyboard.ponto]&& this.nitro > 0) {
				if (this.nitro > 0) {
					this.nitro--;
					this.speed = 7;
				}
			}
			if (!Keyboard.pressedKeys[Keyboard.ponto]|| this.nitro == 0) {
				this.speed = 5;
			}
		}
	}

};
function drawCarro(context,x,y,angle,carro){
	context.save();
	context.translate(x, y);
	context.rotate(Math.PI/180 * angle);
	context.drawImage(carro, -(carro.width)/2,-(carro.height/2));
	context.restore();
}
function comparaTempos(tempo1,tempo2) {

	if (tempo1.sec < tempo2.sec)
		return 1;
	else if (tempo1.sec > tempo2.sec)
		return 2;
	else {
		if (tempo1.msec < tempo2.msec)
			return 1;
		else if (tempo1.msec > tempo2.msec)
			return 2;
		else
			return 0;

	}
}

var Context = {
	canvas: null,
	context: null,
	create: function(canvasID){
		this.canvas = document.getElementById(canvasID);
		this.context = this.canvas.getContext("2d");
		this.context.canvas.width = 1275;
		this.context.canvas.height = 675;
		return this.context;
	}
};
var Keyboard = {
	pressedKeys:[],
	left : 39 ,
	right : 37,
	down : 40,
	up : 38,
	ponto : 190,
	backspace: 8,
	esc:27,
	init: function(){
		this.pressedKeys[27]=false;
		this.pressedKeys[39]=false;
		this.pressedKeys[37]=false;
		this.pressedKeys[40]=false;
		this.pressedKeys[38]=false;
		this.pressedKeys[190]=false;
		this.pressedKeys[46]=false;
},

	onKeyDown: function (e) {
		e = e || event;
		this.pressedKeys[e.keyCode] = true;
	},
	onKeyUp: function (e) {
		e = e || event;
		this.pressedKeys[e.keyCode] = false;
	},
	isPressed: function (key) {
		return this.pressedKeys[key];
	}
};


var Tempo = function (sec,msec) {
	this.sec = sec;
	this.msec = msec;
};

function cronometro(msec,inicio) {
	if(inicio){
		Context.context.font='100pt verdana';
		Context.context.fillStyle = 'red';
		if(msec>=0 && msec<150){
			Context.context.fillText('3',580, 300);
		}
		else if(msec>=150 && msec<300){
			Context.context.fillText('2', 580, 300);
		}
		else if(msec>=300 && msec<450){
			Context.context.fillText('1', 580, 300);

		}
	}

	else{
		msec = msec-450;
		if(msec<150){
			Context.context.font = '100pt verdana';
			Context.context.fillStyle = '#06cb0e';
			Context.context.fillText('GO', 550, 300);
		}
		Context.context.font = '25pt verdana';
		Context.context.fillStyle = 'white';
		var sec = 0;
		if(msec>1000){
			sec = Math.floor(msec/1000);
			aux =(Math.floor(msec/1000)*1000);
			msec=msec-aux;
		}
		if(msec<100){
			msec = '0'+msec;
		}
		if(sec<10){
			sec = '0'+sec;
		}

		var aux = sec+':'+msec;
		Context.context.fillText(aux, 1100, 50);

		var tempo = new Tempo(sec,msec);
		return tempo;
	}
}

var mundo = function (numMapa) {
	this.player = new Carro();
	this.numMapa = numMapa;
	this.roadTile1 = new Sprite(imgFolder+"/pista/1.png", true);
	this.roadTile2 = new Sprite(imgFolder+"/pista/2.png", true);
	this.roadTile3 = new Sprite(imgFolder+"/pista/3.png", true);
	this.roadTile4 = new Sprite(imgFolder+"/pista/4.png", true);
	this.roadTile5 = new Sprite(imgFolder+"/pista/5.png", true);
	this.roadTile6 = new Sprite(imgFolder+"/pista/6.png", true);
	this.roadTile7 = new Sprite(imgFolder+"/pista/7.png", true);
	this.roadTile8 = new Sprite(imgFolder+"/pista/8.png", true);
	this.relvaTile = new Sprite(imgFolder+"/pista/relva2.png", true);
	this.relvaTile1 = new Sprite(imgFolder+"/pista/relva4.png", true);
	this.relvaTile2 = new Sprite(imgFolder+"/pista/relva3.png", true);
	this.relvaTile3 = new Sprite(imgFolder+"/pista/relva5.png", true);
	this.relvaTile4 = new Sprite(imgFolder+"/pista/relva6.png", true);
	this.finish = new Sprite(imgFolder+"/pista/finish.png", true);
	this.bar1 = new Sprite(imgFolder + "bar1.png",false);
	this.bar2 = new Sprite(imgFolder + "bar2.png",false);
	this.bar3 = new Sprite(imgFolder + "bar3.png",false);
	this.bar4 = new Sprite(imgFolder + "bar4.png",false);
	this.bar5 = new Sprite(imgFolder + "bar5.png",false);
	this.bar6 = new Sprite(imgFolder + "bar6.png",false);
	this.tempoFinal=0;
	this.atualcheck=0;
	this.checkpointsImg = [];
	this.checkpoints = [];
	this.checkpointspos = [];
	this.carro = new Image();
	this.ciclos=0;
	this.menuPausa;
	this.menucontinuar;
	this.menusair;
	this.tamanhotile=75;
	this.isPaused=false;
	this.xant =0;
	this.idframe=0;
	this.yant = 0;
	this.variavel = queryString("car");
	this.carro.src = imgFolder + "0" + this.variavel + ".jpg";
	this.atualizaCheckpoints= function () {
		for(var i=0;i<this.numCheckpoints;i++){
			this.checkpointspos[i] = 0;
			this.checkpoints[i] = false;
			this.checkpointsImg[i] = new Image();
			this.checkpointsImg[i].src = imgFolder + "/pista/checkRed.png";
		}
	}
	switch (this.numMapa){
		case 1: this.mapa = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,12,0,0,12,0,0,0,12,0,0,12,0,0,0,
			0,0,13,1,2,2,2,2,7,2,2,2,2,3,13,0,0,
			0,0,1,6,0,10,0,0,0,0,0,10,0,4,3,0,0,
			0,0,5,10,0,0,0,0,0,0,0,0,0,10,5,0,0,
			0,0,5,10,0,0,0,0,0,0,0,0,0,10,5,0,0,
			0,0,4,3,0,10,0,0,0,0,0,10,0,1,6,0,0,
			0,0,13,4,2,2,2,2,9,2,2,2,2,6,13,0,0,
			0,0,0,12,0,0,12,0,0,0,12,0,0,12,0,0,0];
			this.numCheckpoints = 10;
			this.player.wheelAngle =270;
			this.atualizaCheckpoints();
			this.player.x = 550;
			this.player.y=545;
			this.goldMedal = new Tempo(45,0);
			this.silverMedal = new Tempo(48,0);
			this.bronzeMedal= new Tempo(51,0);
			this.checkpointspos[0] = 127;
			break;

		
		case 2:this.mapa = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
										0,0,0,13,0,0,0,0,0,0,0,0,0,0,0,0,0,
										5,10,1,7,3,0,0,0,0,10,0,0,0,0,10,0,0,
										5,0,5,12,5,13,0,0,0,1,2,2,2,2,3,12,0,
										5,10,5,0,5,0,12,0,0,5,12,13,13,12,8,0,0,
										5,0,5,12,4,2,2,2,2,6,12,13,13,12,5,13,0,
										5,0,5,0,0,0,0,0,0,0,12,13,13,12,5,13,0,
										5,10,5,0,0,9,2,2,2,3,12,13,13,12,5,0,0,
										4,7,6,12,0,0,0,0,13,4,2,2,2,2,6,10,0,
		];
			this.numCheckpoints = 3;
			this.atualizaCheckpoints();
			this.goldMedal = new Tempo(12,500);
			this.silverMedal = new Tempo(14,500);
			this.bronzeMedal= new Tempo(16,500);
			this.player.x = 55;
			this.player.y = 185;
			break;

		case 3:this.mapa = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
							12,0,0,10,0,0,0,12,0,0,0,10,0,0,0,12,0,
							2,2,2,2,2,2,2,2,2,2,7,2,2,2,2,3,0,
							0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,10,
							1,7,3,13,1,7,3,13,1,2,3,13,0,0,1,6,0,
							5,12,4,7,6,12,4,7,6,12,4,2,9,0,8,12,0,
							5,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,
							5,12,0,0,0,10,0,0,0,12,0,0,0,10,5,0,0,
							4,2,2,2,2,2,2,2,2,2,2,2,2,7,6,10,0,
																];

			this.numCheckpoints =8;
			this.player.wheelAngle =90;
			this.atualizaCheckpoints();
			this.goldMedal = new Tempo(13,600);
			this.silverMedal = new Tempo(14,500);
			this.bronzeMedal= new Tempo(15,500);
			this.player.x = 25;
			this.player.y = 165;
			break;
		case 4:this.mapa = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,0,0,0,0,0,0,1,2,7,2,2,2,3,12,0,0,
			0,0,0,0,0,0,0,5,12,12,12,12,12,4,3,0,0,
			0,12,1,2,2,2,2,2,2,3,12,12,12,12,8,0,0,
			0,1,6,13,0,0,0,5,0,4,7,2,2,2,2,2,3,
			0,5,13,0,0,0,0,9,0,0,12,13,12,13,5,0,8,
			0,4,2,2,7,3,12,0,0,0,13,1,2,2,6,0,5,
			0,0,0,0,12,4,2,2,2,2,2,6,12,0,0,0,5,
			0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5];

			this.numCheckpoints = 5;
			this.player.wheelAngle = 360;
			this.goldMedal = new Tempo(13,500);
			this.silverMedal = new Tempo(15,500);
			this.bronzeMedal= new Tempo(17,0);
			this.player.x = 1250;
			this.player.y = 630;

			this.atualizaCheckpoints();
			break;
		case 5:this.mapa = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,5,0,0,1,2,2,7,2,2,3,0,0,0,0,9,0,
			0,5,0,0,5,12,13,12,13,12,5,0,0,0,0,5,0,
			0,4,3,12,5,13,12,13,12,13,5,0,0,0,13,8,0,
			0,12,4,7,6,0,0,1,2,2,6,0,0,12,1,6,0,
			0,0,0,0,0,0,0,5,0,0,0,0,0,1,6,12,0,
			1,7,2,2,2,2,2,6,0,1,7,2,2,6,13,0,0,
			5,12,0,0,12,0,0,12,0,5,0,0,0,0,0,0,0,
			4,2,2,2,2,2,2,2,2,6,0,0,0,0,0,0,0,
		];

			this.numCheckpoints =5;
			this.goldMedal = new Tempo(14,500);
			this.silverMedal = new Tempo(16,0);
			this.bronzeMedal= new Tempo(17,0);
			this.player.wheelAngle =180;
			this.atualizaCheckpoints();
			this.player.x = 110;
			this.player.y = 100;
			break;
		case 6:this.mapa = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			12,5,0,1,7,3,0,9,0,0,0,0,0,0,0,0,0,
			13,5,0,5,12,5,0,4,2,2,2,2,2,7,2,3,13,
			12,5,0,5,0,5,0,0,0,0,0,0,0,0,0,5,12,
			13,5,0,5,12,5,0,0,0,1,7,3,0,0,0,5,13,
			12,5,0,5,0,5,0,0,1,6,12,5,0,0,0,5,12,
			13,5,0,5,12,5,0,1,6,12,12,5,0,0,0,8,13,
			12,5,0,5,0,5,0,5,12,12,12,5,0,0,0,5,12,
			13,4,7,6,12,4,7,6,12,12,12,4,7,2,2,6,13,
		];

			this.numCheckpoints =7;
			this.player.wheelAngle =180;
			this.atualizaCheckpoints();
			this.goldMedal = new Tempo(13,500);
			this.silverMedal = new Tempo(15,0);
			this.bronzeMedal= new Tempo(16,0);
			this.player.x = 110;
			this.player.y = 100;
			break;
	}

	this.draw = function () {
		var heightCanvas = Math.floor(Context.context.canvas.height / 75);
		var widthCanvas = Math.floor(Context.context.canvas.width / 75);
		Context.context.fillStyle = "green";
		Context.context.fillRect(0, 0, Context.context.canvas.width, Context.context.canvas.height);
		var mapaIndex = 0;
		for (var y = 0; y < heightCanvas; y++) {
			for (var x = 0; x < widthCanvas; x++, mapaIndex++) {
				if (this.mapa[mapaIndex] == 0) {
					this.relvaTile.draw(x * 75, y * 75, 75, 75);
				}
				else if (this.mapa[mapaIndex] == 1) {
					this.roadTile1.draw(x * 75, y * 75, 75, 75);
				}
				else if (this.mapa[mapaIndex] == 2) {
					this.roadTile2.draw(x * 75, y * 75, 75, 75);
				}
				else if (this.mapa[mapaIndex] == 3) {
					this.roadTile3.draw(x * 75, y * 75, 75, 75);
				}
				else if (this.mapa[mapaIndex] == 4) {
					this.roadTile4.draw(x * 75, y * 75, 75, 75);
				}
				else if (this.mapa[mapaIndex] == 5) {
					this.roadTile5.draw(x * 75, y * 75, 75, 75);
				}
				else if (this.mapa[mapaIndex] == 6) {
					this.roadTile6.draw(x * 75, y * 75, 75, 75);
				}
				else if (this.mapa[mapaIndex] == 7) {
					this.roadTile7.draw(x * 75, y * 75, 75, 75);
				}
				else if (this.mapa[mapaIndex] == 8) {
					this.roadTile8.draw(x * 75, y * 75, 75, 75);
				}
				else if (this.mapa[mapaIndex] == 9) {
					this.finish.draw(x * 75, y * 75, 75, 75);
				}
				else if (this.mapa[mapaIndex] == 10) {
					this.relvaTile1.draw(x * 75, y * 75, 75, 75);
				}
				else if (this.mapa[mapaIndex] == 11) {
					this.relvaTile2.draw(x * 75, y * 75, 75, 75);
				}
				else if (this.mapa[mapaIndex] == 12) {
					this.relvaTile3.draw(x * 75, y * 75, 75, 75);
				}
				else if (this.mapa[mapaIndex] == 13) {
					this.relvaTile4.draw(x * 75, y * 75, 75, 75);
				}
			}
		}
		for(var i=0;i<10;i++){
			if(i==0)
				this.bar6.draw(700,10,20,40);
			else if(i==9){
				this.bar2.draw(700+(20*i),10,20,40);
			}
			else{
				this.bar3.draw(700+(20*i),10,20,40);
			}
		}
		for(var i=0;i<(this.player.nitro/20);i++){
			if(i==0) {
				this.bar1.draw(700, 10, 20, 40);
			}
			else if(i==9){
				this.bar5.draw(700+(20*i),10,20,40	);
			}
			else{
				this.bar4.draw(700+(20*i),10,20,40);
			}
		}
		drawCarro(Context.context, this.player.x, this.player.y, this.player.wheelAngle,this.carro);


		for(var j=0;j<this.numCheckpoints;j++){
			Context.context.drawImage(this.checkpointsImg[j],100+(50*j),5);

		}
	};
	this.cronometro = function(msec,inicio) {
		if(inicio){
			Context.context.font='100pt verdana';
			Context.context.fillStyle = 'red';
			if(msec>=0 && msec<150){
				Context.context.fillText('3',580, 300);
			}
			else if(msec>=150 && msec<300){
				Context.context.fillText('2', 580, 300);
			}
			else if(msec>=300 && msec<450){
				Context.context.fillText('1', 580, 300);

			}
		}

		else{
			msec = msec-450;
			if(msec<150){
				Context.context.font = '100pt verdana';
				Context.context.fillStyle = '#06cb0e';
				Context.context.fillText('GO', 550, 300);
			}
			Context.context.font = '25pt verdana';
			Context.context.fillStyle = 'white';
			var sec = 0;
			if(msec>1000){
				sec = Math.floor(msec/1000);
				aux =(Math.floor(msec/1000)*1000);
				msec=msec-aux;
			}
			if(msec<100){
				msec = '0'+msec;
			}
			if(sec<10){
				sec = '0'+sec;
			}

			var aux = sec+':'+msec;
			Context.context.fillText(aux, 1100, 50);

			var tempo = new Tempo(sec,msec);
			return tempo;
		}
	}

	this.retornaMedalha = function(){
		if(comparaTempos(this.tempoFinal,this.goldMedal)==1){
			return 1;
		}
		else{
			if(comparaTempos(this.tempoFinal,this.silverMedal) == 1){
				return 2;
			}
			else{
				if(comparaTempos(this.tempoFinal,this.bronzeMedal) == 1){
					return 3;
				}
				else{
					return 4;
				}
			}
		}
	}
	this.isCompleted = function () {
		for(var i=0;i<this.numCheckpoints;i++){
			if(this.checkpoints[i] == false){
				return false;
			}
		}
		return true;
	}


	this.motor = function () {
		this.idframe=window.requestAnimationFrame(this.motor.bind(this));
		if (Keyboard.pressedKeys[Keyboard.esc]) {
			this.isPaused = true;
		}
		if(this.isPaused){
			this.menuPausa = new Sprite(imgFolder+"pauseMenu.png", false);
			this.menuPausa.draw(450,200,300,300);
				this.menucontinuar = new button(474,714,182,237);
				this.menusair = new button(474,714,256,305);
			if(this.menusair.checkMouse()){
				window.cancelAnimationFrame(this.idframe);
				window.location = ("menu.html");
			}
			else if(this.menucontinuar.checkMouse()){
				this.isPaused = false;
				Mouse.mouseX = 0;
				Mouse.mouseY = 0;
			}
		}
		else {
			this.draw();
			var aux = 0;
			var completo = this.isCompleted();
			if(this.numMapa!=1) {
				if ((this.mapa[(Math.floor((this.player.x) / this.tamanhotile) + (17 * Math.floor((this.player.y) / this.tamanhotile)))] != 9) || (completo == false)) {
					if (((this.mapa[Math.floor((this.player.x) / this.tamanhotile) + (17 * Math.floor((this.player.y) / this.tamanhotile))] == 7 || this.mapa[Math.floor((this.player.x) / this.tamanhotile) + (17 * Math.floor((this.player.y) / this.tamanhotile))] == 8) && (this.mapa[Math.floor((this.xant) / this.tamanhotile) + (17 * Math.floor((this.yant) / this.tamanhotile))] != 7 && this.mapa[Math.floor((this.xant) / this.tamanhotile) + (17 * Math.floor((this.yant) / this.tamanhotile))] != 8))) {
						for (var i = 0; i < this.numCheckpoints; i++) {
							if (this.checkpointspos[i] == Math.floor((this.player.x) / this.tamanhotile) + (17 * Math.floor((this.player.y) / this.tamanhotile)))
								aux = 1;
						}
						if (aux == 0 && (this.atualcheck < this.numCheckpoints)) {
							this.checkpointspos[this.atualcheck] = Math.floor((this.player.x) / this.tamanhotile) + (17 * Math.floor((this.player.y) / this.tamanhotile));
							this.checkpointsImg[this.atualcheck].src = imgFolder + "/pista/checkGreen.png";
							this.checkpoints[this.atualcheck++] = true;
						}
					}
				}

				else if (completo == true) {
					this.tempoFinal.msec = this.tempoFinal.msec + 20;
					window.cancelAnimationFrame(this.idframe);
					window.location = ("pistacheck.html?medalha="+this.retornaMedalha());
				}
			}
			else{
				if(completo == false) {
					if (this.mapa[Math.floor((this.player.x) / this.tamanhotile) + (17 * Math.floor((this.player.y) / this.tamanhotile))] == 9 && (this.mapa[Math.floor((this.xant) / this.tamanhotile) + (17 * Math.floor((this.yant) / this.tamanhotile))] != 9) || this.mapa[Math.floor((this.player.x) / this.tamanhotile) + (17 * Math.floor((this.player.y) / this.tamanhotile))] == 7 && (this.mapa[Math.floor((this.xant) / this.tamanhotile) + (17 * Math.floor((this.yant) / this.tamanhotile))] != 7)) {
						for (var i = 0; i < this.numCheckpoints; i++) {
							if (this.checkpointspos[i] == Math.floor((this.player.x) / this.tamanhotile) + (17 * Math.floor((this.player.y) / this.tamanhotile)))
								aux = 1;
						}
						if (this.mapa[Math.floor((this.player.x) / this.tamanhotile) + (17 * Math.floor((this.player.y) / this.tamanhotile))] == 9 && (this.mapa[Math.floor((this.xant) / this.tamanhotile) + (17 * Math.floor((this.yant) / this.tamanhotile))] != 9)) {
							for (var i = 0; i < this.numCheckpoints; i++) {
								if (this.checkpointspos[i] == 42)
									this.checkpointspos[i] = 0;
							}
						}
						else {
							for (var i = 0; i < this.numCheckpoints; i++) {
								if (this.checkpointspos[i] == 127)
									this.checkpointspos[i] = 0;
							}
						}

						if (aux == 0 && (this.atualcheck < this.numCheckpoints)) {
							this.checkpointspos[this.atualcheck] = Math.floor((this.player.x) / this.tamanhotile) + (17 * Math.floor((this.player.y) / this.tamanhotile));
							this.checkpointsImg[this.atualcheck].src = imgFolder + "/pista/checkGreen.png";
							this.checkpoints[this.atualcheck++] = true;

						}
					}
				}
				else if ((completo == true) && (this.mapa[Math.floor((this.player.x) / this.tamanhotile) + (17 * Math.floor((this.player.y) / this.tamanhotile))] == 9)) {
					window.cancelAnimationFrame(this.idframe);

					this.tempoFinal.msec = this.tempoFinal.msec + 20;
					window.location = ("pistacheck.html?medalha="+this.retornaMedalha());
				}
			}
			this.xant = this.player.x;
			this.yant = this.player.y;
			var aux1 = this.player.atualizax(this.mapa);
			var aux2 = this.player.atualizay(this.mapa);
			if (this.mapa[Math.floor(this.player.x / this.tamanhotile) + (17 * Math.floor(this.player.y / this.tamanhotile))] != 0) {
				if (aux1 == 0) {
					this.player.x += aux1;
					this.player.y += aux2 / 5;
				}
				else if (aux2 == 0) {
					this.player.x += aux1 / 5;
					this.player.y += aux2;
				}
				else {
					this.player.x += aux1;
					this.player.y += aux2;
				}
			}
			else {
					this.player.x += aux1 / 5;
					this.player.y += aux2 / 5;
				}

			if (this.ciclos < 450) {
				this.ciclos += 3;
				this.cronometro(this.ciclos, true);
			}
			else {
				this.player.Check();
				this.ciclos += 20;
				this.tempoFinal = this.cronometro(this.ciclos, false);
			}
		}
	}
};

	function main() {
		//initialize
		var audio = document.getElementById("audio");
		var botaosom = document.getElementById("somimagem");
		audio.volume = 0.2;
		var auxaudio=queryString("auxaudio");
		if(auxaudio===0){
			audio.muted = true;
			botaosom.src= imgFolder + "SomOff.png";
		}
		else{
			audio.muted = false;
			botaosom.src= imgFolder + "SomOn.png";
		}
		var cliquesom = function(evt){
			if(auxaudio===1){
				audio.muted = true;
				botaosom.src= imgFolder + "SomOff.png";
				auxaudio=0;
			}
			else{
				audio.muted = false;
				auxaudio=1;
				botaosom.src= imgFolder + "SomOn.png";
			}
		}
		botaosom.addEventListener("click",cliquesom);
		Context.create("myCanvas");
		window.addEventListener("keyup", function () {
			Keyboard.onKeyUp(event)
		});
		window.addEventListener("keydown", function () {
			Keyboard.onKeyDown(event)
		});
		window.addEventListener("click", function () {
			Mouse.mouseClick(event)
		});
		var pista = queryString("pista");
		if(pista==1)
			var jogo = new mundo(1);
		else if(pista==2)
			var jogo = new mundo(2);
		else if(pista ==3)
			var jogo = new mundo(3);
		else if(pista==4)
			var jogo = new mundo(4);
		else if(pista==5)
			var jogo = new mundo(5);
		else if(pista==6)
			var jogo = new mundo(6);
		Keyboard.init();
		jogo.motor();
	}



	var higscore = [];
	function actualizaHighScores(){
		for(var i=0;i<highscore.length;i++) {
			var melhortempo = false;
			if (comparaTempos(tempoFinal, highscore[i]) == 1) {
				melhortempo = true;
				var aux = i;
			}
		}
		if(melhotempo == true){
			for(var j=aux;j<highscore.length;j++){
				if(highscore[j+1] != null) {
					highscore[j + 1] = highscore[j];
					highscore[aux] = tempoFinal;
				}
			}
		}
	}



