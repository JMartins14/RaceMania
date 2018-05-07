const imgFolder = "../Projeto/resources/images/";

(function()
{
	window.addEventListener("load", main);
}());


function main()
{
	var largura = window.innerWidth;
	var altura = window.innerHeight;
	menu(largura,altura);
}

function menu(largura,altura){
	var livre = document.getElementById("livre");
	var carreira = document.getElementById("multiplayer");
	var highscores = document.getElementById("highscores");
	var comandos = document.getElementById("comandos");
	var ajuda = document.getElementById("ajuda");
	var creditos = document.getElementById("creditos");
	var botaosom = document.getElementById("somimagem");
	var audio = document.getElementById("audio");
	var variavel = queryString("audiotime");
	audio.currentTime = variavel;
	audio.volume = 0.2;
	var auxaudio= queryString("auxaudio");
	if(auxaudio==0){
		audio.muted = true;
		botaosom.src="../resources/images/SomOff.png";
	}
	else{
		audio.muted = false;
		botaosom.src="../resources/images/SomOn.png";
	}

	var evt = function(ev){
		this.style.backgroundPosition = "right";
		var sombotao = document.getElementById("sombotao");
		if(auxaudio==0)
			sombotao.muted=true;
		else {
			sombotao.muted = false;
			sombotao.volume = 0.2;
		}
		sombotao.play();

		switch(ev.target.id){
			case "livre": sombotao.addEventListener('ended', function(){ window.location = ("livre.html?audiotime="+audio.currentTime+"?auxaudio="+auxaudio);});break;
			case "multiplayer": sombotao.addEventListener('ended', function(){ window.location = ("multiplayer.html?audiotime="+audio.currentTime+"?auxaudio="+auxaudio);});break;	
			case "highscores": sombotao.addEventListener('ended', function(){ window.location = ("highscores.html?audiotime="+audio.currentTime+"?auxaudio="+auxaudio);});break;
			case "comandos": sombotao.addEventListener('ended', function(){ window.location = ("comandos.html?audiotime="+audio.currentTime+"?auxaudio="+auxaudio);});break;
			case "ajuda": sombotao.addEventListener('ended', function(){ window.location = ("ajuda.html?audiotime="+audio.currentTime+"?auxaudio="+auxaudio);}); break;
			case "creditos": sombotao.addEventListener('ended', function(){ window.location = ("creditos.html?audiotime="+audio.currentTime+"?auxaudio="+auxaudio);});break;
		}
	}
	livre.addEventListener("click",evt);
	carreira.addEventListener("click",evt);
	highscores.addEventListener("click",evt);
	comandos.addEventListener("click",evt);
	ajuda.addEventListener("click",evt);
	creditos.addEventListener("click",evt);
	var cliquesom = function(evt){
		if(auxaudio==1){
			audio.muted = true;
			botaosom.src="../resources/images/SomOff.png";
			auxaudio=0;
		}
		else{
			audio.muted = false;
			auxaudio=1;
			botaosom.src="../resources/images/SomOn.png";
		}
	}
	botaosom.addEventListener("click",cliquesom);
}

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
		return 0;
	}   
}




