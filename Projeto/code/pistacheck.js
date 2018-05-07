const imgFolder = "../resources/images/";

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
	var audio = document.getElementById("audio");
	var variavel = queryString("audiotime");
	var medalha = queryString("medalha");
	var imagem = document.getElementById("medalha");
	if(medalha<=3) {
		if (medalha == 1)
			imagem.src = (imgFolder + "medalha" + 1 + ".png");
		if (medalha == 2)
			imagem.src = (imgFolder + "medalha" + 2 + ".png");
		if (medalha == 3)
			imagem.src = (imgFolder + "medalha" + 3 + ".png");
	}
	else{
		imagem.src = (imgFolder + "check.png");

	}
	audio.currentTime = variavel;
	audio.volume = 0.2;
	var botaosom = document.getElementById("somimagem");
	var continuarBtn=document.getElementById("continuar");
	var auxaudio=queryString("auxaudio");
	if(auxaudio==0){
		audio.muted = true;
		botaosom.src="../resources/images/SomOff.png";
	}
	else{
		audio.muted = false;
		botaosom.src="../resources/images/SomOn.png";
	}
	var cbeh = function(ev)
	{
		this.style.backgroundPosition = "right";
		var sombotao = document.getElementById("sombotao");
		if(auxaudio==0)
			sombotao.muted=true;
		else
			sombotao.muted=false;
		sombotao.play();
		sombotao.volume = 0.2;
		sombotao.addEventListener('ended', function(){ window.location = ("livre.html?audiotime="+audio.currentTime+"?auxaudio="+auxaudio);});
	}
	continuar.addEventListener("click",cbeh);
	var botaosom = document.getElementById("somimagem");
	var voltar = document.getElementById("voltar");
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
		return 0;
	}   
}
