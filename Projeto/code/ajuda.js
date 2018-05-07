const imgFolder = "../resources/images/";

(function()
{
	window.addEventListener("load", main);
}());


function main()
{
	var audio = document.getElementById("audio");
	var largura = window.innerWidth;
	var altura = window.innerHeight;
	var variavel = queryString("audiotime");
	audio.currentTime = variavel;
	audio.volume=0.2;

	menu(largura,altura);


}

function menu(largura,altura){
	var botaosom = document.getElementById("somimagem");
	var voltar = document.getElementById("voltar");
	var titulocarreira = document.getElementById("titulocarreira");
	var auxaudio=queryString("auxaudio");
	if(auxaudio==0){
		audio.muted = true;
		botaosom.src="../resources/images/SomOff.png";
		auxaudio=0;
	}
	else{
		audio.muted = false;
		auxaudio=1;
		botaosom.src="../resources/images/SomOn.png";
	}
	var evt = function(ev){
		this.style.backgroundPosition = "right";
		var sombotao = document.getElementById("sombotao");
		if(auxaudio==0)
			sombotao.muted=true;
		else
			sombotao.muted=false;
		sombotao.play();
		sombotao.volume = 0.2;
		sombotao.addEventListener('ended', function(){ window.location = ("menu.html?audiotime="+audio.currentTime+"?auxaudio="+auxaudio);});
	}
	voltar.addEventListener("click",evt);
	var cliquesom = function(evt){
		if(auxaudio===1){
			audio.muted = true;
			botaosom.src= imgFolder + "SomOff.png";
			auxaudio=0;
		}
		else{
			audio.muted = false;
			audio.volume = 0.2;
			auxaudio=1;
			botaosom.src= imgFolder + "SomOn.png";
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
		return false;   
	}   
}
	