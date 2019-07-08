#include <iostream>
using namespace std;

#include <SDL_image.h>

int mouse_x, mouse_y;
#define NB_DIR 4

void init(char a[3][3][NB_DIR]){
	char i, j, k;
	for(i=0; i<3; i++)
		for(j=0; j<3; j++)
			for(k=0; k<NB_DIR; k++)
				a[i][j][k] = 1;
}

void modi(char a[3][3][NB_DIR], char b[NB_DIR][2], char c, char d){
	char i, j;
	for(i=0; i<NB_DIR; i++)
		for(j=0; j<NB_DIR; j++)
			if( j != (i+(NB_DIR/2))%NB_DIR )
				a[ (c+b[i][0])%3 ][ (d+b[i][1])%3 ][j]   =   (   a[ (c+b[i][0])%3 ][ (d+b[i][1])%3 ][j]   +   a[c][d][i]   ) % 2;
}

void affi(char a[3][3][NB_DIR], char b[NB_DIR][2], Uint32 *e, SDL_Surface *f){
	char i, j, k;
	SDL_Rect pos;
	pos.w = 30;
	pos.h = 30;
	for(i=0; i<3; i++)
		for(j=0; j<3; j++)
			for(k=0; k<NB_DIR; k++){
				pos.x = 180*i + (1+b[k][0])%3*60 + 15;
				pos.y = 180*j + (1+b[k][1])%3*60 + 15;
				SDL_FillRect(f, &pos, e[ a[i][j][k] ]);
			}
}

int action(SDL_Event &e){ //{{{ traduction des actions SDL
	// j'ai séparé cette fonction du menu pour pouvoir facilement permuter le rôle des lettres
	// TODO s'en servir pour un fichier de configuration

	switch(e.type){
		case SDL_QUIT:/* fenetre fermee (mod+G) */
			return -1;

		case SDL_KEYDOWN:
			//cout << "appuis" << e.key.keysym.sym;
			switch(e.key.keysym.sym){
				case SDLK_ESCAPE:
					return 0x1b;
				case ' ':
					return ' ';
				case SDLK_PERIOD:
					return '.';
				case SDLK_COMMA:
					return ',';
				case '[':
					return '[';
				case ']':
					return ']';

				case SDLK_0:
				case 256:/* par touche, indep de numlock */
					return '0';/* ASCII, 48 */
				case SDLK_1:
				case 257:
					return '1';
				case SDLK_2:
				case 258:
					return '2';
				case SDLK_3:
				case 259:
					return '3';
				case SDLK_4:
				case 260:
					return '4';
				case SDLK_5:
				case 261:
					return '5';
				case SDLK_6:
				case 262:
					return '6';
				case SDLK_7:
				case 263:
					return '7';
				case SDLK_8:
				case 264:
					return '8';
				case SDLK_9:
				case 265:
					return '9';

				case SDLK_a:
					return 'a';/* ASCII, 97 */
				case SDLK_b:
					return 'b';
				case SDLK_c:
					return 'c';
				case SDLK_d:
					return 'd';
				case SDLK_e:
					return 'e';
				case SDLK_f:
					return 'f';
				case SDLK_g:
					return 'g';
				case SDLK_h:
					return 'h';
				case SDLK_i:
					return 'i';
				case SDLK_j:
					return 'j';
				case SDLK_k:
					return 'k';
				case SDLK_l:
					return 'l';
				case SDLK_m:
					return 'm';
				case SDLK_n:
					return 'n';
				case SDLK_o:
					return 'o';
				case SDLK_p:
					return 'p';
				case SDLK_q:
					return 'q';
				case SDLK_r:
					return 'r';
				case SDLK_s:
					return 's';
				case SDLK_t:
					return 't';
				case SDLK_u:
					return 'u';
				case SDLK_v:
					return 'v';
				case SDLK_w:
					return 'w';
				case SDLK_x:
					return 'x';
				case SDLK_y:
					return 'y';
				case SDLK_z:
					return 'z';

				case SDLK_UP:
					return 1;/* NOMBRE, 1 */
				case SDLK_RIGHT:
					return 2;
				case SDLK_DOWN:
					return 3;
				case SDLK_LEFT:
					return 4;
				case 8:
					/* backspace */
					return 5;
				case 127:
					/* delete */
					return 6;
				case 278:
					/* debut */
					return 7;
				case 279:
					/* fin */
					return 8;
				case 280:
					/* pageup */
					return 9;
				case 281:
					/* fin */
					return 10;
				default:
					cout << "??" << e.key.keysym.sym << endl;
					return -2;
			}

		case SDL_MOUSEBUTTONDOWN:
			mouse_x = e.button.x;/* not returned */
			mouse_y = e.button.y;
			//cout << "clic on:"<<mouse_x<<":"<<mouse_y<<endl;
			switch(e.button.button){
				case SDL_BUTTON_LEFT:
					return 0x0101;
				case SDL_BUTTON_MIDDLE:
					return 0x0102;
				case SDL_BUTTON_RIGHT:
					return 0x0103;
				case SDL_BUTTON_X1:/* horizontal scroll */
					return 0x0104;
				case SDL_BUTTON_X2:
					return 0x0105;
				case SDL_BUTTON_WHEELUP:
					return 0x0106;
				case SDL_BUTTON_WHEELDOWN:
					return 0x0107;
				default:
					return -3;
			}

			case SDL_MOUSEMOTION:
				mouse_x = e.motion.x;/* not returned */
				mouse_y = e.motion.y;
				return -5;


#ifdef FALSE
		case SDL_WINDOWEVENT:
			switch(e.window.event){
				case SDL_WINDOWEVENT_RESIZED:/* SDL 2 */
					return 0x0201;
				default:
					return 0x0200;
			}
#endif
		default:
			return 0;
	}
} //}}}

