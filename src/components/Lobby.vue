<template>
	<div class="jumbotron">
	    <h2>{{title}}</h2>

	    <div class="form-group">
	        <b-button variant="primary" v-on:click="createNewGame()">Create New Game</b-button>
	    </div>

	    <!--inserir a lista de jogos pendntes no lobby-->
	    <game-list :pendingGames="pendingGames" :user="user" ></game-list>


	    <div v-for="game in activeGames">
		    <game :game="game" :user="user" :cardImages="cardImages"></game>
		</div>
		
	</div>		
</template>

<script type="text/javascript">

	import Gamelist from './GameList.vue';
	import Game from './Game.vue';

	export default {
		name: 'Lobby',
		props: ['user', 'pendingGames', 'activeGames', 'cardImages'],
		data: function(){
			return { 
				title: 'Lobby',
		        errorMessage: ''
				}
		},
	    methods: {
	        createNewGame: function(){
	        	this.$root.createNewGame();
	        }
		},
		components: {
	    	'game-list': Gamelist,
	    	'game': Game
	    },
	    mounted() {
	    	//faz o pediro ao main js para dar os jogos
	    	this.$root.getPendingGames();
	    	this.$root.getActiveGames();
	    	console.log('IMAGEM DA CARTA RECEBIDAS NA COMPONENTE LOBBY');
			
	    }
	}
</script>
