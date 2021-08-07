
var i, j, k;

// ns: [S]ize of the board
// nd: nb of [D]irections from a square
// nc: nb of [C]olors
// nh: [H]asrad = nb of random moves at beginning

var ns=5, nd=4, nc=2, nh=0, x=ns-1;
var n_s=11, n_d=4, n_c=2, n_h=0; // input: for the next game ("new game")
var ra, rb, rc, rd, re;
var px=Math.floor(ns/2), py=Math.floor(ns/2); // player position
var ps=0, pt=0, pc=0, pv=ns*ns*2; // score, time, cumul
var a; // current board
var aa; // initial board
var b = [[0,1],[0,x],[1,0],[x,0],[x,1],[1,x],[1,1],[x,x]];
var coul = ['#000','#fff','#f00','#0f0','#00f','#ff0','#f0f','#0ff']
var done = [];
var undone = [];
var ptf = true; // past to future: "ceci n'est pas un undo"
var c_aux;
//var board_size_px = window.innerHeight;
var board_size_px = 600;
var c_grand = board_size_px/ns;
var c_petit = board_size_px/(3*ns);
var l_dizaine = board_size_px/(5*ns);
var l_unite = board_size_px/(7*ns);
var b_dizaine = (c_petit - l_dizaine) / 2;
var b_unite = (c_petit - l_unite) / 2;

function modi(c){
		console.log(px);
	switch (c) {
		case 0:
			px--;
			break;
		case 1:
			py--;
			break;
		case 2:
			px++;
			break;
		case 3:
			py++;
			break;
		default:
			return;
	}
	px+=ns;
	py+=ns;
	px %= ns;
	py %= ns;
	switch (a[px][py]) {
		case 0:
			pv-=4;
			break;
		case 1:
			pc-=4;
			pv-=1;
			if (pc<-999) { pc=-999; }
			break;
		case 2:
			ps+=1*pc;
			if (pc>999) { pc=999; }
			break;
		case 3:
			pc+=1;
			if (pc>999) { pc=999; }
			break;
		default:
			return;
	}
	if (pv<0) {
		alert("terminé");
	}
	pt++;
	document.getElementById("current_state_0").innerHTML =
		"<span>Temps : "+pt+"</span>";
	document.getElementById("current_state_1").innerHTML =
		"<span>Cumul : "+pc+"</span>";
	document.getElementById("current_state_2").innerHTML =
		"<span>Score : "+ps+"</span>";
	document.getElementById("current_state_3").innerHTML =
		"<span>Vie : "+pv+"</span>";
	a[px][py]=1;
	for (k = 0; k < 4; k++) {
		if (k==1) { continue; }
		i = Math.floor(Math.random() * ns);
		j = Math.floor(Math.random() * ns);
		a[i][j] = k;
	}

	return 'succes'
}

function init(){
	a=[];
	aa=[];
	for(i=0; i<ns; i++){
		a.push([]);
		aa.push([]);
		for(j=0; j<ns; j++){
			a[i].push(0);
			aa[i].push(0);
		}
	}
	a[px][py]=1;
	aa[px][py]=1;
}

function rein(){
	var i, j, k
	// re init
	for(i=0; i<ns; i++){
		for(j=0; j<ns; j++){
			a[i][j] = aa[i][j];
		}
	}
}

function affi(){
	// TODO display only changed parts
	var plat_canva = document.getElementById("plateau");
	if (plat_canva.getContext) {
		var ctx = plat_canva.getContext("2d");
		ctx.fillStyle = 'rgb(0,0,0)';
		ctx.fillRect(0,0,board_size_px,board_size_px);
		ctx.fillStyle = 'rgb(255,255,255)';
		for(i=1; i<ns; i++){
			ctx.fillRect(i*c_grand-6/ns, 0, 12/ns+1, board_size_px);
		}
		for(i=1; i<ns; i++){
			ctx.fillRect(0, i*c_grand-6/ns, board_size_px, 12/ns+1);
		}
		c_aux = 1;
		ctx.fillStyle = coul[c_aux];
		ctx.beginPath();
		ctx.arc(c_grand*px + c_petit*1.5, c_grand*py + c_petit*1.5, l_unite*2,0,2*Math.PI);
		ctx.stroke();
		ctx.fill();
		for(i=0; i<ns; i++){
			for(j=0; j<ns; j++){
					c_aux = a[i][j];
					ctx.fillStyle = coul[c_aux];
					ctx.beginPath();
					ctx.arc(c_grand*i + c_petit*1.5, c_grand*j + c_petit*1.5, l_unite,0,2*Math.PI);
					ctx.stroke();
					ctx.fill();
			}
		}
		if (a[px][py]==1) {
			c_aux = 1;
			ctx.fillStyle = coul[c_aux];
			ctx.beginPath();
			ctx.arc(c_grand*px + c_petit*1.5, c_grand*py + c_petit*1.5, l_unite*2,0,2*Math.PI);
			ctx.stroke();
			ctx.fill();
		}
	}
}

function openTab(evt, tabName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		//tablinks[i].className = tablinks[i].className.replace(" active", "");
		tablinks[i].style.backgroundColor = "#888888";
	}
	document.getElementById(tabName).style.display = "block";
	//evt.currentTarget.className += " active";
	evt.currentTarget.style.backgroundColor = "#d3d3d3";
}

window.addEventListener('resize',()=>{init();affi()},false);

window.addEventListener("keydown", function(event){
	if (event.defaultPrevented){
		return;
	}

	// etusina or numpad
	switch (event.key) {
		case "t":
		case "ArrowLeft":
			modi(0);affi();
			break;
		case "m":
		case "ArrowUp":
			modi(1);affi();
			break;
		case "n":
		case "ArrowRight":
			modi(2);affi();
			break;
		case "s":
		case "ArrowDown":
			modi(3);affi();
			break;
		default:
			return;
	}

	event.preventDefault();
}, true);

