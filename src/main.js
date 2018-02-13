// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//varivel que contem o ip do servidor
//const serverIp = "http://46.101.25.53:8080";
const serverIp = "http://localhost:7555";


import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);

import VeeValidate from 'vee-validate';

Vue.use(VeeValidate, {fieldsBagName: 'formFields'})
/*
import Paginate from 'vuejs-paginate'
Vue.component('paginate', Paginate)*/

import Vuex from 'vuex'
import {
	Store
} from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

Vue.use(Vuex);

import moment from 'moment'

Vue.filter('formatDate', function(value) {
	if (value) {
		return moment(String(value)).format('MM/DD/YYYY hh:mm:ss');
	}
})

//Vue.config.productionTip = false

import User from '@/components/User'
import UserCreate from '@/components/UserCreate'
import UserEdit from '@/components/UserEdit'
import UserList from '@/components/UserList'
import Statistics from '@/components/Statistics'
import UserDetails from '@/components/UserDetails'
import AdminEdit from '@/components/AdminEdit'
import Login from '@/components/Login'
import Lobby from '@/components/Lobby'
import Decks from '@/components/Decks'
import PasswordReset from '@/components/PasswordReset'


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


import io from 'socket.io-client';

let socket = null;

const routes = [{
	path: '/',
	redirect: '/listStatistics'
}, {
	path: '/users',
	name: 'Users',
	component: User
}, {
	path: '/login',
	name: 'Login',
	component: Login
}, {
	path: '/users/create',
	name: 'UserCreate',
	component: UserCreate
}, {
	path: '/user/edit',
	name: 'UserEdit',
	component: UserEdit
}, {
	path: '/admin/edit',
	name: 'AdminEdit',
	component: AdminEdit
}, {
	path: '/listStatistics',
	name: 'Statistics',
	component: Statistics
}, {
	path: '/lobby',
	name: 'Lobby',
	component: Lobby
}, {
	path: '/decks/',
	name: 'Decks',
	component: Decks
}, {
	path: '/passwordReset/:resetToken',
	name: 'PasswordReset',
	component: PasswordReset
}]

const router = new VueRouter({
	routes: routes
})


const user = {
	id: 0,
	name: '',
	nickname: '',
	email: '',
	admin: 0,
	token: null
}

//esta variavel store serve para persistir para ao fazer refresh nao fazer logout
const store = new Vuex.Store({
	state: {
		user: user
	},
	plugins: [createPersistedState({
		storage: {
			getItem: key => Cookies.get(key),
			setItem: (key, value) => Cookies.set(key, value, {
				expires: 3,
				secure: false
			}),
			removeItem: key => Cookies.remove(key)
		}
	})],
	getters: {
		getUser: state => {
			return state.user
		}
	},
	mutations: {
		saveUser(state, currentUser) {
			state.user = currentUser;
		}
	}
});

const pendingGames = [];
const activeGames = [];
const cardImages = [];
var gamesOver = [];


function initListeners(s) {
	s.on('pendingGames', function(data) {
		//receber os games que vieram no canal
		pendingGames.splice(0, pendingGames.length); //faz reset ao array
		console.log("Pending Games:", pendingGames);
		pendingGames.push.apply(pendingGames, data.games);
		console.log("Pending Games:", pendingGames);
	});
	s.on('activeGames', function(data) {
		console.log('Cliente active games')
		activeGames.splice(0, activeGames.length); 
		activeGames.push.apply(activeGames, data.games);
		console.log("Active Games:", activeGames);
	});
	s.on('cardImages', function(data) {

		console.log("data RECEBIDA  no main:");
		console.log("buffer RECEBIDA  no main:", data);

		var isDeckPresent = false;

		for (var i = 0; i < cardImages.length; i++) {
			var deck = cardImages[i];
			if(deck.deckId == data.deckId) {
				isDeckPresent = true;
				for (var j = 0; j < deck.cards.length; j++) {
					var card = deck.cards[j];
					var alreadyExists = false;
					for (var l = 0; l < data.cards.length; l++) {
						var receivedCard = data.cards[l];
						if(receivedCard.value == card.value &&
							receivedCard.suite == card.suite) {
							alreadyExists = true;
						}
						if(!alreadyExists) {
							deck.cards.push(receivedCard);
						}
					}
				}
				break;
			}
		}
		if(!isDeckPresent){
			cardImages.push(data);

		}

		cardImages.splice(0, cardImages.length);
		cardImages.push.apply(cardImages, [data]);
		console.log("buffer RECEBIDA  no main:", cardImages);

	});
	s.on('gameOver', function(data) {
		//console.log('data')
		//console.log(data)
		gamesOver.splice(0, gamesOver.length);

		let gameOver = data.game;
		gameOver.teamWinner = data.teamWinner;
		gamesOver.push(gameOver);
	});
}


