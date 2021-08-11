
var i, j, k;

// ns: [S]ize of the board
// nd: nb of [D]irections from a square
// nc: nb of [C]olors
// nh: [H]asrad = nb of random moves at beginning

var ns=5, nc=4, nl=0; // ns: size, nc: couleurs, nl: level
var px=Math.floor(ns/2), py=Math.floor(ns/2); // player position
var ps=0, psp=0, pt=0, pc=0, pv=ns*ns*2; // score, score partie, time, cumul
var po=Math.floor(Math.pow(ns,4.2));
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
var c_grand = board_size_px/ns;
var c_petit = board_size_px/(3*ns);
var l_dizaine = board_size_px/(5*ns);
var l_unite = board_size_px/(7*ns);
var b_dizaine = (c_petit - l_dizaine) / 2;
var b_unite = (c_petit - l_unite) / 2;

function modi(c){ //{{{
	if (pv<0) {
		next_run();
		return;
	}
	let pmpt4 = pm[pt%4];
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
			return; // touche non reconnue = pas joué
	}
	px+=ns;
	py+=ns;
	px %= ns;
	py %= ns;
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
			for(i=0; i<ns; i++){
				for(j=0; j<ns; j++){
					if (a[i][j]==4) {
						a[i][j]=pmpt4;
					}
				}
			}
			break;
		case 5:
			pv-=1*pk;
			for(i=0; i<ns; i++){
				for(j=0; j<ns; j++){
					if (a[i][j]==pmpt4) {
						a[i][j]=Math.floor(Math.random() * nc);
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
	for (k = 0; k < nc; k++) {
		if (k==1) { continue; }
		if (k<=3 || Math.floor(Math.random()*2)) {
			i = Math.floor(Math.random() * ns);
			j = Math.floor(Math.random() * ns);
			a[i][j] = k;
		}
	}
	return 'succes'
} //}}}

function init(){
	a=[];
	for(i=0; i<ns; i++){
		a.push([]);
		for(j=0; j<ns; j++){
			a[i].push(0);
		}
	}
	a[px][py]=1;
}

function next_run(){ //{{{
	psp+=ps;
	if (confirm("Score niveau : " + ps + "\nScore total : "+ psp +
		(ps>po  ? "\nNiveau suivant.\nContinuer?" : "\nPartie terminée.\nRecommencer ?"))) {
		if (ns==5) {
			for (i = 0; i < 3; i++) {
				document.getElementById("p"+i+"_rn").innerHTML =
					document.getElementById("p"+(i+1)+"_rn").innerHTML;
				for (j = 5; j<25; j+=2) {
					document.getElementById("p"+i+"_"+j).innerHTML =
						document.getElementById("p"+(i+1)+"_"+j).innerHTML;
				}
			}
			for (j = 5; j<25; j+=2) {
				document.getElementById("p"+3+"_"+j).innerHTML = 0;
			}
		}
		document.getElementById("p3_rn").innerHTML = psp;
		let score_record= document.getElementById("pm_rn").innerHTML;
		if (psp>score_record) {
			document.getElementById("pm_rn").innerHTML = psp;
		}
		score_record= document.getElementById("pm_"+ns).innerHTML;
		if (ps>score_record) {
			document.getElementById("pm_"+ns).innerHTML = ps;
		}
		if (ps>po) {
			document.getElementById("p3_"+ns).innerHTML = ps;
			ns+=2;
		} else {
			document.getElementById("p3_"+ns).innerHTML = ps;
			psp=0;
			ns=5;
		}
		px=Math.floor(ns/2), py=Math.floor(ns/2);
		po=Math.floor(Math.pow(ns, 4.2));
		ps=0;
		pt=0;
		pc=0;
		pv=ns*ns*2; // score, time, cumul
		c_grand = board_size_px/ns;
		c_petit = board_size_px/(3*ns);
		l_dizaine = board_size_px/(5*ns);
		l_unite = board_size_px/(7*ns);
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
} //}}}

function openTab(evt, tabName) { //{{{
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
} //}}}}

window.addEventListener('resize',()=>{init();affi()},false);

window.addEventListener("keydown", function(event){ //{{{
	if (event.defaultPrevented){
		return;
	}

	// etusina or numpad
	switch (event.key) {
		//case "t":
		case "ArrowLeft":
			modi(0);affi();
			break;
		//case "m":
		case "ArrowUp":
			modi(1);affi();
			break;
		//case "n":
		case "ArrowRight":
			modi(2);affi();
			break;
		//case "s":
		case "ArrowDown":
			modi(3);affi();
			break;
		default:
			return;
	}

	event.preventDefault();
}, true); //}}}

