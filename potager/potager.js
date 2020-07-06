
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
var b = [0,1,2,3,5,8,13]; // card sizes
var done = [];
var undone = [];
var ptf = true; // past to future: "ceci n'est pas un undo"
var c_aux;
//var board_size_px = window.innerHeight;
var board_size_px = 600;
var first_size = true;
var play_for_other = false;
var temps = 3;
var temps_fin = 0; // tour de la victoire, pour l'analyse
var video_interval; // pour les intervalles
var video_active = false; // pour les intervalles
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
var mode = "default"; // kb shortcut for undo/redo
// confirm: does not autocomplete
const url = window.location.search;
const url_confirm = RegExp(".(.*&)?confirm(&.*)?");
const player_profile_confirm = url_confirm.test(url);
const url_facebook = RegExp(".(.*&)?fbclid(&.*)?");

if(url_facebook.test(url)){
	console.log("attention aux fbclid: vous avez ouvert ce lien depuis Facebook, qui me l'a dit. Faites-vous respecter.");
}

// player do something... usually need two clicks
function modi(c,d,e){
	// partie terminée
	if(fini_memo!=2 && temps == temps_fin){
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
			}else if(possible.length==1 && !player_profile_confirm){
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
			if(c==c_aux){
				//console.log("second_c_aux c:"+c+" d:"+d+" c_aux:"+c_aux+" d_aux:"+d_aux);
				h = [joueur,Math.min(d,d_aux),b.indexOf(Math.abs(d-d_aux)+1),1];
				done[temps-3] = [[...h,c,h[1],1]];
				for(j=Math.min(d,d_aux); j<=Math.max(d,d_aux); j++){
					card_delete(c,j,true);
					//a[c][j] = [...h];
				}
				possible_first=[];
				//affi();
			}else{
				//console.log("second_d_aux c:"+c+" d:"+d+" c_aux:"+c_aux+" d_aux:"+d_aux);
				h = [joueur,Math.min(c,c_aux),b.indexOf(Math.abs(c-c_aux)+1),0];
				done[temps-3] = [[...h,h[1],d,1]];
				for(i=Math.min(c,c_aux); i<=Math.max(c,c_aux); i++){
					card_delete(i,d,true);
					//a[i][d] = [...h];
				}
				possible_first=[];
				//affi();
				//a[Math.min(c,c_aux)][d] = [joueur,Math.min(c,c_aux),b.indexOf(Math.abs(c-c_aux)+1),0]; affi();
			}
			card_add(Math.min(c,c_aux),Math.min(d,d_aux),h);
			if(done.length > temps-2){
				done.length = temps-2;
			}
			temps++; first_size = true;
			//joueur = temps%4>1 ? 0:1;
			if(fini(joueur) && fini(1-joueur)){
				fini_memo=3;
				temps_fin = temps;
			}

			//possible = [];
		}else{
			first_size = true;
			modi(c,d,1);
		}
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
		if(fini_memo!=2 && temps == temps_fin){
			joueur = temps%4>1 ? 0:1;
			score[joueur] -= 0.5;
			fini_memo = score[0]>score[1]?0:1;
		}
		document.getElementById("current_state_0").innerHTML = "Tour:"+(temps-2)+"&nbsp;&nbsp;&nbsp;"+(temps%4>1 ? "Jaune:":"Bleu :")+(temps%2+1);
		document.getElementById("current_state_1").innerHTML = "Jaune:"+score[0]+"&nbsp;&nbsp;&nbsp;Graines:"+score[2];
		document.getElementById("current_state_2").innerHTML = "Bleu :"+score[1]+"&nbsp;&nbsp;&nbsp;Graines:"+score[3];
	}
}

function card_delete(c,d,e){
	var i,j;
	var h=[...a[c][d]];
	if(h[2]==0){
		return;
	}
	if(h[3]==0){
		if(e){
			// don't update history on simulation
			done[temps-3].push([...h,h[1],d,0]);
		}
		for(i=h[1]; i<h[1]+b[h[2]]; i++){
			a[i][d]=[0,0,0,0];
		}
	}else{
		if(e){
			done[temps-3].push([...h,c,h[1],0]);
		}
		for(j=h[1]; j<h[1]+b[h[2]]; j++){
			a[c][j]=[0,0,0,0];
		}
	}
}