var vm = new Vue({
	store,
	el: '#app',
	router: router,
	data: {
		user: user,
		pendingGames: pendingGames, 
		activeGames: activeGames,
		cardImages: cardImages,
		serverIp: serverIp,
		gamesOver: gamesOver
	},
	template: '<App/>',
	components: {
		App
	},
	methods: {
		saveUser(currentUser) {
			store.commit('saveUser', currentUser);
		},
		initSocket() {
			console.log(store.getters.getUser);
			if (store.getters.getUser.token) {
				//envia um pedido de conexão ao servidor
				socket = io(serverIp, {
					forceNew: true
				});
				initListeners(socket);
				socket.on('connect', function() {
					socket.emit('authentication', {
						token: store.getters.getUser.token
					});
					socket.on('authenticated', function() {
						// fazer as coisas normalmente
					});
				});
			}
		},
		disconnectSocket() {
			socket.disconnect();
		},
		createNewGame() {
			socket.emit('createNewGame', {
				user: store.getters.getUser
			});
		},
		getPendingGames() {
			socket.emit('getPendingGames'); //faz o pedido ao servidor atarves do canal getPendingGames
		},
		getActiveGames() {
			socket.emit('getActiveGames', {
				userId: store.getters.getUser.id
			});
		},
		updateGame(card, userId, gameId) {
			socket.emit('updateGame', {clickedCard: card, userId: userId, gameId: gameId});
		},
		joinGame(gameId) {
			//faz o pedido ao servidor atarves do canal joinGame
			socket.emit('joinGame', {
				gameId: gameId,
				userId: store.getters.getUser.id
			});

		},
		startGame(gameId) {
			//faz o pedido ao servidor atarves do canal startGame
			socket.emit('startGame', {
				gameId: gameId,
				userId: store.getters.getUser.id
			});
		},
		removeGame(gameId) {
			socket.emit('removePendingGame', {
				gameId: gameId,
				userId: store.getters.getUser.id
			});
		},
		getCardImg(deckId, ownCards) {
			socket.emit('getCards', {
				deckId: deckId,
				ownCards: ownCards
			});
		},
		cleanTable(gameId, userId) {
			socket.emit('cleanTable', {gameId: gameId, userId: userId});

		},
		suspect(gameId, userId) {
			socket.emit('suspect', {gameId: gameId, userId: userId});
		},
		resetGameOver() {
			gamesOver.splice(0, gamesOver.length);
		}	
	}
})


router.beforeEach((to, from, next) => {
	const currentUser = store.getters.getUser;

	var loggedRoutes = ["UserEdit", "Users", "AdminEdit", "Lobby", "Decks"];
	//Se o nome da routa for uma das rotas de Logado
	if (loggedRoutes.indexOf(to.name) > -1) {
		if (!currentUser.token) {
			alert('You have to be logged in to go to this route!');
			return next(false); //Aborta a mudança de rota
		}

	}

	var adminRoutes = ["Users", "AdminEdit", "Decks"];
	//Se o nome da routa for uma das rotas de Admin
	if (adminRoutes.indexOf(to.name) > -1) {
		if (!currentUser.admin) {
			alert('You have to be an administrator to go to this route!');
			return next(false); //Aborta a mudança de rota
		}
	}
	next();

})