
var i, j, k;

// n: [S]ize of the board
// nd: nb of [D]irections from a square
// nc: nb of [C]olors
// nh: [H]asrad = nb of random moves at beginning

var n=5, n_colors=4, n_level=0; // n: size, n_colors: couleurs de sphères, n_level: current level
var level_size = [5, 6, 7, 9, 11, 13, 16, 19];
var r; // records
var px=Math.floor(n/2), py=Math.floor(n/2); // player position
var px_recent=[px,px,px,px,px];
var py_recent=[py,py,py,py,py];
var pxy=0; // situation modulo 5
var ps=0, psp=0, pt=0, pc=0, pv=n*n*2; // score, score partie, time, cumul
var po=Math.floor(Math.pow(n,4.2));
var pm=[0,0,0,0]; // mémoire des 4 coups précédants
var score=[]; // liste des scores des parties jouées
var pk=1; // combo / levier
var a; // current board
var coul = ['#000','#fff','#f00','#0f0','#00f','#f0f','#0ff','#ff0','#333'];
var oeil_g = [[-0.52, -0.35], [0.35, -0.52], [0.52, 0.35], [-0.35, 0.52]];
var oeil_d = [[-0.52, 0.35], [-0.35, -0.52], [0.52, -0.35], [0.35, 0.52]];
var dir=1;
var done = [];
var undone = [];
var ptf = true; // past to future: "ceci n'est pas un undo"
var c_aux;
//var board_size_px = window.innerHeight;
var board_size_px = 600;
var c_grand = board_size_px/n;
var c_petit = board_size_px/(3*n);
var l_dizaine = board_size_px/(5*n);
var l_unite = board_size_px/(7*n);
var b_dizaine = (c_petit - l_dizaine) / 2;
var b_unite = (c_petit - l_unite) / 2;
//var initonced=false;

//init(); affi(); // TODO : organisation init vs next_run
// TODO les fonctions de la queue du serpent ne sont plus forcément nécessaires


