
// for loops TODO only local var for that
var i, j, k, found;

// ns: [S]ize of the board
// nd: nb of [D]irections from a square
// nc: nb of [C]olors
// nh: [H]asrad = nb of random moves at beginning

var ns=5, nl=4; // board size, log board size
var n_s=5, n_l=4; // changed with buttons
var n_c, n_d, n_h;
var ra, rb, rc, rd, re;
var a; // current board
var aa; // initial board
var b = [0,1,2,3,5,8,13];
var done = [];
var undone = [];
var ptf = true; // past to future: "ceci n'est pas un undo"
var c_aux;
//var board_size_px = window.innerHeight;
var board_size_px = 600;
var first_size = true;
var play_for_other = false;
var temps = 3;
var c_aux, d_aux, e_aux;
var c_grand = board_size_px/ns;
var c_petit = board_size_px/(3*ns);
var l_dizaine = board_size_px/(5*ns);
var l_unite = board_size_px/(8*ns);
var l_petit = board_size_px/(13*ns);
var b_dizaine = (c_petit - l_dizaine) / 2;
var b_unite = (c_petit - l_unite) / 2;
var c_marge = 12/ns + 1; // fibo again
var possible; // first square choosen
var possible_first=[]; // where can first square be
var fini_memo=2;
var score = [0,0,0,0];

// player do something... usually need two clicks
function modi(c,d,e){
	// partie terminée
	if(fini_memo!=2){
		return;
	}
	var i, j, k;
	var joueur = temps%4>1 ? 0:1;
	// right click: first=play_for_other second=cancel
	if(e==2){
		if(first_size){
			joueur = 1-joueur;
			play_for_other = true;
		}else{
			first_size = true;
			play_for_other = false;
			possible=[];
			return;
		}
	}else if(play_for_other && !first_size){
		joueur = 1-joueur;
		play_for_other = false;
	}
	// record first square choice
	if(first_size){
		//console.log("first");
		//if left click?
		if(true){
			c_aux=c; d_aux=d; first_size = false;
			// show all second moves
			possible=[];
			if(rule(c,d,c,d,joueur)){
				possible.push([c,d]);
			}
			for(i=2; i<7; i++){
				//console.log("check: "+i);
				if(rule(c, d, c, d+b[i]-1, joueur)){
					possible.push([c, d+b[i]-1]);
				}
				if(rule(c, d, c, d-b[i]+1, joueur)){
					possible.push([c, d-b[i]+1]);
				}
				if(rule(c, d, c+b[i]-1, d, joueur)){
					possible.push([c+b[i]-1, d]);
				}
				if(rule(c, d, c-b[i]+1, d, joueur)){
					possible.push([c-b[i]+1, d]);
				}
			}
			if(possible.length==0){
				first_size = true;
				lfin();
			}else if(possible.length==1){
				modi(possible[0][0],possible[0][1],1);
			}
			//console.log("possibilite"); affi();
		}else{
			// mid_auxle click: put seed here, if empty
			if(rule(c,d,c,d,joueur)){ temps++; first_size = true;
				a[c][d] = [joueur,c,1,0]; affi();
				possible_first=[];
			}
		}

	}else{
		//console.log("second");
		possible=[];
		//if(c==c_aux && d==d_aux){
		//first_size = true; modi(c,d,0);
		//}else if(c!=c_aux && d!=d_aux){
		//first_size = true;
		//}
		if(rule(c,d,c_aux,d_aux,joueur)){
			// TODO function to add or remove an individual card (for ctrlz)
			//console.log("second_regle");
			if(c==c_aux){ temps++; first_size = true;
				//console.log("second_c_aux c:"+c+" d:"+d+" c_aux:"+c_aux+" d_aux:"+d_aux);
				h = [joueur,Math.min(d,d_aux),b.indexOf(Math.abs(d-d_aux)+1),1];
				for(j=Math.min(d,d_aux); j<=Math.max(d,d_aux); j++){
					for(k=0; k<4; k++){
						a[c][j][k] = 0;
					}
					// warning: pointer, changing one will change all: actually helpfull for deletion
					a[c][j] = h;
				}
				possible_first=[];
				//affi();
			}else{ temps++; first_size = true;
				//console.log("second_d_aux c:"+c+" d:"+d+" c_aux:"+c_aux+" d_aux:"+d_aux);
				h = [joueur,Math.min(c,c_aux),b.indexOf(Math.abs(c-c_aux)+1),0];
				for(i=Math.min(c,c_aux); i<=Math.max(c,c_aux); i++){
					for(k=0; k<4; k++){
						a[i][d][k] = 0;
					}
					a[i][d] = h;
				}
				possible_first=[];
				//affi();
				//a[Math.min(c,c_aux)][d] = [joueur,Math.min(c,c_aux),b.indexOf(Math.abs(c-c_aux)+1),0]; affi();
			}
			//joueur = temps%4>1 ? 0:1;
			if(fini(joueur) && fini(1-joueur)){
				fini_memo=3;
				//score=[0,0,0,0];
				//for(i=0; i<ns; i++){
					//for(j=0; j<ns; j++){
						//if(a[i][j][2]!=0){
							//score[a[i][j][0]]++;
						//}
					//}
				//}
				//score[joueur] -= 0.5;
				//fini_memo = score[0]>score[1]?0:1;
				////alert(["Jaune","Bleu"][fini_memo]+" gagne !      Jaune: "+score[0]+"      Bleu: "+score[1]);
			}

			//possible = [];
		}else{
			first_size = true;
			modi(c,d,1);
		}
		document.getElementById("current_state_0").innerHTML = "Tour:"+(temps-2)+"&nbsp;&nbsp;&nbsp;"+(temps%4>1 ? "Jaune:":"Bleu :")+(temps%2+1);
		score=[0,0,0,0];
		for(i=0; i<ns; i++){
			for(j=0; j<ns; j++){
				if(a[i][j][2]!=0){
					score[a[i][j][0]]++;
					if(a[i][j][2]==1){
						score[a[i][j][0]+2]++;
					}
				}
			}
		}
		if(fini_memo!=2){
			joueur = temps%4>1 ? 0:1;
			score[joueur] -= 0.5;
			fini_memo = score[0]>score[1]?0:1;
		}
		document.getElementById("current_state_1").innerHTML = "Jaune:"+score[0]+"&nbsp;&nbsp;&nbsp;Graines:"+score[2];
		document.getElementById("current_state_2").innerHTML = "Bleu :"+score[1]+"&nbsp;&nbsp;&nbsp;Graines:"+score[3];
	}
}

