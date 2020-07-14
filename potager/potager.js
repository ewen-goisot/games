
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
var possible=[]; // first square choosen
var possible_first=[]; // where can first square be
var poc=[]; // liste des coups
var fini_memo=2;
var score = [0,0,0,0];
var icz_score = [0,0,0,0];
var mode = "default"; // kb shortcut for undo/redo
var type_opposant=2; // non nul: contre une IA
var ia_playing=false;
// confirm: does not autocomplete
const url = window.location.search;
const url_confirm = RegExp(".*\?confirm.*");
const player_profile_confirm = url_confirm.test(url);
const url_indique = RegExp(".*\?indique.*");
const player_profile_indique = url_indique.test(url);
const url_facebook = RegExp(".*&fbclid.*");

//document.addEventListener('contextmenu', event => {if(event.offsetX < client.offsetWidth && event.offsetY < this.offsetHeight){ event.preventDefault(); }});

if(url_facebook.test(url)){
	console.log("attention aux fbclid: vous avez ouvert ce lien depuis Facebook, qui me l'a dit. Faites-vous respecter.");
}
function sleep(ms) { //{{{

	return new Promise(resolve => setTimeout(resolve, ms));
} //}}}
function modi(c,d,e){ //{{{
// player do something... usually need two clicks

	// partie terminée
	if(fini_memo!=2 && temps == temps_fin){
		return;
	}
	var i, j, k;
	var joueur = temps%4>1 ? 0:1;
	// ne pas jouer pour l'IA si celle-ci réfléchit
	if(type_opposant>0 && joueur==1 && e!=3){
		console.log("attendez, c'est au tour de l'IA");
		return;
	}

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
		//if(true){
		c_aux=c; d_aux=d; first_size = false;
		ldeb(joueur);
		// show all second moves
		if(possible.length==0){
			first_size = true;
			lfin();
		}else if(possible.length==1 && !player_profile_confirm){
			modi(possible[0][0],possible[0][1],1);
		}
		//console.log("possibilite"); affi();
		//}else{
		//// mid_auxle click: put seed here, if empty
		//if(rule(c,d,c,d,joueur)){ temps++; first_size = true;
		if(type_opposant>0 && (temps%4)==0){
			//IA plays here
			ia_modi();
		}
		if(player_profile_indique){
		lfin();
		}
		//a[c][d] = [joueur,c,1,0]; affi();
		//possible_first=[];
		//}
		//}

	}else{
		//console.log("second");
		possible=[];
		//if(c==c_aux && d==d_aux){
		//first_size = true; modi(c,d,0);
		//}else if(c!=c_aux && d!=d_aux){
		//first_size = true;
		//}
		if(rule(c,d,c_aux,d_aux,joueur)){
			card_play(c,d,c_aux,d_aux,joueur);
		}else{
			// try it as first isof second move
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
			fini_memo = score[0]==score[1] ? 1-joueur : score[0]>score[1]?0:1;
			score[1-joueur] += " ½";
		}
	}
} //}}}
async function ia_modi(){ //{{{

	if (ia_playing) {
		console.log("already ia");
		return;
	}else{
		ia_playing=true;
	}
	console.log("enter ia_modi");
	var joueur=1;
	var r;
	if (type_opposant==1) {
		for (var i = 0; i < 2; i++) {
			await sleep(400);
			if (fini(joueur) && fini(1-joueur)) {
				//setTimeout(function() {
				//alert(["Jaune","Bleu"][fini_memo]+" gagne !      Jaune: "+score[0]+"      Bleu: "+score[1]+"\n\nAppuyez sur les boutons [3] [5] [8] [13] en haut des règles\n pour commencer une nouvelle partie sur un plateau de votre choix.");
				//},500);
				return;
			}
			console.log("l'ia joue");
			lfin();
			r=Math.floor(Math.random()*possible_first.length);
			console.log("choix ia:"+r);
			c_aux = possible_first[r][0];
			d_aux = possible_first[r][1];
			ldeb(1);
			console.log("possible ia:"+possible.length);
			if (possible.length==0) {
				ldeb(0);
				console.log("possible ia bis:"+possible.length);
				joueur=0;
			}else{
				joueur=1;
			}
			r=parseInt(Math.random()*possible.length);
			card_play(c_aux, d_aux, possible[r][0], possible[r][1], joueur);
			possible=[];
			possible_first=[];
			affi(); info();
		}

	}else if (type_opposant==2) {
		var score_max, graine_max, l;
		var score_act, graine_act;
		for (var i = 0; i < 2; i++) {
			await sleep(400);
			console.log("l'ia joue");
			if (fini(0) && fini(1)) {
				//setTimeout(function() {
				//alert(["Jaune","Bleu"][fini_memo]+" gagne !      Jaune: "+score[0]+"      Bleu: "+score[1]+"\n\nAppuyez sur les boutons [3] [5] [8] [13] en haut des règles\n pour commencer une nouvelle partie sur un plateau de votre choix.");
				//},500);
				return;
			}
			lmid();
			card_score(poc[0][0], poc[0][1], poc[0][2], poc[0][3], poc[0][4]);
			score_max = icz_score[1]-icz_score[0];
			graine_max = icz_score[3]-icz_score[2];
			l=0;
			for (var j = 1, len = poc.length; j < len; j++) {
				card_score(poc[j][0], poc[j][1], poc[j][2], poc[j][3], poc[j][4]);
				score_act = icz_score[1]-icz_score[0];
				graine_act = icz_score[3]-icz_score[2];
				if (graine_act>graine_max || (graine_act==graine_max && score_act>score_max)) {
					score_max = score_act;
					graine_max = graine_act;
					l=j;
					console.log("nouveau score:"+score_max+" "+graine_max);
				}else{
					console.log("mauvais score:"+score_max+" "+graine_max);
				}
			}
			card_play(poc[l][0], poc[l][1], poc[l][2], poc[l][3], poc[l][4]);
			possible=[];
			possible_first=[];
			affi(); info();
		}
	}
	ia_playing=false;
	//temps+=1;
	//affi();
	console.log("leave ia_modi");
} //}}}
function card_delete(c,d,e){ //{{{

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
} //}}}
function card_add(c,d,h){ //{{{

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
} //}}}
function card_score(c,d,cc,dd,e){ //{{{
// for ia, assume regular move

	console.log("enter score");
	var h;
	icz_score=[0,0,0,0];
	icz_score[e]+=(cc-c+dd-d+1);
	if (c==cc && d==dd) {
		icz_score[e+2]+=1;
		//return;
		// vertical
	}else if (c==cc) {
		for (var j = d; j <= dd; j++) {
			h=a[c][j];
			if (h[2]==1) {
				// graine
				icz_score[1-h[0]]+=1;
				icz_score[3-h[0]]+=1;
			}else if (h[2]>1) {
				icz_score[1-h[0]]+=b[h[2]];
				if (h[3]==1) {
					// don't add same card several time
					// sécurité TODO remove
					j=h[1]+b[h[2]]-1;
				}
			}
		}
	}else{
		for (var i = c; i <= cc; i++) {
			h=a[i][d];
			if (h[2]==1) {
				// graine
				icz_score[1-h[0]]+=1;
				icz_score[3-h[0]]+=1;
			}else if (h[2]>1) {
				icz_score[1-h[0]]+=b[h[2]];
				if (h[3]==0) {
					// don't add same card several time
					// sécurité TODO remove
					i=h[1]+b[h[2]]-1;
				}
			}
		}
	}
	console.log("leave score");
} //}}}
function card_play(c,d,cc,dd,joueur){ //{{{

	console.log("enter card_play");
	// assume rules are checked, else can do ilg moves
	if(c==cc){
		h = [joueur,Math.min(d,dd),b.indexOf(Math.abs(d-dd)+1),1];
		done[temps-3] = [[...h,c,h[1],1]];
		for(j=Math.min(d,dd); j<=Math.max(d,dd); j++){
			card_delete(c,j,true);
		}
	}else{
		h = [joueur,Math.min(c,cc),b.indexOf(Math.abs(c-cc)+1),0];
		done[temps-3] = [[...h,h[1],d,1]];
		for(i=Math.min(c,cc); i<=Math.max(c,cc); i++){
			card_delete(i,d,true);
		}
	}
	possible_first=[];
	card_add(Math.min(c,cc),Math.min(d,dd),h);
	if(done.length > temps-2){
		done.length = temps-2;
		temps_fin=0;
	}
	temps++; first_size = true;
	if(type_opposant>0 && (temps%4)==0){
		// IA plays here
		ia_modi();
	}else if(player_profile_indique){
		lfin();
	}
	if(fini(joueur) && fini(1-joueur)){
		fini_memo=3;
		temps_fin = temps;
	}
	console.log("leave card_play");
} //}}}
function card_undo(e){ //{{{

	if(e){
		clearInterval(video_interval);
		video_active = false;
	}
	if(temps<=3){
		return false;
	}
	ia_playing = false;
	var i;
	temps--;
	//console.log("undo"+temps);
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
} //}}}
function card_redo(e){ //{{{

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
	//console.log("undo"+temps);
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
	if(player_profile_indique){
		lfin();
	}
	return true;
} //}}}
function card_begin(e){ //{{{

	if(e){
		clearInterval(video_interval);
		video_active = false;
	}
	while(card_undo()){
	}
} //}}}
function card_end(e){ //{{{

	if(e){
		clearInterval(video_interval);
		video_active = false;
	}
	while(card_redo()){}
} //}}}
function card_temps(c){ //{{{

	clearInterval(video_interval);
	video_active = false;
	c+=2;
	while(c>temps && card_redo(true)){}
	while(c<temps && card_undo(true)){}
} //}}}
function card_video(){ //{{{

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
} //}}}
function fini(joueur){ //{{{
// if players can't play, it's end of game

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
} //}}}
function ldeb(joueur){ //{{{

	var c=c_aux;
	var d=d_aux;
	console.log("ldeb c:"+c+"d:"+d);
	possible=[];
	console.log("joueur:"+joueur);
	if(rule(c,d,c,d,joueur)){
		possible.push([c, d, joueur]);
	}
	for(var i=2; i<7; i++){
		//console.log("check: "+i);
		if(rule(c, d, c, d+b[i]-1, joueur)){
			possible.push([c, d+b[i]-1, joueur]);
		}
		if(rule(c, d, c, d-b[i]+1, joueur)){
			possible.push([c, d-b[i]+1, joueur]);
		}
		if(rule(c, d, c+b[i]-1, d, joueur)){
			possible.push([c+b[i]-1, d, joueur]);
		}
		if(rule(c, d, c-b[i]+1, d, joueur)){
			possible.push([c-b[i]+1, d, joueur]);
		}
	}
} //}}}
function lfin(){ //{{{

	/*
	* regarde pour chaque case s'il est possible de jouer.
	* ultimement, cette fonction sera supprimée au profit de lmid,
	* qui fait pareil mais en précisant aussi ce qu'on peut joueur sur chaque case.
	* le temps perdu est négligeable, car seul le joueur humain invoque lfin()
	*/
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
} //}}}
function lmid(){ //{{{

	poc=[];
	if(fini_memo<2 && temps == temps_fin){
		return;
	}
	var joueur, i, j, k;
	for (joueur = 0; joueur < 2; joueur++) {
		for (i = 0; i < ns; i++) {
			for (j = 0; j < ns; j++) {
				if(rule(i,j,i,j,joueur)){
					poc.push([i,j,i,j,joueur]);
				}
				for (k = 2; k < 7; k++) {
					if(rule(i, j, i, j+b[k]-1, joueur)){
						poc.push([i,j,i,j+b[k]-1,joueur]);
					}
					if(rule(i, j, i+b[k]-1, j, joueur)){
						poc.push([i,j,i+b[k]-1,j,joueur]);
					}
				}
			}
		}
	}
} //}}}
function rule(c,d,cc,dd,joueur){ //{{{

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
		//console.log("c:"+c+"d:"+d);
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
} //}}}
function init(){ //{{{

	//console.log("init")
	ns=parseInt(n_s); nd=parseInt(n_d); nc=parseInt(n_c); nh=parseInt(n_h);
	temps=3;
	temps_fin=0;
	fini_memo=2;
	possible=[];
	done=[];
	ia_playing = false;
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
} //}}}
async function affi(){ //{{{

	// TODO display only changed parts
	var i, j, k;
	var plat_canva = document.getElementById("plateau");
	if( !plat_canva.getContext){
		return;
	}
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
	if (temps==temps_fin && fini_memo==3) {
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
		joueur = temps%4>1 ? 0:1;
		fini_memo = score[0]==score[1] ? 1-joueur : score[0]>score[1]?0:1;
		score[1-joueur] += " ½";
	}
	ctx.fillStyle = ['#fe0','#07f','#fff'][temps == temps_fin ? fini_memo%2 : 2]
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
				ctx.arc(c_grand*(i+1/2), c_grand*(j+1/2), c_grand/2 - 2*c_marge, Math.PI/2*(1+h[3]), Math.PI/2*(3+h[3]));
				ctx.arc(c_grand*(i+(b[h[2]]-1)*(1-h[3])+1/2), c_grand*(j+(b[h[2]]-1)*h[3]+1/2), c_grand/2 - 2*c_marge, Math.PI/2*(3+h[3]), Math.PI/2*(5+h[3]));
				ctx.lineTo(c_grand*(i+(1-h[3])/2) + 2*c_marge*h[3], c_grand*(j+1-h[3]/2) - 2*c_marge*(1-h[3]));
				ctx.stroke();
				ctx.fill();
				//ctx.fillRect(i*c_grand, j*c_grand, c_grand*(h[2]*(1-h[3])+h[3]), c_grand*(h[2]*h[3]+(1-h[3])));
				ctx.fillStyle = '#000';
				if(h[2]>1){
					ctx.fillRect(c_grand*(i+1/2) - l_petit/2*h[3], c_grand*(j+1/2) - l_petit/2*(1-h[3]), c_grand*(b[h[2]]-1)*(1-h[3]) + l_petit*h[3], c_grand*(b[h[2]]-1)*h[3] + l_petit*(1-h[3]));
					ctx.beginPath();
					ctx.arc(c_grand*(i+1/2+(b[h[2]]-1)*(1-h[3])), c_grand*(j+1/2+(b[h[2]]-1)*h[3]), [l_dizaine,l_unite][h[2]%2], 0, 2*Math.PI);
					ctx.stroke();
				}else{ctx.beginPath();}
				ctx.arc(c_grand*(i+1/2), c_grand*(j+1/2), [l_dizaine,l_unite][h[2]%2], 0, 2*Math.PI);
				ctx.fill();
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
			fini_memo = score[0]==score[1] ? 1-joueur : score[0]>score[1]?0:1;
			score[1-joueur] += " ½";
		}
	//document.getElementById("current_state_0").innerHTML = "Temps&nbsp;:&nbsp;"+(temps-2)+"&emsp;&nbsp; "+(temps%4>1 ? "Jaune":"Bleu")+"&nbsp;:&nbsp;"+(temps%2+1);
	//document.getElementById("current_state_1").innerHTML = "Jaune&nbsp;:&nbsp;"+score[0]+"&emsp;Graines&nbsp;:&nbsp;"+score[2];
	//document.getElementById("current_state_2").innerHTML = "Bleu&nbsp;:&nbsp;"+score[1]+" &emsp; Graines&nbsp;:&nbsp;"+score[3];
	document.getElementById("current_state_0").innerHTML =
		"<span>Temps : "+(temps-2)+"</span>     <span>"+(temps%4>1 ? "J":"B")+" "+(temps%2+1)+"/2</span>";
	document.getElementById("current_state_1").innerHTML =
		"<span>Jaune : "+score[0]+"</span>     <span>Graines : "+score[2]+"</span>";
	document.getElementById("current_state_2").innerHTML =
		"<span>Bleu : "+score[1]+"</span>      <span>Graines : "+score[3]+"</span>";
} //}}}
function info(){ //{{{

	if(fini_memo!=2 && temps == temps_fin){
		setTimeout(function() {
			alert(["Jaune","Bleu"][fini_memo]+" gagne !      Jaune: "+score[0]+"      Bleu: "+score[1]+"\n\nAppuyez sur les boutons [3] [5] [8] [13] en haut des règles\n pour commencer une nouvelle partie sur un plateau de votre choix.");
		},500)
	}
} //}}}
function import_game(){ //{{{

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
		fini_memo = score[0]==score[1] ? 1-joueur : score[0]>score[1]?0:1;
		score[1-joueur] += " ½";
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
} //}}}
function export_game(){ //{{{

	s=JSON.parse(document.getElementById("game_summary").value);
	a=s.a;
	done=s.done;
	possible=s.possible;
	score=s.score;
	temps=s.temps;
	temps_fin=s.temps_fin;
	ns=s.ns;
	fini_memo=s.fini_memo;
	board_size_px = 600;
	c_grand = board_size_px/ns;
	c_petit = board_size_px/(6*ns);
	c_marge = 12/ns + 1;
	l_dizaine = board_size_px/(5*ns);
	l_unite = board_size_px/(8*ns);
	l_petit = board_size_px/(13*ns);
	b_dizaine = (c_petit - l_dizaine) / 2;
	b_unite = (c_petit - l_unite) / 2;
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
//{{{ comments…
//window.addEventListener('resize',()=>{init();affi()},false);
//exact value, remove right click on board only
//moved
//document.addEventListener('contextmenu', event => {if(event.clientX < 610 && event.clientY < 610){ event.preventDefault(); }});
//}}}
window.addEventListener("keydown", function(event){ //{{{
	//console.log(event.key);
	//return; // TODO better or no shortcuts
	if(event.defaultPrevented){
		return;
	}
	if(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey){
		if(event.ctrlKey && mode != "parties"){
			if(event.key=='z'){
				card_undo(); affi();
			}else if(event.key=='y'){
				card_redo(); affi();
			}
		}
		return;
	}

	if(mode == "opposant"){
		//console.log("op");
		switch(event.key){
			case 't':
				document.getElementById("ia_jaune").focus();
				break;
			case 'n':
				document.getElementById("ia_bleue").focus();
				break;
			case 'r':
				openTab(undefined, "regles", "b_regles");
				break;
			case 'p':
				openTab(undefined, "parties", "b_parties");
				break;
			case 'a':
				openTab(undefined, "analyse", "b_analyse");
				break;
			default:
				return;
		}
	}else if(mode == "analyse"){
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
			case 'g':
				card_temps(parseInt(prompt('Aller au tour :', '0'))); affi();
				break;
			case ' ':
				card_video(); affi();
				break;
				// standard
			case 'r':
				openTab(undefined, "regles", "b_regles");
				break;
			case 'p':
				openTab(undefined, "parties", "b_parties");
				break;
			case 'o':
				openTab(undefined, "opposant", "b_opposant");
				break;
			default:
				return;
		}
	} else if(mode == "parties"){
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
			case 'g':
				import_game(); init(); affi();
				break;
			case 'q':
				document.getElementById('game_summary').value='';
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
			//case 'n':
				//init(); affi();
				//break;
			case 'r':
				openTab(undefined, "regles", "b_regles");
				break;
			case 'p':
				openTab(undefined, "parties", "b_parties");
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
}, true); //}}}
