
var i, j, k;

// n: [S]ize of the board
// nd: nb of [D]irections from a square
// nc: nb of [C]olors
// nh: [H]asrad = nb of random moves at beginning

var n=5, n_colors=4, n_level=0; // n: size, n_colors: couleurs de sphères, n_level: current level
var level_size = [5, 6, 7, 9, 11, 13, 16, 19];
var px=Math.floor(n/2), py=Math.floor(n/2); // player position
var ps=0, psp=0, pt=0, pc=0, pv=n*n*2; // score, score partie, time, cumul
var po=Math.floor(Math.pow(n,4.2));
var pm=[0,0,0,0]; // mémoire des 4 coups précédants
var score=[]; // liste des scores des parties jouées
var pk=1; // combo / levier
var a; // current board
var coul = ['#000','#fff','#f00','#0f0','#00f','#f0f','#0ff','#ff0'];
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

function modi(c){ //{{{
	if (pv<0) {
		next_run();
		return;
	}
	let pmpt4 = pm[pt%4];
	//console.log(px);
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
			return; // touche non reconnue = pas joué
	}
	px+=n;
	py+=n;
	px %= n;
	py %= n;
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
			for (i = 0; i < 3; i++) {
				document.getElementById("p"+i+"_rn").innerHTML =
					document.getElementById("p"+(i+1)+"_rn").innerHTML;
				for (j=0; j<8; j++) {
					document.getElementById("p"+i+"_"+level_size[j]).innerHTML =
						document.getElementById("p"+(i+1)+"_"+level_size[j]).innerHTML;
				}
			}
			for (j=0; j<8; j++) {
				document.getElementById("p"+3+"_"+level_size[j]).innerHTML = 0;
			}
		}
		document.getElementById("p3_rn").innerHTML = psp;
		let score_record= document.getElementById("pm_rn").innerHTML;
		if (psp>score_record) {
			document.getElementById("pm_rn").innerHTML = psp;
		}
		score_record= document.getElementById("pm_"+n).innerHTML;
		if (ps>score_record) {
			document.getElementById("pm_"+n).innerHTML = ps;
		}
		if (ps>po) {
			document.getElementById("p3_"+n).innerHTML = ps;
			n_level++;
			if (n_level==8) { n_level=0; }
			n = level_size[n_level];
		} else {
			document.getElementById("p3_"+n).innerHTML = ps;
			psp=0;
			n_level=0;
			n = level_size[0];
		}
		px=Math.floor(n/2), py=Math.floor(n/2);
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
		init();
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
		ctx.fillStyle = 'rgb(0,0,0)';
		ctx.fillRect(0,0,board_size_px,board_size_px);
		ctx.fillStyle = 'rgb(255,255,255)';
		for(i=1; i<n; i++){
			ctx.fillRect(i*c_grand-6/n, 0, 12/n+1, board_size_px);
		}
		for(i=1; i<n; i++){
			ctx.fillRect(0, i*c_grand-6/n, board_size_px, 12/n+1);
		}
		c_aux = 1;
		ctx.fillStyle = coul[c_aux];
		ctx.beginPath();
		ctx.arc(c_grand*px + c_petit*1.5, c_grand*py + c_petit*1.5, l_unite*2,0,2*Math.PI);
		ctx.stroke();
		ctx.fill();
		for(i=0; i<n; i++){
			for(j=0; j<n; j++){
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

window.addEventListener('resize',()=>{affi()},false);

window.addEventListener("keydown", function(event){ //{{{
	if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey){
		return;
	}

	// etusina or numpad
	switch (event.key) {
		case "p":
			openTab(undefined, "menu", "b_menu");
			break;
		case "r":
			openTab(undefined, "regles", "b_regles");
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