// if players can't play, it's end of game
function fini(joueur){
	if(fini_memo<2){
		return true;
	}
	var i, j, k;
	for(i=0; i<ns; i++){
		for(j=0; j<ns; j++){
			if(rule(i,j,i,j,joueur)){
				return false;
			}
			for(k=2; k<7; k++){
				//console.log("check: "+k);
				if(rule(i, j, i, j+b[k]-1, joueur)){
					return false;
				}
				if(rule(i, j, i, j-b[k]+1, joueur)){
					return false;
				}
				if(rule(i, j, i+b[k]-1, j, joueur)){
					return false;
				}
				if(rule(i, j, i-b[k]+1, j, joueur)){
					return false;
				}
			}
		}
	}
	return true;
}


function lfin(){
	possible_first=[];
	if(fini_memo<2){
		return;
	}
	var i, j, k;
	for(i=0; i<ns; i++){
		for(j=0; j<ns; j++){
			if(rule(i,j,i,j,0) || rule(i,j,i,j,1)){
				possible_first.push([i,j]);
				continue;
			}
			for(k=2; k<7; k++){
				//console.log("check: "+k);
				if(rule(i, j, i, j+b[k]-1, 0) || rule(i, j, i, j+b[k]-1, 1)){
					possible_first.push([i,j]);
					break;
				}
				if(rule(i, j, i, j-b[k]+1, 0) || rule(i, j, i, j-b[k]+1, 1)){
					possible_first.push([i,j]);
					break;
				}
				if(rule(i, j, i+b[k]-1, j, 0) || rule(i, j, i+b[k]-1, j, 1)){
					possible_first.push([i,j]);
					break;
				}
				if(rule(i, j, i-b[k]+1, j, 0) || rule(i, j, i-b[k]+1, j, 1)){
					possible_first.push([i,j]);
					break;
				}
			}
		}
	}
}

