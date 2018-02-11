<template>
	<div class="jumbotron">
	    <h2>{{title}}</h2>

	    <div class="form-group">
	        <b-button variant="primary" v-on:click="createNewGame()">Create New Game</b-button>
	    </div>

	    <!--ISTO SERVE PARA INSERIR AQUI NO LOBBY UM COMPONENTE QUE TEM A LISTA DE JOGOS
	    ao fazer isto tenho que declarar la em bai xo no script:
	    import Gamelist from './Gamelist.vue'; 
	    e na zona dos components tenho que ter: 'game-list': Gamelist-->
	    <game-list :pendingGames="pendingGames" :user="user" ></game-list>


	    <div v-for="game in activeGames">
		    <game :game="game" :user="user" :cardImages="cardImages"></game>
		</div>
		<!-- <div v-for="cards in cardImages">
		    <p >{{cards}}</p>
		</div>-->

<!-- <div v-for="cards in cardImages">
		    <p >{{cards}}</p>
		</div>-->
		
		   
		   <!--  <canvas id="canvas"></canvas>
			<div style="display:none;">
			  <img id="source" 
			       width="300" height="227">
			</div>-->
		  

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
	    	//kd vem para o loby vamos fazer o pedido ao root (mainjs) para dar os jogos
	    	this.$root.getPendingGames();
	    	this.$root.getActiveGames();
	    	console.log('IMAGEM DA CARTA RECEBIDAS NA COMPONENTE LOBBY');
	    
	    	//console.log(this.cardImages[0]);
	    /*	var ctx = document.getElementById('canvas').getContext('2d');

				var img = new Image();
				img.src = 'this.cardImages[0]:image/jpeg;base64,' + this.cardImages[0];
				ctx.drawImage(img, 0, 0); */
			
	    }
	}
</script>
