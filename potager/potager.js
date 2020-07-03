
// for loops
var i, j, k, found;

// ns: [S]ize of the board
// nd: nb of [D]irections from a square
// nc: nb of [C]olors
// nh: [H]asrad = nb of random moves at beginning

var ns=5, nd=4, nc=2, nh=0, x=ns-1;
var n_s=5, n_d=4, n_c=2, n_h=0; // input: for the next game ("new game")
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

// player do something... usually need two clicks
function modi(c,d,e){
	var joueur = temps%4>1 ? 0:1;
	// record first square choice
	if(first_size){
		console.log("first");
		if(e){
			c_aux=c; d_aux=d; first_size = false;
		}else if(a[c][d][2] == 0){
			// mid_auxle click: put seed here, if empty
			if(rule(c,d,c,d,joueur)){ temps++; first_size = true;
				a[c][d] = [joueur,c,1,0]; affi();
			}
		}
	}else{
		console.log("second");
		//if(c==c_aux && d==d_aux){
		//first_size = true; modi(c,d,false);
		//}else if(c!=c_aux && d!=d_aux){
		//first_size = true;
		//}
		if(rule(c,d,c_aux,d_aux,joueur)){
			// TODO function to add or remove an individual card (for ctrlz)
			console.log("second_regle");
			if(c==c_aux){ temps++; first_size = true;
				console.log("second_c_aux c:"+c+" d:"+d+" c_aux:"+c_aux+" d_aux:"+d_aux);
				h = [joueur,Math.min(d,d_aux),b.indexOf(Math.abs(d-d_aux)+1),1];
				for(j=Math.min(d,d_aux); j<=Math.max(d,d_aux); j++){
					for(k=0; k<4; k++){
						a[c][j][k] = 0;
					}
					// warning: pointer, changing one will change all: actually helpfull for deletion
					a[c][j] = h;
				}
				affi();
			}else{ temps++; first_size = true;
				console.log("second_d_aux c:"+c+" d:"+d+" c_aux:"+c_aux+" d_aux:"+d_aux);
				h = [joueur,Math.min(c,c_aux),b.indexOf(Math.abs(c-c_aux)+1),0];
				for(i=Math.min(c,c_aux); i<=Math.max(c,c_aux); i++){
					for(k=0; k<4; k++){
						a[i][d][k] = 0;
					}
					a[i][d] = h;
				}
				affi();
				//a[Math.min(c,c_aux)][d] = [joueur,Math.min(c,c_aux),b.indexOf(Math.abs(c-c_aux)+1),0]; affi();
			}
		}
		first_size = true;
	}
}

function rule(c,d,cc,dd,joueur){
	// assume c<cc and d<dd
	if(c>cc){
		[c,cc]=[cc,c]
	}
	if(d>dd){
		[d,dd]=[dd,d]
	}
	// can occur if cc and dd are auto-generated (line out of board)
	if(cc<0 || dd<0 || cc>=ns || dd>=ns){
		return false;
	}
	// can occur on player's wrong click (different line and column)
	if(c!=cc && d!=dd){
		return false;
	}

	// put a seed, on one square only
	if(c==cc && d==dd){
		return (c==0    || a[c-1][d][0]!=joueur || a[c-1][d][2]!=1)
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
	return true;
}

function init(){
	console.log("init")
	ns=parseInt(n_s); nd=parseInt(n_d); nc=parseInt(n_c); nh=parseInt(n_h);
	x=ns-1;
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
	var plat_canva = document.getElementById("plateau");
	if (plat_canva.getContext) {
		var ctx = plat_canva.getContext("2d");
		var i_v, i_h;
		ctx.fillStyle = '#000';
		ctx.fillRect(0,0,board_size_px,board_size_px);
		ctx.fillStyle = '#fff';
		for(i=1; i<ns; i++){
			ctx.fillRect(i*c_grand-6/ns, 0, c_marge, board_size_px);
		}
		for(i=1; i<ns; i++){
			ctx.fillRect(0, i*c_grand-6/ns, board_size_px, c_marge);
		}
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

function openTab(evt, tabName) {
	tabcontent, tablinks;
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