function rule(c,d,cc,dd,joueur){
	//console.log("rule c"+c+" d"+d+" cc"+cc+" dd"+dd);
	// assume c<cc and d<dd
	if(c>cc){
		[c,cc]=[cc,c]
	}
	if(d>dd){
		[d,dd]=[dd,d]
	}
	// can occur if cc and dd are auto-generated (line out of board)
	if(c<0 || d<0 || cc>=ns || dd>=ns){
		//console.log("out");
		return false;
	}
	// can occur on player's wrong click (different line and column)
	if(c!=cc && d!=dd){
		return false;
	}

	// put a seed, on one square only
	if(c==cc && d==dd){
		return a[c][d][2]==0
			&& (c==0    || a[c-1][d][0]!=joueur || a[c-1][d][2]!=1)
			&& (d==0    || a[c][d-1][0]!=joueur || a[c][d-1][2]!=1)
			&& (c==ns-1 || a[c+1][d][0]!=joueur || a[c+1][d][2]!=1)
			&& (d==ns-1 || a[c][d+1][0]!=joueur || a[c][d+1][2]!=1);

	}else if(c==cc){
		// carte verticale
		var taille_carte = b.indexOf(dd-d+1)
		var graine=0;
		if(taille_carte == -1){
			return false;
		}

		// diversité: ne touche pas de carte de même taille et couleur
		for(j=d; j<=dd; j++){
			if(a[(c+ns)%(ns+1)][j][0] == joueur && a[(c+ns)%(ns+1)][j][2] == taille_carte){
				return false;
			}
			if(a[c+1][j][0] == joueur && a[c+1][j][2] == taille_carte){
				return false;
			}
		}
		// diversité, bords
		if(a[c][(d+ns)%(ns+1)][0] == joueur && a[c][(d+ns)%(ns+1)][2] == taille_carte){
			return false;
		}
		if(a[c][dd+1][0] == joueur && a[c][dd+1][2] == taille_carte){
			return false;
		}

		// remplacement, est posée uniquement sur des cartes plus petites
		for(j=d; j<=dd; j++){
			if(a[c][j][2] >= taille_carte){
				return false;
			}
		}

		// plantation assez de graines
		for(j=d; j<=dd; j++){
			if(a[(c+ns)%(ns+1)][j][0] == joueur && a[(c+ns)%(ns+1)][j][2] == 1){
				graine++;
			}
			if(a[c+1][j][0] == joueur && a[c+1][j][2] == 1){
				graine++;
			}
		}
		// plantation, bords
		if(a[c][(d+ns)%(ns+1)][0] == joueur && a[c][(d+ns)%(ns+1)][2] == 1){
			graine++;
		}
		if(a[c][dd+1][0] == joueur && a[c][dd+1][2] == 1){
			graine++;
		}
		if(graine + 1 < taille_carte){
			return false;
		}

	}else{
		var taille_carte = b.indexOf(cc-c+1)
		var graine=0;
		if(taille_carte == -1){
			return false;
		}

		// diversité
		for(i=c; i<=cc; i++){
			if(a[i][(d+ns)%(ns+1)][0] == joueur && a[i][(d+ns)%(ns+1)][2] == taille_carte){
				return false;
			}
			if(a[i][d+1][0] == joueur && a[i][d+1][2] == taille_carte){
				return false;
			}
		}
		// diversité, bords
		if(a[(c+ns)%(ns+1)][d][0] == joueur && a[(c+ns)%(ns+1)][d][2] == taille_carte){
			return false;
		}
		if(a[cc+1][d][0] == joueur && a[cc+1][d][2] == taille_carte){
			return false;
		}

		// remplacement
		for(i=c; i<=cc; i++){
			if(a[i][d][2] >= taille_carte){
				return false;
			}
		}

		// plantation
		for(i=c; i<=cc; i++){
			if(a[i][(d+ns)%(ns+1)][0] == joueur && a[i][(d+ns)%(ns+1)][2] == 1){
				graine++;
			}
			if(a[i][d+1][0] == joueur && a[i][d+1][2] == 1){
				graine++;
			}
		}
		// plantation, bords
		if(a[(c+ns)%(ns+1)][d][0] == joueur && a[(c+ns)%(ns+1)][d][2] == 1){
			graine++;
		}
		if(a[cc+1][d][0] == joueur && a[cc+1][d][2] == 1){
			graine++;
		}
		if(graine + 1 < taille_carte){
			return false;
		}
	}
	//console.log("rule true");
	return true;
}

