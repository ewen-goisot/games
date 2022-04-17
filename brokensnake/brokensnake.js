
var i, j, k;
const TAU=2*Math.PI

var n=5, n_colors=4, n_level=0; // n: size, n_colors: couleurs de sphères, n_level: current level
var level_size = [5, 6, 7, 9, 11, 13, 16, 19];
var r; // records
var px=Math.floor(n/2), py=Math.floor(n/2); // player position
var ps=0, psp=0, pt=0, pc=0, pv=n*n*2; // score, score partie, time, cumul
var po=Math.floor(Math.pow(n,4.2));
//var pk=1; // combo / levier
var a; // current board
var coul = ['#000','#fff','#f00','#0f0','#00f','#f0f','#0ff','#ff0','#333'];
var c_aux;
//var oeil_g = [[-0.35, -0.23],  [0.23, -0.35], [0.35,  0.23], [-0.23, 0.35]];
//var oeil_d = [[-0.35,  0.23], [-0.23, -0.35], [0.35, -0.23],  [0.23, 0.35]];
var yeux = [
	//  lx,    ly,    rx,    ry,    dpon dir
	[-0.35, -0.23, -0.35,  0.23],
	[ 0.23, -0.35, -0.23, -0.35],
	[ 0.35,  0.23,  0.35, -0.23],
	[-0.23,  0.35,  0.23,  0.35],
];

var dir=1;
//var board_size_px = window.innerHeight;
var board_size_px = 600;
var c_grand = board_size_px/n;
var c_petit = board_size_px/(2*n);
var l_unite = board_size_px/(7*n);

//init(); affi(); // TODO : organisation init vs next_run
// TODO les fonctions de la queue du serpent ne sont plus forcément nécessaires


function modi(c){ //{{{
	if (pv<0) {
		next_run();
		return;
	}
	switch (c) {
		case 0:
			px--; dir=0;
			break;
		case 1:
			py--; dir=1;
			break;
		case 2:
			px++; dir=2;
			break;
		case 3:
			py++; dir=3;
			break;
		default:
			return; // touche non reconnue = pas joué
	}
	px+=n; px%=n;
	py+=n; py%=n;
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
			ps+=pc;
			break;
		case 3:
			pc+=1;
			if (pc>999) { pc=999; }
			break;
		default:
			break;
	}
	if (pv<0) {
		next_run();
		return;
	}
	pt++;
	affi_etat();
	a[px][py]=1;
	for (k = 0; k < n_colors; k++) {
		if (k==1) { continue; }
		if (k<=3 || Math.floor(Math.random()*2)) {
			i = Math.floor(Math.random() * n);
			j = Math.floor(Math.random() * n);
			a[i][j] = k;
		}
	}
	return 'succes'
} //}}}

function init(){ //{{{
	//let e=document.cookie;
	let e=localStorage.getItem("r")
	if(e===null || e==="null"){
		r=[];
		for (i = 0; i < 6; i++) {
			r.push([]);
			for (j = 0; j < 9; j++) {
				r[i].push(0);
			}
		}
		for (j = 0; j < 8; j++) {
			r[4][j] = Math.floor(Math.pow(level_size[j], 4.2));
		}
		r[4][8]=436734;
		localStorage.setItem('r', JSON.stringify(r));
	} else {
		r=JSON.parse(e);
	}
	n_level=0; init_run();
	affi_etat();
	affi_score();
} //}}}

function init_run() { //{{{
	// for drawing and playing
	n = level_size[n_level];
	px=Math.floor(n/2); py=Math.floor(n/2);
	po=Math.floor(Math.pow(n, 4.2));
	pt=0; pc=0; ps=0;
	pv=n*n*2;
	c_grand = board_size_px/n;
	c_petit = board_size_px/(2*n);
	l_unite = board_size_px/(7*n);
	// make the board empty
	a=[];
	for(i=0; i<n; i++){
		a.push([]);
		for(j=0; j<n; j++){
			a[i].push(0);
		}
	}
	a[px][py]=1;
} //}}}

function next_run(){ //{{{
	psp+=ps;
	if (confirm("Score niveau : " + ps + "\nScore total : "+ psp +
		(ps>po  ? "\nNiveau suivant.\nContinuer?" : "\nPartie terminée.\nRecommencer ?"))) {
		if (n==level_size[0]) {
			for (i=0; i<3; i++) {
				for (j=0; j<9; j++) {
					r[i][j]=r[i+1][j];
				}
			}
			for (j=0; j<9; j++) {
				r[i][j]=0;
			}
		}
		r[3][8]=psp;
		let score_max= r[5][8];
		if (psp>score_max) {
			r[5][8] = psp;
		}
		score_max= r[5][n_level];
		if (ps>score_max) {
			r[5][n_level] = ps;
		}
		if (ps>po) {
			r[3][n_level] = ps;
			n_level++;
			if (n_level==8) { n_level=0; }
		} else {
			r[3][n_level] = ps;
			psp=0;
			n_level=0;
		}
		localStorage.setItem("r",JSON.stringify(r));
		n = level_size[n_level];
		init_run();
		affi_etat();
		affi_score();
		affi();
	} else {
		psp-=ps;
	}
} //}}}

