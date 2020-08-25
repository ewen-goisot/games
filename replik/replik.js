
var i, j, k;

// ns: [S]ize of the board
// nd: nb of [D]irections from a square
// nc: nb of [C]olors
// nh: [H]asrad = nb of random moves at beginning

var ns=3, nd=4, nc=2, nh=0, x=ns-1;
var n_s=3, n_d=4, n_c=2, n_h=0; // input: for the next game ("new game")
var ra, rb, rc, rd, re;
var a; // current board
var aa; // initial board
var b = [[0,1],[0,x],[1,0],[x,0],[x,1],[1,x],[1,1],[x,x]];
var coul = ['rgb(0,0,0)','rgb(0,255,255)','rgb(255,255,0)','rgb(255,0,255)','rgb(0,255,0)','rgb(0,0,255)','rgb(255,0,0)','rgb(255,255,255)']
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

function modi(c, d, e){
	for(i=0; i<nd; i++){
		for(j=0; j<nd; j++){
			if( (parseInt(i/2) != parseInt(j/2)) || i==j ){
				a[ (c+b[i][0])%ns ][ (d+b[i][1])%ns ][j]   =   (   a[ (c+b[i][0])%ns ][ (d+b[i][1])%ns ][j]   +   a[c][d][i]*e   ) % nc;
			}
		}
	}
	let l=done.length
	if(l>0 && done[l-1][0]==c && done[l-1][1]==d){
		if(done[l-1][2] + e == nc){
			done.pop();
			console.log('premier');
		}else{
			done[l-1][2] += e;
			done[l-1][2] %= nc;
			console.log('second');
		}
	}else{
		done.push([c,d,e]);
		if(l>=100){
			done.shift();
		}
		console.log('troisieme');
	}
	l=undone.length;
	if(ptf){
		if(l>0){
			if(c!=undone[l-1][0] || d!=undone[l-1][1]){
				undone = [];
			}else if(e==undone[l-1][2]){
				undone.pop();
			}else{
				undone[l-1][2] = (undone[l-1][2]+nc-e)%nc;
			}
		}
	}else{
		undone.push([c,d,nc-e]);
		if(l >= 100){
			undone.shift();
		}
	}
	return 'succes'
}

function init(){
	console.log("init")
	var i, j, k
	ns=parseInt(n_s); nd=parseInt(n_d); nc=parseInt(n_c); nh=parseInt(n_h);
	x=ns-1;
	//board_size_px = window.innerHeight;
	board_size_px = 600;
	c_grand = board_size_px/ns;
	c_petit = board_size_px/(6*ns);
	l_dizaine = board_size_px/(5*ns);
	l_unite = board_size_px/(9*ns);
	b_dizaine = (c_petit - l_dizaine) / 2;
	b_unite = (c_petit - l_unite) / 2;
	a=[];
	aa=[];
	b = [[0,1],[0,x],[1,0],[x,0],[x,1],[1,x],[1,1],[x,x]];
	for(i=0; i<ns; i++){
		a.push([]);
		for(j=0; j<ns; j++){
			a[i].push([]);
			for(k=0; k<nd; k++){
				a[i][j].push(1);
			}
		}
	}
	rc=-1; rd=-1
	for(i=0; i<nh; i++){
		ra = Math.floor(Math.random()*ns)
		rb = Math.floor(Math.random()*ns)
		re = Math.floor(Math.random()*(nc-1)+1)
		if(ra!=rc || rb!=rd){
			modi(ra, rb, re);
			rc=ra; rd=rb
		}else{
			i--
		}
	}
	done = []; // hide random moves
	for(i=0; i<ns; i++){
		aa.push([]);
		for(j=0; j<ns; j++){
			aa[i].push([]);
			for(k=0; k<nd; k++){
				aa[i][j].push(a[i][j][k]);
			}
		}
	}
}

function rein(){
	var i, j, k
	// re init
	for(i=0; i<ns; i++){
		for(j=0; j<ns; j++){
			for(k=0; k<nd; k++){
				a[i][j][k] = aa[i][j][k]
			}
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
		for(i=0; i<ns; i++){
			for(j=0; j<ns; j++){
				for(k=0; k<nd; k++){
					c_aux = a[i][j][k];
					ctx.fillStyle = coul[c_aux];
					ctx.beginPath();
					ctx.arc(c_grand*i + ((1+b[k][0])%ns*2+1)*c_petit, c_grand*j + ((1+b[k][1])%ns*2+1)*c_petit, l_unite,0,2*Math.PI);
					ctx.stroke();
					ctx.fill();
				}
			}
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
		case "c":
		case "7":
			modi(0,0,1);affi();
			break;
		case "m":
		case "8":
			modi(1,0,1);affi();
			break;
		case "l":
		case "9":
			modi(2,0,1);affi();
			break;
		case "t":
		case "4":
			modi(0,1,1);affi();
			break;
		case "s":
		case "5":
			modi(1,1,1);affi();
			break;
		case "n":
		case "6":
			modi(2,1,1);affi();
			break;
		case "d":
		case "1":
			modi(0,2,1);affi();
			break;
		case "v":
		case "2":
			modi(1,2,1);affi();
			break;
		case "j":
		case "3":
			modi(2,2,1);affi();
			break;
		default:
			return;
	}

	event.preventDefault();
}, true);