function card_add(c,d,h){
	if(h[3]==0){
		for(i=c; i<c+b[h[2]]; i++){
			a[i][d] = [...h];
		}
		possible_first=[];
	}else{
		for(j=d; j<d+b[h[2]]; j++){
			a[c][j] = [...h];
		}
		possible_first=[];
	}
}

function card_undo(e){
	if(e){
		clearInterval(video_interval);
		video_active = false;
	}
	if(temps<=3){
		return false;
	}
	var i;
	temps--;
	console.log("undo"+temps);
	// TODO this for loop can be more elegant
	for(i in done[temps-3]){
		console.log("undo:"+JSON.stringify(h));
		// on avait ajouté, on supprime
		h=done[temps-3][i];
		if(h[6]==1){
			console.log("undofound");
			card_delete(h[4],h[5],false);
		}else{
			card_add(h[4],h[5],[h[0],h[1],h[2],h[3]]);
		}
	}
	return true;
}

function card_redo(e){
	if(e){
		clearInterval(video_interval);
		video_active = false;
	}
	if(temps-2 > done.length){
		clearInterval(video_interval); // pour si la fonction est répétée
		video_active = false;
		return false;
	}
	var i;
	//if(temps<=3){
		//return;
	//}
	console.log("undo"+temps);
	for(i in done[temps-3]){
		// on avait ajouté, on supprime
		h=done[temps-3][i];
		if(h[6]==0){
			card_delete(h[4],h[5],false);
		}
	}
	h=done[temps-3][0];
	card_add(h[4],h[5],[h[0],h[1],h[2],h[3]]);
	temps++;
	return true;
}

function card_begin(e){
	if(e){
		clearInterval(video_interval);
		video_active = false;
	}
	while(card_undo()){
	}
}

function card_end(e){
	if(e){
		clearInterval(video_interval);
		video_active = false;
	}
	while(card_redo()){}
}

function card_video(){
	clearInterval(video_interval);
	if(video_active){
		video_active = false;
		return;
	}
	if(temps-2 > done.length){
		card_begin(false);
	}
	video_active = true;
	video_interval = setInterval(()=>{card_redo(false);affi();}, 500);
	//video_active = false;
}

// if players can't play, it's end of game
function fini(joueur){
	if(fini_memo<2 && temps == temps_fin){
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
	if(fini_memo<2 && temps == temps_fin){
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
	temps_fin=0;
	fini_memo=2;
	possible=[];
	done=[];
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
			a[i].push([0,0,0,0]);
		}
	}
	document.getElementById("current_state_0").innerHTML = "Tour:1&nbsp;&nbsp;&nbsp;Jaune:1";
	document.getElementById("current_state_1").innerHTML = "Jaune:0&nbsp;&nbsp;&nbsp;Graines:0";
	document.getElementById("current_state_2").innerHTML = "Bleu :0&nbsp;&nbsp;&nbsp;Graines:0";
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
		ctx.fillStyle = ['#fe0','#07f','#fff'][temps == temps_fin ? fini_memo : 2]
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
			}
		}
	}
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
		if(fini_memo!=2 && temps == temps_fin){
			joueur = temps%4>1 ? 0:1;
			score[joueur] -= 0.5;
			fini_memo = score[0]>score[1]?0:1;
		}
	document.getElementById("current_state_0").innerHTML = "Tour:"+(temps-2)+"&nbsp;&nbsp;&nbsp;"+(temps%4>1 ? "Jaune:":"Bleu :")+(temps%2+1);
	document.getElementById("current_state_1").innerHTML = "Jaune:"+score[0]+"&nbsp;&nbsp;&nbsp;Graines:"+score[2];
	document.getElementById("current_state_2").innerHTML = "Bleu :"+score[1]+"&nbsp;&nbsp;&nbsp;Graines:"+score[3];
}

function info(){
	if(fini_memo!=2 && temps == temps_fin){
		setTimeout(function() {
			alert(["Jaune","Bleu"][fini_memo]+" gagne !      Jaune: "+score[0]+"      Bleu: "+score[1]+"\n\nAppuyez sur les boutons [3] [5] [8] [13] en haut des règles\n pour commencer une nouvelle partie sur un plateau de votre choix.");
		},180)
	}
}