function affi(){ //{{{
	// TODO display only changed parts : a_diff
	var plat_canva = document.getElementById("plateau");
	if (plat_canva.getContext) {
		var ctx = plat_canva.getContext("2d");
		ctx.fillStyle = '#000';
		ctx.fillRect(0,0,board_size_px,board_size_px);
		// trace lignes, colonnes
		ctx.fillStyle = '#fff';
		for(i=1; i<n; i++){
			ctx.fillRect(i*c_grand-6/n, 0, 12/n+1, board_size_px);
		}
		for(i=1; i<n; i++){
			ctx.fillRect(0, i*c_grand-6/n, board_size_px, 12/n+1);
		}
		// tete du personnage
		ctx.fillStyle = '#fff';
		ctx.beginPath();
		ctx.arc(c_grand*px + c_petit, c_grand*py + c_petit, l_unite*2, 0, TAU);
		ctx.stroke(); ctx.fill();
		// yeux
		ctx.fillStyle = '#000';
		for (i=0; i<2; i++) {
			ctx.beginPath();
			ctx.arc(c_grand*px + c_petit*(1+yeux[dir][2*i]), c_grand*py + c_petit*(1+yeux[dir][2*i+1]), l_unite*0.2, 0, TAU);
			ctx.stroke(); ctx.fill();
		}
		// autres cases
		for(i=0; i<n; i++){
			for(j=0; j<n; j++){
				c_aux = a[i][j];
				if (i==px && j==py && c_aux==1) { continue; }
				ctx.fillStyle = coul[c_aux];
				ctx.beginPath();
				ctx.arc(c_grand*i + c_petit, c_grand*j + c_petit, l_unite, 0, TAU);
				ctx.stroke(); ctx.fill();
			}
		}
	}
} //}}}

function affi_score(){ //{{{
	for (i=0; i<6; i++) {
		for (j=0; j<9; j++) {
			document.getElementById("memo_scores").rows[i+1].cells[j+1].innerHTML = r[i][j];
		}
	}
	for (i=0; i<4; i++) {
		for (j=0; j<9; j++) {
			document.getElementById("memo_scores").rows[i+1].cells[j+1].style.color =
				r[i][j]>0 ? r[i][j]==r[5][j] ? "#ff0" : "#fff" : "#777";
		}
	}
	{
		let i=5;
		for (j=0; j<9; j++) {
			document.getElementById("memo_scores").rows[i+1].cells[j+1].style.color =
				r[5][j]>0 ? "#fff" : "#777";
		}
	}
} //}}}

function affi_etat() { //{{{
	document.getElementById("current_state_0").innerHTML = "<span>Temps : "+pt+"</span>";
	document.getElementById("current_state_1").innerHTML = "<span>Cumul : "+pc+"</span>";
	document.getElementById("current_state_2").innerHTML = "<span>Score : "+ps+" / "+po+"</span>";
	document.getElementById("current_state_3").innerHTML = "<span>Vie : "+pv+"</span>";
} //}}}

function openTab(evt, tabName, bName) { //{{{

	//mode_analyse = (tabName == "analyse");
	mode = tabName;
	var i, tabcontent, tablink;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablink = document.getElementsByClassName("tablink");
	for (i = 0; i < tablink.length; i++) {
		//tablink[i].className = tablink[i].className.replace(" active", "");
		tablink[i].style.backgroundColor = "#888888";
	}
	document.getElementById(tabName).style.display = "block";
	//evt.currentTarget.className += " active";
	if(evt !== undefined){
		evt.currentTarget.style.backgroundColor = "#d3d3d3";
	}
	if(bName !== undefined){
		document.getElementById(bName).style.backgroundColor = "#d3d3d3";
	}
} //}}}

window.addEventListener('resize',()=>{affi()},false); // TODO is affi enough ?

window.addEventListener("keydown", function(event){ //{{{
	if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey){
		return;
	}

	// etusina or numpad
	switch (event.key) {
		case "(":
			openTab(undefined, "regles", "b_regles");
			break;
		case ")":
			openTab(undefined, "menu", "b_menu");
			break;
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
}, true); //}}}

