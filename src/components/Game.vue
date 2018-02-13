<template>
	<div>
		<div>
			<h2><b-badge variant="primary">{{ title }} : {{game.id}}</b-badge></h2>
			
  			<h4><b-badge variant="warning">Team 1 points: {{game.team1_cardpoints}}</b-badge></h4>
  			<h4><b-badge variant="warning">Team 2 points: {{game.team2_cardpoints}}</b-badge></h4>
			<div>
 
  
</div>
		</div>


    <b-card-group deck
                  class="mb-3">

        <b-card :header-bg-variant="teammate.id==game.currentPlayerId ? 'success' : 'light'"
        		:header="teammate.nickname" 
        		:footer="'Team: ' + teammate.teamId" 
                bg-variant="light"
                class="text-center"
		        >

			<template v-for="index in teammate.cardCount">
				<img height="80" width="60" :src="'data:image/png;base64, ' + hiddenFace">
			</template> 

        </b-card>

    </b-card-group>

    <b-card-group deck
                  class="mb-3">

        <b-card :header-bg-variant="leftOpponent.id==game.currentPlayerId ? 'success' : 'light'"
        		:header="leftOpponent.nickname"
        		:footer="'Team: ' + leftOpponent.teamId" 
                bg-variant="light"
                class="text-center"
		        >
			<template v-for="index in leftOpponent.cardCount">
				<img height="80" width="60" :src="'data:image/png;base64, ' + hiddenFace">
			</template>

        </b-card>
        <b-card header="Table"
        		:footer="'Trump owner: ' + trumpOwnerNickname + ' ' + ' SUITE: '  + chosenTrump.cardSuite" 
                bg-variant="light"
                class="text-center"
		        >

			<b-container class="p-4 bg-dark">
			  <b-row>
			    <b-col>
            		<img v-if="tableCards.top" height="80" width="60" 
            		:src="'data:image/png;base64, ' + tableCards.top">
			    </b-col>
			  </b-row>
			  <b-row>
			    <b-col>
            		<img v-if="tableCards.left" height="80" width="60" 
            		:src="'data:image/png;base64, ' + tableCards.left">
			    </b-col>
			    <b-col>
		            <img height="80" width="60" :src="'data:image/png;base64, ' + chosenTrump.cardImage" 
		            v-on:click="playTrumpCard()" v-if="!game.cardTrump.played">
		            <span v-else class="text-light">Trump already played!</span>
			    </b-col>
			    <b-col>
            		<img v-if="tableCards.right" height="80" width="60" 
            		:src="'data:image/png;base64, ' + tableCards.right">
			    </b-col>
			  </b-row>
			  <b-row>
			    <b-col>
            		<img v-if="tableCards.down" height="80" width="60" 
            		:src="'data:image/png;base64, ' + tableCards.down">
			    </b-col>
			  </b-row>
			</b-container>
<!--

            <img v-if="tableCards.top" height="80" width="60" :src="'data:image/png;base64, ' + tableCards.top">
            <br>
            <img v-if="tableCards.left" height="80" width="60" :src="'data:image/png;base64, ' + tableCards.left">
            <img height="80" width="60" :src="'data:image/png;base64, ' + chosenTrump.cardImage" 
            v-on:click="playTrumpCard()" v-if="!game.cardTrump.played">
            <span v-else>Trump already played!</span>
            <img v-if="tableCards.right" height="80" width="60" :src="'data:image/png;base64, ' + tableCards.right">
            <br>
            <img v-if="tableCards.down" height="80" width="60" :src="'data:image/png;base64, ' + tableCards.down">
-->
        </b-card>

        <b-card :header-bg-variant="rightOpponent.id==game.currentPlayerId ? 'success' : 'light'"
        		:header="rightOpponent.nickname"
        		:footer="'Team: ' + rightOpponent.teamId" 
                bg-variant="light"
                class="text-center"
		        >
			<template v-for="index in rightOpponent.cardCount">
				<img height="80" width="60" :src="'data:image/png;base64, ' + hiddenFace">
			</template>

        </b-card>

    </b-card-group>

    <b-card-group deck
                  class="mb-3">

        <b-card :header-bg-variant="user.id==game.currentPlayerId ? 'success' : 'light'"
        		:header="user.nickname"
        		:footer="'Team: ' + teammate.teamId" 
                class="text-center">