function modi(c){ //{{{
	if (pv<0) {
		next_run();
		return;
	}
	let pmpt4 = pm[pt%4];
	//console.log(px);
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
	px+=n;
	py+=n;
	px %= n;
	py %= n;
	pxy++; pxy%=5;
	px_recent[pxy]=px;
	py_recent[pxy]=py;
	switch (a[px][py]) {
		case 0:
			pv-=4*pk;
			break;
		case 1:
			pc-=4*pk;
			pv-=1*pk;
			if (pc<-999) { pc=-999; }
			break;
		case 2:
			ps+=pc*pk;
			if (pc>999) { pc=999; }
			break;
		case 3:
			pc+=1*pk;
			if (pc>999) { pc=999; }
			break;
		case 6:
			pv-=1*pk;
			for(i=0; i<n; i++){
				for(j=0; j<n; j++){
					if (a[i][j]==4) {
						a[i][j]=pmpt4;
					}
				}
			}
			break;
		case 5:
			pv-=1*pk;
			for(i=0; i<n; i++){
				for(j=0; j<n; j++){
					if (a[i][j]==pmpt4) {
						a[i][j]=Math.floor(Math.random() * n_colors);
					}
				}
			}
			break;
		case 4:
			pk+=4;
			break;
		default:
			break;
	}
	pk--;
	if (pk==0) { pk=1; }
	if (pv<0) {
		next_run();
		return;
	}
	pt++;
	document.getElementById("current_state_0").innerHTML =
		"<span>Temps : "+pt+"</span>";
	document.getElementById("current_state_1").innerHTML =
		"<span>Cumul : "+pc+"</span>";
	document.getElementById("current_state_2").innerHTML =
		"<span>Score : "+ps+" / "+po+"</span>";
	document.getElementById("current_state_3").innerHTML =
		"<span>Vie : "+pv+"</span>";
	//document.getElementById("current_state_4").innerHTML =
	//"<span>Combo : "+pk+"</span>";
	pm[pt%4]=a[px][py];
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
		console.log("any init");
	a=[];
	for(i=0; i<n; i++){
		a.push([]);
		for(j=0; j<n; j++){
			a[i].push(0);
		}
	}
	a[px][py]=1;
	//let e=document.cookie;
	let e=localStorage.getItem("r")
	if(e==null || e=="null"){
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
	affi_score();
	console.log(r);
} //}}}

//function init_once(){ //{{{
	//if(!initonced){
		//console.log("first init");
		//init();
		//initonced=true;
	//}
//} //}}}

function next_run(){ //{{{
	psp+=ps;
	if (confirm("Score niveau : " + ps + "\nScore total : "+ psp +
		(ps>po  ? "\nNiveau suivant.\nContinuer?" : "\nPartie terminée.\nRecommencer ?"))) {
		if (n==level_size[0]) {
			for (i = 0; i < 3; i++) {
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
			n = level_size[n_level];
		} else {
			r[3][n_level] = ps;
			psp=0;
			n_level=0;
			n = level_size[0];
		}
		px=Math.floor(n/2); py=Math.floor(n/2);
		px_recent=[px,px,px,px,px];
		py_recent=[py,py,py,py,py];
		pxy=0;
		po=Math.floor(Math.pow(n, 4.2));
		ps=0;
		pt=0;
		pc=0;
		pv=n*n*2; // score, time, cumul
		c_grand = board_size_px/n;
		c_petit = board_size_px/(3*n);
		l_dizaine = board_size_px/(5*n);
		l_unite = board_size_px/(7*n);
		b_dizaine = (c_petit - l_dizaine) / 2;
		b_unite = (c_petit - l_unite) / 2;
		a=[]; // vider le plateau
		for(i=0; i<n; i++){
			a.push([]);
			for(j=0; j<n; j++){
				a[i].push(0);
			}
		}
		a[px][py]=1;
		affi_score();
		affi();
	} else {
		psp-=ps;
	}
	localStorage.setItem("r",JSON.stringify(r));
} //}}}

function affi(){ //{{{
	// TODO display only changed parts : a_diff
	var plat_canva = document.getElementById("plateau");
	if (plat_canva.getContext) {
		var ctx = plat_canva.getContext("2d");
		ctx.fillStyle = 'rgb(0,0,0)';
		ctx.fillRect(0,0,board_size_px,board_size_px);
		ctx.fillStyle = 'rgb(255,255,255)';
		// trace lignes, colonnes
		for(i=1; i<n; i++){
			ctx.fillRect(i*c_grand-6/n, 0, 12/n+1, board_size_px);
		}
		for(i=1; i<n; i++){
			ctx.fillRect(0, i*c_grand-6/n, board_size_px, 12/n+1);
		}
		//c_aux = 8; // drawing the snake's tail
		//ctx.fillStyle = coul[c_aux];
		//for (i = 0; i < 5; i++) {
			//if (i==pxy) {
				//continue;
			//}
			//ctx.beginPath();
			//ctx.arc(c_grand*px_recent[i] + c_petit*1.5, c_grand*py_recent[i] + c_petit*1.5, l_unite*2,0,2*Math.PI);
			//ctx.stroke();
			//ctx.fill();
		//}
		c_aux = 1;
		ctx.fillStyle = coul[c_aux];
		ctx.beginPath();
		ctx.arc(c_grand*px + c_petit*1.5, c_grand*py + c_petit*1.5, l_unite*2, 0, 2*Math.PI);
		ctx.stroke();
		ctx.fill();
		for(i=0; i<n; i++){
			for(j=0; j<n; j++){
				c_aux = a[i][j];
				ctx.fillStyle = coul[c_aux];
				ctx.beginPath();
				ctx.arc(c_grand*i + c_petit*1.5, c_grand*j + c_petit*1.5, l_unite, 0, 2*Math.PI);
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
			// yeux
		ctx.fillStyle = 'rgb(0,0,0)';
		ctx.beginPath();
		ctx.arc(c_grand*px + c_petit*(1.5+oeil_g[dir][0]), c_grand*py + c_petit*(1.5+oeil_g[dir][1]), l_unite*0.2, 0, 2*Math.PI);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc(c_grand*px + c_petit*(1.5+oeil_d[dir][0]), c_grand*py + c_petit*(1.5+oeil_d[dir][1]), l_unite*0.2, 0, 2*Math.PI);
		ctx.stroke();
		ctx.fill();
	}
} //}}}

function affi_score(){ //{{{
	for (i = 0; i < 6; i++) {
		for (j = 0; j < 9; j++) {
			document.getElementById("memo_scores").rows[i+1].cells[j+1].innerHTML = r[i][j];
		}
	}
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 9; j++) {
			if (r[i][j]>0 && r[i][j]==r[5][j]) {
				document.getElementById("memo_scores").rows[i+1].cells[j+1].style.color = "#ff0";
			} else if(r[i][j]>0){
				document.getElementById("memo_scores").rows[i+1].cells[j+1].style.color = "#fff";
			} else {
				document.getElementById("memo_scores").rows[i+1].cells[j+1].style.color = "#777";
			}
		}
	}
	for (j = 0; j < 9; j++) {
		if(r[5][j]>0){
			document.getElementById("memo_scores").rows[6].cells[j+1].style.color = "#fff";
		} else {
			document.getElementById("memo_scores").rows[6].cells[j+1].style.color = "#777";
		}
	}
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
	if(evt != undefined){
		evt.currentTarget.style.backgroundColor = "#d3d3d3";
	}
	if(bName != undefined){
		document.getElementById(bName).style.backgroundColor = "#d3d3d3";
	}
} //}}}
//function openTab(evt, tabName) { //{{{
	//var i, tabcontent, tablinks;
	//tabcontent = document.getElementsByClassName("tabcontent");
	//for (i = 0; i < tabcontent.length; i++) {
		//tabcontent[i].style.display = "none";
	//}
	//tablinks = document.getElementsByClassName("tablinks");
	//for (i = 0; i < tablinks.length; i++) {
		////tablinks[i].className = tablinks[i].className.replace(" active", "");
		//tablinks[i].style.backgroundColor = "#888888";
	//}
	//document.getElementById(tabName).style.display = "block";
	////evt.currentTarget.className += " active";
	//evt.currentTarget.style.backgroundColor = "#d3d3d3";
//} //}}}}

window.addEventListener('resize',()=>{affi()},false); // TODO is affi enough ?

window.addEventListener("keydown", function(event){ //{{{
	if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey){
		return;
	}

	// etusina or numpad
	switch (event.key) {
		//case "p":
			//openTab(undefined, "menu", "b_menu");
			//break;
		//case "r":
			//openTab(undefined, "regles", "b_regles");
			//break;
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