function init(){
	//console.log("init")
	ns=parseInt(n_s); nd=parseInt(n_d); nc=parseInt(n_c); nh=parseInt(n_h);
	temps=3;
	fini_memo=2;
	possible=[];
	//board_size_px = window.innerHeight;
	board_size_px = 600;
	c_grand = board_size_px/ns;
	c_petit = board_size_px/(6*ns);
	c_marge = 12/ns + 1;
	l_dizaine = board_size_px/(5*ns);
	l_unite = board_size_px/(8*ns);
	l_petit = board_size_px/(13*ns);
	b_dizaine = (c_petit - l_dizaine) / 2;
	b_unite = (c_petit - l_unite) / 2;
	a=[];
	aa=[];
	b = [0,1,2,3,5,8,13];
	// trick: one more to avoid SOME out_of_board tests
	for(i=0; i<=ns; i++){
		a.push([]);
		for(j=0; j<=ns; j++){
			//a[i].push([0,i,0,0]);
			a[i].push([0,0,0,0]);
		}
	}
	document.getElementById("current_state_0").innerHTML = "Tour:1&nbsp;&nbsp;&nbsp;Jaune:1";
	document.getElementById("current_state_1").innerHTML = "Jaune:0&nbsp;&nbsp;&nbsp;Graines:0";
	document.getElementById("current_state_2").innerHTML = "Bleu :0&nbsp;&nbsp;&nbsp;Graines:0";
	//a[1][2][0]=2;
	//a[2][2][0]=2;
	//a[3][2][0]=2;

	//a[1][0]=[1,0,5,1];
	//a[3][4]=[1,3,4,0];
	//a[3][6]=[0,3,4,0];
	//a[2][2]=[0,2,3,1];
	//a[7][7]=[1,7,1,1];
	//a[3][5]=[0,3,2,0];
	//a[5][5]=[0,5,1,0];
	//a[6][5]=[0,6,2,0];
}