<!-- o metodo playCard() é chamado ao clicar na carta do utilizador logado-->
			<template v-for="card, key in ownCards">
				<img height="80" width="60" :src="'data:image/png;base64, ' + card.cardImage" v-on:click="playCard(card)">

	        </template>

	        <b-button v-if='isCleanTable' variant="primary" v-on:click="cleanTable()">Clean table</b-button>
	        <b-button variant="danger" v-on:click="suspect()">Suspect</b-button>
        </b-card>
    </b-card-group>
  


			

</div>
</template>

<script type="text/javascript">

	export default {
		name: 'Game',
		props: ['game', 'user', 'cardImages'],
		data: function(){
			return { 
				title: 'Game',
				cardPath: '',
				hiddenFace: '',
				trumpOwnerNickname: '',
				chosenTrump: {cardSuite:'', cardValue:'', cardImage:''},
				teammate: {id: 0, nickname: '', orientation: '', cardCount: 0, teamId: 0},
				leftOpponent: {id: 0, nickname: '', orientation: '', cardCount: 0, teamId: 0},
				rightOpponent: {id: 0, nickname: '', orientation: '', cardCount: 0, teamId: 0},
				ownCards: [],
				isCleanTable: false,
				tableCards: {
					top: '',
					left: '',
					right: '',
					down: ''
				}
			}
		}, methods: {
	        isCreator: function(creatorNickname){
	        	return creatorNickname === this.user.nickname;
	        },
	        setOtherPlayers: function(){
	        	var users = this.game.users;
	        	var loggedUser = null;
	        	for (var i = 0; i < users.length; i++) {
	        		loggedUser = users[i];
	        		if(loggedUser.id == this.user.id){
	        			break;
	        		}
	        	}
	        	var orientations = ["SOUTH", "EAST", "NORTH", "WEST"];

	        	for (var i = 0; i < users.length; i++) {
	        		var otherUser = users[i];
	        		if(otherUser.teamId == loggedUser.teamId && otherUser.id != loggedUser.id) {
	        			this.teammate.nickname = otherUser.nickname;
	        			this.teammate.orientation = otherUser.orientation;
	        			this.teammate.cardCount = otherUser.cardCount;
	        			this.teammate.id = otherUser.id;
	        			this.teammate.teamId = otherUser.teamId;
	        		}else{
	        			var orientationIndex = orientations.indexOf(loggedUser.orientation);
	        			var leftOrientationIndex = orientationIndex - 1;
	        			var rightOrientationIndex = orientationIndex + 1;

	        			if(leftOrientationIndex < 0) {
	        				leftOrientationIndex = orientations.length-1;
	        			}
	        			if(rightOrientationIndex >= orientations.length) {
	        				rightOrientationIndex = 0;
	        			}
	        			if (otherUser.orientation == orientations[leftOrientationIndex]) {
		        			this.leftOpponent.nickname = otherUser.nickname;
		        			this.leftOpponent.orientation = otherUser.orientation;
		        			this.leftOpponent.cardCount = otherUser.cardCount;
		        			this.leftOpponent.id = otherUser.id;
		        			this.leftOpponent.teamId = otherUser.teamId;
	        			}else if (otherUser.orientation == orientations[rightOrientationIndex]) {
	        				this.rightOpponent.nickname = otherUser.nickname;
		        			this.rightOpponent.orientation = otherUser.orientation;
		        			this.rightOpponent.cardCount = otherUser.cardCount;
		        			this.rightOpponent.id = otherUser.id;
		        			this.rightOpponent.teamId = otherUser.teamId;
	        			}


	        		}

	        	}
	        	console.log(users);
	        	console.log("loggedUser", loggedUser);
	        	console.log("this.teammate", this.teammate);
	        	console.log("this.leftOpponent", this.leftOpponent);
	        	console.log("this.rightOpponent", this.rightOpponent);



	        }, //metodo para ir buscar a imagem da carta
	        getImageForCard: function(card, cardsToRequest){
	        	var alreadyHasCardImage = false; 
	        	//percorrer tds os decks do array de imagens
				for (var j = 0; j < this.cardImages.length; j++) {
					var deck = this.cardImages[j];
					//se encontrar o deck
					if(deck.deckId == this.game.deck_used){
						//percorre todas as imagens e se encontrar uma carta com o mesmo valor poe a imagem na carta
						for (var l = 0; l < deck.cards.length; l++) {
							var cardImage = deck.cards[l];
							if (cardImage.value == card.cardValue &&
								cardImage.suite == card.cardSuite) {
								alreadyHasCardImage = true;
								card.cardImage = cardImage.image;
								break;
							}
						}


					}
				}
				//se nao encontrar a imagem, junta ao array para pedir 
				if(!alreadyHasCardImage) {
					cardsToRequest.push(card);
				}
				return cardsToRequest;
	        }, //percorre todas as cartas e faz set às imagens
	        setOwnCards: function(firstTime){
	        	//console.log('GAME DO JOGADOR');
	        	//console.log(this.game);

				var cardsToRequest = [];

		    	if(this.hiddenFace == ''){
		        	for (var j = 0; j < this.cardImages.length; j++) {
	        			var deck = this.cardImages[j];
	        			if(deck.deckId == this.game.deck_used){
	        				this.hiddenFace = deck.hiddenFaceImage;
	        				break;
	        			}
	        		}
		    	}
		    	//para cada user do jogo, pomos a carta na mesa
	        	for (var i = 0; i < this.game.users.length; i++) {

	        		//só para sabermos quem tem o trunfo
	    			if(this.game.cardTrump.userId === this.game.users[i].id){
		        			this.trumpOwnerNickname = this.game.users[i].nickname;

		        		}

						//TODO: ver se tem carta no array
					var tableCard = this.game.table[this.game.users[i].id];
	        		//console.log('tableCard');
	        		//console.log(tableCard);
					if(tableCard) {
						cardsToRequest = this.getImageForCard(tableCard, cardsToRequest);
						//este método vai por a carta no sitio certo da mesa
						this.setTableCardImg(tableCard, this.game.users[i].id);
					} else {
						this.setTableCardImg({cardImage: ''}, this.game.users[i].id);
					}

					//se o user for o proprio, faz set às suas cartas
	        		if(this.user.id == this.game.users[i].id){
	        			
	        			console.log('This is user:', this.user.id);
	        			//mostrar as cartas

	        			//console.log('Cards from this user:', this.game.users[i].cards);
	        			/*console.log('Card Suite:', this.game.users[i].cards[0].cardSuite);
	        			console.log('Card Value:', this.game.users[i].cards[0].cardValue);*/
	        			//this.ownCards = this.game.users[i].cards;


    					this.ownCards.splice(0, this.ownCards.length); //faz reset ao array
						this.ownCards.push.apply(this.ownCards, this.game.users[i].cards);

						for (var m = 0; m < this.ownCards.length; m++) {
							var ownCard = this.ownCards[m];
							cardsToRequest = this.getImageForCard(ownCard, cardsToRequest);
						}

	        		}

	        		
	        	}
				console.log('GAME TRUMP')
				console.log(this.game.cardTrump.trumpCard.cardSuite);
			

				//TODO: ver se tem carta no array
				if(this.chosenTrump.cardImage == ''){
					this.chosenTrump.cardSuite = this.game.cardTrump.trumpCard.cardSuite;
					this.chosenTrump.cardValue = this.game.cardTrump.trumpCard.cardValue;

					cardsToRequest = this.getImageForCard(this.chosenTrump, cardsToRequest);
				}
				//se houvre cartas sem imagem, pede-as ao servidor
    			if(cardsToRequest.length>0 && firstTime){
    				//console.log(cardsToRequest);
    				this.requestCardImg(this.game.deck_used, cardsToRequest);
    			}


	        },
	        playCard: function(card) {

	        	//console.log('Carta clicada:')
	        	//console.log(card);

	        	this.updateGame(card, this.user.id, this.game.id);


	        },
	        playTrumpCard: function() {

	        	//console.log('Carta clicada:')
	        	//console.log(card);

	        	this.updateGame(this.chosenTrump, this.user.id, this.game.id);


	        },
	        updateGame: function(card, userId, gameId){
	        	console.log('UPDATE GAME: dados a enviar ao server')
	        	console.log('userId', userId)
	        	console.log('gameId', gameId)
	        	this.$root.updateGame({cardValue: card.cardValue, cardSuite: card.cardSuite}, userId, gameId);
	        },
	        requestCardImg: function(deckId, cards){
	        	
	        	console.log('Dados para pedir as imagens ao servidor');
	        			console.log('Dados para pedir as imagens ao servidor');
	        			console.log('DeckUsed:', deckId);
	        		//	console.log('cards:', cards); 
	        	this.$root.getCardImg(deckId, cards);
	        	
	        },
	        setTableCardImg: function(card, userId){
	        	//mapeia as posicoes do jogadores para a mesa
	        	switch(userId) {
	        		//se o id recebido for do teammate, poe a carta n topo
				    case this.teammate.id:
				    	this.tableCards.top = card.cardImage;
				        break;
				    case this.leftOpponent.id:
				    	this.tableCards.left = card.cardImage;
				        break;
				    case this.rightOpponent.id:
				    	this.tableCards.right = card.cardImage;
				        break;
				    case this.user.id:
				    	this.tableCards.down = card.cardImage;
				        break;
				}
	        },
	        cleanTable: function(){
	        	//ENVIAR O PEDIDO PARA O SERVIDOR LIMPAR A MESA
	        	this.$root.cleanTable(this.game.id, this.user.id);
	        },
	        setIsCleanTable: function() {

	        	//verificar quantas cartas estao na mesa do jogo 
		    	var count = 0;
		    	console.log('WATCH GAME')
		    	console.log('WATCH GAME')
		    	console.log('WATCH GAME')
		    	console.log('WATCH GAME')


		    	for (var i = 0; i < this.game.users.length; i++) {
		    		var user = this.game.users[i];
		    		var card = this.game.table[user.id];

		    		if(card){
		    			count++;
		    		}

		    		if(count == 4){
		    		//mete o botao para limpar a mesa se este user for o currentPlayer
		    			if(this.user.id == this.game.currentPlayerId){
		    				console.log('LIMPAR MESA')
		    					this.isCleanTable = true;
		    			}
		    		
		    		} else {
		    			this.isCleanTable = false;
		    		}

		    	}
		    	console.log('COUNT')
		    	console.log('COUNT')
		    	console.log('COUNT')
		    	console.log('COUNT = ', count)
		    	console.log('THIS USER ID')
		    		console.log(this.user.id)
		    		console.log('CURRENT PLAYER ID')
		    		console.log(this.game.currentPlayerId)

	        
	        },
	        suspect: function(){
		    	console.log('A Enviar Suspeita...');
	        	this.$root.suspect(this.game.id, this.user.id);
	        },


		}, 
		watch: {
		    game() {
		    	this.setIsCleanTable();

		    	console.log('Game Changed!');
				this.setOtherPlayers();
				this.setOwnCards(true);

		    },
		    cardImages() {
				this.setOwnCards(false);
		    	/*
		    	if(this.chosenTrump.cardImage == ''){
		    		this.getImageForCard(this.chosenTrump);
		    	}


	        	for (var i = 0; i < this.ownCards.length; i++) {
	        		var ownCard = this.ownCards[i];
		    		this.getImageForCard(ownCard);
	        	}
				*/
		    },
     		deep: true
		},
		mounted() {
			this.setOtherPlayers();
			this.setOwnCards(true);
			this.setIsCleanTable();

	    }

	}
</script>

<style scoped>
	tr.activerow {
  		background: #123456  !important;
  		color: #fff          !important;
}

</style>