int main(){

	char a[3][3][NB_DIR]; // plateau
	//char b[NB_DIR][2] = {{0,1},{1,1},{1,0},{1,2},{0,2},{2,2},{2,0},{2,1}}; // diagonales incluses
	char b[NB_DIR][2] = {{0,1},{1,0},{0,2},{2,0}}; // horizontal et vertical
	Uint32 e[9] = {0x000000, 0xffffff, 0x0000ff, 0x00ff00, 0xff0000, 0x006666, 0xff8800, 0x224422, 0x443322};

	SDL_Surface *f;
	SDL_Init(SDL_INIT_VIDEO);
	f = SDL_SetVideoMode(540,540,32,SDL_HWSURFACE);

	init(a);
	SDL_Rect pos;
	pos.h = 540;
	pos.w = 5;
	pos.y = 0;
	pos.x = 177;
	SDL_FillRect(f, &pos, 0x888888);
	pos.x = 357;
	SDL_FillRect(f, &pos, 0x888888);
	pos.w = 540;
	pos.h = 5;
	pos.x = 0;
	pos.y = 177;
	SDL_FillRect(f, &pos, 0x888888);
	pos.y = 357;
	SDL_FillRect(f, &pos, 0x888888);
	affi(a,b,e,f);
	SDL_Flip(f);

	bool balise_affi;
	int touche;
	SDL_Event ev;
	while(SDL_PollEvent(&ev)){}
	while(1){
		balise_affi = false;
		while(SDL_PollEvent(&ev)){
			touche = action(ev);
			switch (touche){
				case -1:
				case 'q':
					goto Ferme_fenetre;
				case 'g':
					init(a); balise_affi = true; break;
				case 'c':
					modi(a,b,0,0); balise_affi = true; break;
				case 'm':
					modi(a,b,1,0); balise_affi = true; break;
				case 'l':
					modi(a,b,2,0); balise_affi = true; break;
				case 't':
					modi(a,b,0,1); balise_affi = true; break;
				case 's':
					modi(a,b,1,1); balise_affi = true; break;
				case 'n':
					modi(a,b,2,1); balise_affi = true; break;
				case 'd':
					modi(a,b,0,2); balise_affi = true; break;
				case 'v':
					modi(a,b,1,2); balise_affi = true; break;
				case 'j':
					modi(a,b,2,2); balise_affi = true; break;
				default:
					break;
			}
		}
		if(balise_affi){
			affi(a,b,e,f);
			SDL_Flip(f);
		}
		SDL_Delay(50);
	}

Ferme_fenetre:
	SDL_FreeSurface(f);
	SDL_Quit();


	return 0;
}



