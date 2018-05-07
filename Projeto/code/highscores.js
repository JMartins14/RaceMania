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
	menu(largura,altura);
	var variavel = queryString("audiotime");
	audio.currentTime = variavel;
	audio.volume = 0.2;
}
function menu(largura,altura){
	var botaosom = document.getElementById("somimagem");

	var auxaudio= queryString("auxaudio");
	if(auxaudio==0){
		audio.muted = true;
		botaosom.src="../resources/images/SomOff.png";
	}
	else{
		audio.muted = false;
		botaosom.src="../resources/images/SomOn.png";
	}
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
		sombotao.addEventListener('ended', function(){ window.location = ("menu.html?audiotime="+audio.currentTime);});
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
	var table = document.getElementById("tabela");
	var tbody = document.createElement("tbody");
	var linha;
	var coluna;
	var texto;
	for(var j = 0; j < 10; j++) {
           linha=document.createElement("tr");
           for(var i = 0; i < 2; i++) {
               coluna = document.createElement("td");
               if (i == 0) {
                   	coluna.style.background = "#abb1b0";
                 	texto = document.createTextNode("Nome");
               }
               else
               	texto = document.createTextNode("Tempo");
               	coluna.appendChild(texto);
              	linha.appendChild(coluna);
               // set the cell background color
               // if the column is 0. If the column is 1 hide the cel
               
           }
           tbody.appendChild(linha);
    }
       tabela.appendChild(tbody);
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