function affi(){
	// TODO display only changed parts
	var i, j, k;
	var plat_canva = document.getElementById("plateau");
	if (plat_canva.getContext) {
		var ctx = plat_canva.getContext("2d");
		var i_v, i_h;
		ctx.fillStyle = '#000';
		ctx.fillRect(0,0,board_size_px,board_size_px);
		if(possible.length>0){
			possible_first=[];
			ctx.fillStyle = '#f00';
			for(i in possible){
				ctx.fillRect(c_grand*possible[i][0], c_grand*possible[i][1], c_grand, c_grand);
			}
		}else if(possible_first.length>0){
			ctx.fillStyle = '#600';
			for(i in possible_first){
				ctx.fillRect(c_grand*possible_first[i][0], c_grand*possible_first[i][1], c_grand, c_grand);
			}
		}
		//ctx.fillStyle = '#fff';
		ctx.fillStyle = ['#fe0','#07f','#fff'][fini_memo]
		//ctx.fillStyle = ['#fe7','#7bf'][temps%4>1 ? 0:1]
		for(i=1; i<ns; i++){
			ctx.fillRect(i*c_grand-6/ns, 0, c_marge, board_size_px);
		}
		for(i=1; i<ns; i++){
			ctx.fillRect(0, i*c_grand-6/ns, board_size_px, c_marge);
		}
		ctx.fillStyle = ['#fe0','#07f'][temps%4>1 ? 0:1]
		ctx.fillRect(0, 0, c_marge, board_size_px);
		ctx.fillRect(0, 0, board_size_px, c_marge);
		ctx.fillRect(board_size_px-c_marge, 0, c_marge, board_size_px);
		ctx.fillRect(0, board_size_px-c_marge, board_size_px, c_marge);
		for(i=0; i<ns; i++){
			for(j=0; j<ns; j++){
				h=a[i][j];
				// content and begin
				if(h[2]>0 && h[1] == [i,j][h[3]]){
					ctx.fillStyle = ['#fe0','#07f'][h[0]];
					/*if(h[3]==0){{{{
						ctx.fillRect(i*c_grand, j*c_grand, c_grand*h[2], c_grand);
						ctx.fillStyle = '#000';
						if(h[1]>1){
							ctx.fillRect(c_grand*(i+1/2), c_grand*(j+1/2) - l_petit/2, c_grand*(h[2]-1), l_petit);
							ctx.beginPath();
							ctx.arc(c_grand*(i+h[2]-1/2), c_grand*(j+1/2), l_dizaine, 0, 2*Math.PI);
							ctx.stroke();
						}else{ctx.beginPath();}
						ctx.arc(c_grand*(i+1/2), c_grand*(j+1/2), l_dizaine, 0, 2*Math.PI);
						ctx.fill();
					}else{
						ctx.fillRect(i*c_grand, j*c_grand, c_grand, c_grand*h[2]);
						ctx.fillStyle = '#000';
						ctx.beginPath();
						ctx.arc(c_grand*(i+1/2), c_grand*(j+1/2), l_dizaine, 0, 2*Math.PI);
						ctx.stroke();
						ctx.arc(c_grand*(i+1/2), c_grand*(j+h[2]-1/2), l_dizaine, 0, 2*Math.PI);
						ctx.fill();
						ctx.fillRect(c_grand*(i+1/2) - l_petit/2, c_grand*(j+1/2), l_petit, c_grand*(h[2]-1));
					}*///}}}
					i_h=h[3]; i_v=1-i_h;
					ctx.beginPath();
					ctx.arc(c_grand*(i+1/2), c_grand*(j+1/2), c_grand/2 - 2*c_marge, Math.PI/2*(1+i_h), Math.PI/2*(3+i_h));
					ctx.arc(c_grand*(i+(b[h[2]]-1)*(1-i_h)+1/2), c_grand*(j+(b[h[2]]-1)*(1-i_v)+1/2), c_grand/2 - 2*c_marge, Math.PI/2*(3+i_h), Math.PI/2*(5+i_h));
					ctx.lineTo(c_grand*(i+(1-i_h)/2) + 2*c_marge*i_h, c_grand*(j+1-i_h/2) - 2*c_marge*i_v);
					ctx.stroke();
					ctx.fill();
					//ctx.fillRect(i*c_grand, j*c_grand, c_grand*(h[2]*i_v+i_h), c_grand*(h[2]*i_h+i_v));
					ctx.fillStyle = '#000';
					if(h[2]>1){
						ctx.fillRect(c_grand*(i+1/2) - l_petit/2*i_h, c_grand*(j+1/2) - l_petit/2*i_v, c_grand*(b[h[2]]-1)*i_v + l_petit*i_h, c_grand*(b[h[2]]-1)*i_h + l_petit*i_v);
						ctx.beginPath();
						ctx.arc(c_grand*(i+1/2+(b[h[2]]-1)*i_v), c_grand*(j+1/2+(b[h[2]]-1)*i_h), [l_dizaine,l_unite][h[2]%2], 0, 2*Math.PI);
						ctx.stroke();
					}else{ctx.beginPath();}
					ctx.arc(c_grand*(i+1/2), c_grand*(j+1/2), [l_dizaine,l_unite][h[2]%2], 0, 2*Math.PI);
					ctx.fill();

				}
				//c_aux = a[i][j][k];
				//ctx.fillStyle = coul[c_aux];
				//ctx.beginPath();
				//ctx.arc(c_grand*i + ((1+b[k][0])%ns*2+1)*c_petit, c_grand*j + ((1+b[k][1])%ns*2+1)*c_petit, l_unite,0,2*Math.PI);
				//ctx.stroke();
				//ctx.fill();
			}
		}
	}
}

function info(){
	if(fini_memo!=2){
		setTimeout(function() {
			alert(["Jaune","Bleu"][fini_memo]+" gagne !      Jaune: "+score[0]+"      Bleu: "+score[1]);
		},180)
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

//window.addEventListener('resize',()=>{init();affi()},false);
//exact value, remove right click on board only
document.addEventListener('contextmenu', event => {if(event.clientX < 610 && event.clientY < 610){ event.preventDefault(); }});

window.addEventListener("keydown", function(event){
	if (event.defaultPrevented){
		return;
	}

	// etusina or numpad
	// TODO change: this is for Replik, not Potager
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

