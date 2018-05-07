const imgFolder = "../resources/images/";

(function()
{
	window.addEventListener("load", main);
}());
var Mouse = {
	mouseX : 0,
	mouseY: 0,
	mouseClick: function (e) {
		this.mouseX = e.pageX - Context.canvas.offsetLeft;
		this.mouseY = e.pageY - Context.canvas.offsetTop;
	}
};
function queryString(parameter) {
    var loc = location.search.substring(1, location.search.length);
    var param_value = false;
    var params = loc.split("?");
    for (i=0; i<params.length;i++) {
        param_name = params[i].substring(0,params[i].indexOf('='));
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
var Carro = function (numplayer) {

	this.nitro = 200;
	this.numplayer=numplayer;
	if(this.numplayer==1) {
		this.x = 0;
		this.y = 0;
	}
	else if(this.numplayer==2){
		this.x=0;
		this.y=0;
	}
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
		if(((this.x-this.width/2)+aux>0)&&(this.x+(this.width/2)+aux<Context.canvas.width)&&(!this.colisao(mapa))) {
			return aux;
		}
		else {
			return 0;
		}
	};
	this.atualizay = function(mapa){
		var aux = ((-this.speed*this.mod) * Math.cos(this.wheelAngle* (Math.PI/180)));
		if((this.y-this.height+aux>0)&&(this.y+this.height+aux<Context.canvas.height)&&(!this.colisao(mapa)))
			return aux;
		else
			return 0;
	};
	this.Check = function () {
		if (Keyboard.pressedKeys[Keyboard.backspace]) {
			location.reload();
		}
		if(this.numplayer==1) {
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
					this.wheelAngle +=4 * this.mod;
				}
				if (Keyboard.pressedKeys[Keyboard.right]) {
					this.wheelAngle -= 4* this.mod;
				}
				if (Keyboard.pressedKeys[Keyboard.ponto] && this.nitro > 0) {
					this.nitro--;
					this.speed = 7;
				}
				if (!Keyboard.pressedKeys[Keyboard.ponto] || this.nitro == 0) {
					this.speed = 5;
				}

			}
		}
		if(this.numplayer==2){
			if (Keyboard.pressedKeys[Keyboard.w] == false && Keyboard.pressedKeys[Keyboard.s] == false) {
				this.mod = 0;
			}
			else {

				if (Keyboard.pressedKeys[Keyboard.w]) {
					this.mod = 1;
				}
				if (Keyboard.pressedKeys[Keyboard.s]) {
					this.mod = -1;
				}
				if (Keyboard.pressedKeys[Keyboard.a]) {
					this.wheelAngle += 4 * this.mod;
				}
				if (Keyboard.pressedKeys[Keyboard.d]) {
					this.wheelAngle -= 4 * this.mod;

				}
				if (Keyboard.pressedKeys[Keyboard.z] && this.nitro > 0) {
					this.nitro--;
					this.speed = 7;
				}
				if (!Keyboard.pressedKeys[Keyboard.z] || this.nitro == 0) {
					this.speed = 5;
				}
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
	backspace: 8,
	w: 87,
	s: 83,
	d: 65,
	a: 68,
	z : 90,
	ponto : 190,
	esc:27,
	init: function(){
		this.pressedKeys[27]=false;
		this.pressedKeys[39]=false;
		this.pressedKeys[37]=false;
		this.pressedKeys[40]=false;
		this.pressedKeys[38]=false;
		this.pressedKeys[90]=false;
		this.pressedKeys[46]=false;
		this.pressedKeys[87]=false;
		this.pressedKeys[83]=false;
		this.pressedKeys[68]=false;
		this.pressedKeys[65]=false;
		this.pressedKeys[190]=false;
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

function comparaTempos(tempo1,tempo2) {

	if (tempo1.sec > tempo2.sec)
		return 1;
	else if (tempo1.sec < tempo2.sec)
		return 2;
	else {
		if (tempo1.msec > tempo2.msec)
			return 1;
		else if (tempo1.msec < tempo2.msec)
			return 2;
		else
			return 0;

	}
}

var mundo = function (numMapa,audio,botaosom) {
	this.audio = audio;
	this.botaosom = botaosom;
	this.audio.volume = 0.2;
    this.queryString = function(parameter){
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
	this.auxaudio=this.queryString("auxaudio");
	this.audio.muted = true;
	if(this.auxaudio==0){
		this.audio.muted = true;
		this.botaosom.src= imgFolder + "SomOff.png";
	}
	else{
		this.audio.muted = false;
		this.botaosom.src= imgFolder + "SomOn.png";
	}
	this.player = new Carro(1);
	this.player2 = new Carro(2);
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
	this.atualcheck2=0;
	this.numCheckpoints=0;
	this.checkpointsImg = [];
	this.checkpoints = [];
	this.checkpointspos = [];
	this.checkpointsImg2 = [];
	this.checkpoints2 = [];
	this.checkpointspos2 = [];
	this.carro = new Image();
	this.carro2 = new Image();
	this.ciclos=0;
	this.menuPausa;
	this.menucontinuar;
	this.menusair;
	this.xant =0;
	this.tamanhotile = 75;
	this.isPaused=false;
	this.xant2=0;
	this.yant = 0;
	this.variavel = this.queryString("car1");
	this.variavel2 = this.queryString("car2");
	this.carro.src = imgFolder + "0" + this.variavel + ".jpg";
	this.carro2.src = imgFolder + "0" + this.variavel2 + ".jpg";
    this.cliquesom = function(){
        if(this.auxaudio==1){
            console.log(this.audio.muted);
            //this.audio.muted = true;
            //this.botaosom.src= imgFolder + "SomOff.png";
            this.auxaudio=0;
        }
        else{
            //this.audio.muted = false;
            //this.auxaudio=1;
            //this.botaosom
            //this.botaosom.src= imgFolder + "SomOn.png";
        }
    }
    console.log(this.auxaudio);
    this.botaosom.addEventListener("click",this.cliquesom);
    this.atualizaCheckpoints= function () {
        for(var i=0;i<this.numCheckpoints;i++){
            this.checkpointspos[i] = 0;
            this.checkpoints[i] = false;
            this.checkpointsImg[i] = new Image();
            this.checkpointsImg[i].src = imgFolder + "/pista/checkRed.png";
            this.checkpointspos2[i] = 0;
            this.checkpoints2[i] = false;
            this.checkpointsImg2[i] = new Image();
            this.checkpointsImg2[i].src = imgFolder + "/pista/checkRed.png";
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
			0,0,0,12,0,0,12,0,0,0,12,0,0,12,0,0,0
		];
			this.numCheckpoints = 10;
			this.player.wheelAngle =270;
			this.player2.wheelAngle = 270;
			this.player.x = 550;
			this.player.y=545;
			this.player2.x =550 ;
			this.player2.y = 575;
            this.atualizaCheckpoints();
			this.checkpointspos[0] = 127;
			this.checkpointspos2[0] = 127;


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
			this.player.x = 55;
			this.player.y = 185;
			this.player2.x=25;
			this.player2.y=185;
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
			this.player2.wheelAngle = 90;
            this.atualizaCheckpoints();
			this.player.x = 25;
			this.player.y = 165;
			this.player2.x=25;
			this.player2.y=205;
			break;
        case 4:this.mapa = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,1,2,7,2,2,2,3,12,0,0,
            0,0,0,0,0,0,0,5,0,0,0,0,0,4,3,0,0,
            0,12,1,2,2,2,2,2,2,3,0,0,0,11,8,0,0,
            0,1,6,13,0,0,0,5,0,4,7,2,2,2,2,2,3,
            0,5,13,0,0,0,0,9,0,0,0,0,0,11,5,0,8,
            0,4,2,2,7,3,0,0,0,0,0,1,2,2,6,0,5,
            0,0,0,0,12,4,2,2,2,2,2,6,12,0,0,0,5,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5];

            this.numCheckpoints = 5;
            this.player.wheelAngle = 360;
            this.player2.wheelAngle=360;
            this.player.x = 1250;
            this.player.y = 630;
            this.player2.x=1222;
            this.player2.y=630;

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
            this.player.wheelAngle =180;
            this.player2.wheelAngle=180;
            this.atualizaCheckpoints();
            this.player.x = 130;
            this.player2.x = 100;
            this.player.y = 100;
            this.player2.y=100;
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
            this.player2.wheelAngle =180;
            this.atualizaCheckpoints();
            this.player.x = 130;
            this.player2.x = 100;
            this.player.y = 100;
            this.player2.y=100;
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
		for(var i=0;i<10;i++){
			if(i==0)
				this.bar6.draw(700,60,20,40);
			else if(i==9){
				this.bar2.draw(700+(20*i),60,20,40);
			}
			else{
				this.bar3.draw(700+(20*i),60,20,40);
			}
		}
		for(var i=0;i<(this.player2.nitro/20);i++){
			if(i==0) {
				this.bar1.draw(700, 60, 20, 40);
			}
			else if(i==9){
				this.bar5.draw(700+(20*i),60,20,40	);
			}
			else{
				this.bar4.draw(700+(20*i),60,20,40);
			}
		}
		drawCarro(Context.context, this.player.x, this.player.y, this.player.wheelAngle,this.carro);
		drawCarro(Context.context, this.player2.x, this.player2.y, this.player2.wheelAngle,this.carro2);


		for(var j=0;j<this.numCheckpoints;j++){
			Context.context.drawImage(this.checkpointsImg[j],100+(50*j),5);
			Context.context.drawImage(this.checkpointsImg2[j],100+(50*j),50);

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
	this.isCompleted = function (numplayer) {
		for(var i=0;i<this.numCheckpoints;i++){
			if(numplayer==1) {
				if (this.checkpoints[i] == false)
					return false;
			}
			else if(numplayer==2){
				if (this.checkpoints2[i] == false)
					return false;
			}
		}
		return true;
	};


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
		else {this.draw();
			var aux = 0;
			var completo2 = this.isCompleted(2);
			aux3=0;
			var completo = this.isCompleted(1);
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
				if ((this.mapa[(Math.floor((this.player2.x) / this.tamanhotile) + (17 * Math.floor((this.player2.y) / this.tamanhotile)))] != 9) || (completo2 == false)) {
					if (((this.mapa[Math.floor((this.player2.x) / this.tamanhotile) + (17 * Math.floor((this.player2.y) / this.tamanhotile))] == 7 || this.mapa[Math.floor((this.player2.x) / this.tamanhotile) + (17 * Math.floor((this.player2.y) / this.tamanhotile))] == 8) && (this.mapa[Math.floor((this.xant2) / this.tamanhotile) + (17 * Math.floor((this.yant2) / this.tamanhotile))] != 7 && this.mapa[Math.floor((this.xant2) / this.tamanhotile) + (17 * Math.floor((this.yant2) / this.tamanhotile))] != 8))) {
						for (var i = 0; i < this.numCheckpoints; i++) {
							if (this.checkpointspos2[i] == Math.floor((this.player2.x) / this.tamanhotile) + (17 * Math.floor((this.player2.y) / this.tamanhotile)))
								aux3 = 1;
						}
						if (aux3 == 0 && (this.atualcheck2 < this.numCheckpoints)) {
							this.checkpointspos2[this.atualcheck2] = Math.floor((this.player2.x) / this.tamanhotile) + (17 * Math.floor((this.player2.y) / this.tamanhotile));
							this.checkpointsImg2[this.atualcheck2].src = imgFolder + "/pista/checkGreen.png";
							this.checkpoints2[this.atualcheck2++] = true;
						}
					}
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
				if(completo2 == false) {
					if (this.mapa[Math.floor((this.player2.x) / this.tamanhotile) + (17 * Math.floor((this.player2.y) / this.tamanhotile))] == 9 && (this.mapa[Math.floor((this.xant2) / this.tamanhotile) + (17 * Math.floor((this.yant2) / this.tamanhotile))] != 9) || this.mapa[Math.floor((this.player2.x) / this.tamanhotile) + (17 * Math.floor((this.player2.y) / this.tamanhotile))] == 7 && (this.mapa[Math.floor((this.xant2) / this.tamanhotile) + (17 * Math.floor((this.yant2) / this.tamanhotile))] != 7)) {
						for (var i = 0; i < this.numCheckpoints; i++) {
							if (this.checkpointspos2[i] == Math.floor((this.player2.x) / this.tamanhotile) + (17 * Math.floor((this.player2.y) / this.tamanhotile)))
								aux3 = 1;
						}
						if (this.mapa[Math.floor((this.player2.x) / this.tamanhotile) + (17 * Math.floor((this.player2.y) / this.tamanhotile))] == 9 && (this.mapa[Math.floor((this.xant2) / this.tamanhotile) + (17 * Math.floor((this.yant2) / this.tamanhotile))] != 9)) {
							for (var i = 0; i < this.numCheckpoints; i++) {
								if (this.checkpointspos2[i] == 42)
									this.checkpointspos2[i] = 0;
							}
						}
						else {
							for (var i = 0; i < this.numCheckpoints; i++) {
								if (this.checkpointspos2[i] == 127)
									this.checkpointspos2[i] = 0;
							}
						}
						if (aux3 == 0 && (this.atualcheck2 < this.numCheckpoints)) {
							this.checkpointspos2[this.atualcheck2] = Math.floor((this.player2.x) / this.tamanhotile) + (17 * Math.floor((this.player2.y) / this.tamanhotile));
							this.checkpointsImg2[this.atualcheck2].src = imgFolder + "/pista/checkGreen.png";
							this.checkpoints2[this.atualcheck2++] = true;

						}
					}
				}
			}
			if ((completo == true)&&(this.mapa[(Math.floor((this.player.x) / this.tamanhotile) + (17 * Math.floor((this.player.y) / this.tamanhotile)))] == 9)) {
				window.cancelAnimationFrame(this.idframe);
				window.location = ("vitoriajogador1.html?auxaudio="+this.auxaudio);
			}
			if ((completo2 == true)&&(this.mapa[(Math.floor((this.player2.x) / this.tamanhotile) + (17 * Math.floor((this.player2.y) / this.tamanhotile)))] == 9)) {
				window.cancelAnimationFrame(this.idframe);
				window.location = ("vitoriajogador2.html?auxaudio="+this.auxaudio);
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
			this.xant2 = this.player2.x;
			this.yant2 = this.player2.y;
			aux1 = this.player2.atualizax(this.mapa);
			aux2 = this.player2.atualizay(this.mapa);
			if (this.mapa[Math.floor(this.player2.x / this.tamanhotile) + (17 * Math.floor(this.player2.y / this.tamanhotile))] != 0) {
				if (aux1 == 0) {
					this.player2.x += aux1;
					this.player2.y += aux2 / 5;
				}
				else if (aux2 == 0) {
					this.player2.x += aux1 / 5;
					this.player2.y += aux2;
				}
				else {
					this.player2.x += aux1;
					this.player2.y += aux2;
				}
			}
			else {
				this.player2.x += aux1 / 5;
				this.player2.y += aux2 / 5;
			}
			if (this.ciclos < 450) {
				this.ciclos += 3;
				this.cronometro(this.ciclos, true);
			}
			else {
				this.player.Check();
				this.player2.Check();
				this.ciclos += 20;
				this.tempoFinal = this.cronometro(this.ciclos, false);
			}
		}
	}
};
function main() {
	//initialize
	var audio = document.getElementById("audio");
	var botaosom = document.getElementById("sombotaoimagem");
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
		var jogo = new mundo(1,audio,botaosom);
	else if(pista==2)
		var jogo = new mundo(2,audio,botaosom);
	else if(pista==3)
		var jogo = new mundo(3,audio,botaosom);
    else if(pista==4)
        var jogo = new mundo(4,audio,botaosom);
    else if(pista==5)
        var jogo = new mundo(5,audio,botaosom);
    else if(pista==6)
        var jogo = new mundo(6,audio,botaosom);


    Keyboard.init();
	jogo.motor();
}