function import_game(){
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
	if(fini_memo!=2 && temps == temps_fin){
		joueur = temps%4>1 ? 0:1;
		score[joueur] -= 0.5;
		fini_memo = score[0]>score[1]?0:1;
	}
	document.getElementById("game_summary").value = JSON.stringify({
		a:a,
		done:done,
		possible:possible,
		score:score,
		temps:temps,
		temps_fin:temps_fin,
		ns:ns,
		fini_memo:fini_memo
	});
}

function export_game(){
	s=JSON.parse(document.getElementById("game_summary").value);
	a=s.a;
	done=s.done;
	possible=s.possible;
	score=s.score;
	temps=s.temps;
	temps_fin=s.temps_fin;
	ns=s.ns;
	fini_memo=s.fini_memo;
	document.getElementById("current_state_0").innerHTML = "Tour:"+(temps-2)+"&nbsp;&nbsp;&nbsp;"+(temps%4>1 ? "Jaune:":"Bleu :")+(temps%2+1);
	document.getElementById("current_state_1").innerHTML = "Jaune:"+score[0]+"&nbsp;&nbsp;&nbsp;Graines:"+score[2];
	document.getElementById("current_state_2").innerHTML = "Bleu :"+score[1]+"&nbsp;&nbsp;&nbsp;Graines:"+score[3];
	board_size_px = 600;
	c_grand = board_size_px/ns;
	c_petit = board_size_px/(6*ns);
	c_marge = 12/ns + 1;
	l_dizaine = board_size_px/(5*ns);
	l_unite = board_size_px/(8*ns);
	l_petit = board_size_px/(13*ns);
	b_dizaine = (c_petit - l_dizaine) / 2;
	b_unite = (c_petit - l_unite) / 2;
}

function openTab(evt, tabName, bName) {
	//mode_analyse = (tabName == "analyse");
	mode = tabName;
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
	if(evt != undefined){
		evt.currentTarget.style.backgroundColor = "#d3d3d3";
	}
	if(bName != undefined){
		document.getElementById(bName).style.backgroundColor = "#d3d3d3";
	}
}

//window.addEventListener('resize',()=>{init();affi()},false);
//exact value, remove right click on board only
document.addEventListener('contextmenu', event => {if(event.clientX < 610 && event.clientY < 610){ event.preventDefault(); }});

window.addEventListener("keydown", function(event){
	//console.log(event.key);
	//return; // TODO better or no shortcuts
	if(event.defaultPrevented){
		return;
	}
	if(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey){
		if(event.ctrlKey && mode != "sauvegarde"){
			if(event.key=='z'){
				card_undo(); affi();
			}else if(event.key=='y'){
				card_redo(); affi();
			}
		}
		return;
	}

	if(mode == "analyse"){
		switch(event.key){
			case 'ArrowLeft':
			case 't':
				card_undo(true); affi();
				break;
			case 'ArrowRight':
			case 'n':
				card_redo(true); affi();
				break;
			case 'Home':
			case 'c':
				card_begin(true); affi();
				break;
			case 'End':
			case 'l':
				card_end(true); affi();
				break;
			case ' ':
				card_video(); affi();
				break;
				// standard
			case 'r':
				openTab(undefined, "regles", "b_regles");
				break;
			case 's':
				openTab(undefined, "sauvegarde", "b_sauvegarde");
				break;
			case 'o':
				openTab(undefined, "opposant", "b_opposant");
				break;
			default:
				return;
		}
	} else if(mode == "sauvegarde"){
		switch(event.key){
			case 'ArrowDown':
			case 's':
				import_game();
				break;
			case 'ArrowUp':
			case 'm':
				export_game(); affi();
				break;
			case 'h':
				document.getElementById("game_summary").select();
				break;
			case 'q':
				import_game(); init(); affi();
				break;
			case 'r':
				openTab(undefined, "regles", "b_regles");
				break;
			case 'a':
				openTab(undefined, "analyse", "b_analyse");
				break;
			case 'o':
				openTab(undefined, "opposant", "b_opposant");
				break;
			default:
				return;
		}
	}else{
		switch(event.key){
			case 'n':
				init(); affi();
				break;
			case 'r':
				openTab(undefined, "regles", "b_regles");
				break;
			case 's':
				openTab(undefined, "sauvegarde", "b_sauvegarde");
				break;
			case 'a':
				openTab(undefined, "analyse", "b_analyse");
				break;
			case 'o':
				openTab(undefined, "opposant", "b_opposant");
				break;
			default:
				return;
		}
	}

	event.preventDefault();
}, true);

