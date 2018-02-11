<template>
	<div>
	<div class="jumbotron">
			<h1>{{ title }}</h1>
		</div>
<!--		
	<table class="table table-striped">
	    <thead>
	        <tr>
	        	<th>Deck name</th>
	        	<th>Active</th>
	        	<th>Complete</th>
	        	<th>Actions</th>
	           
	        </tr>
	    </thead>
	    <tbody>
	        <tr v-for="deck in decks">
	        	<td>{{deck.name}}</td>
	        	<td v-if="deck.active">Yes</td>
	        	<td v-else>No</td>
	        	<td v-if="deck.complete">Yes</td>
	        	<td v-else>No</td>

	           <td>
	                <a class="btn btn-xs btn-warning" v-on:click.prevent="editDeck(deck)">Edit</a>
	                <a class="btn btn-xs btn-danger" v-on:click.prevent="deleteDeck(deck)">Delete</a>
	            </td> 

	        </tr>
	    </tbody>
	</table> -->

<!--Área para editar baralho -->
<!--	<div v-if="isEditDeck">
		<div class="form-group">
		        <label for="inputDeckName">Deck name</label>
		        <input
		            type="text" class="form-control" 
		            name="deckname" id="deckname" v-model="deckname"
		            placeholder="Deck name"/>
		</div>

		</br>

		 <h4>Change deck hidden face</h4>
		 	<input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
		 </br>
		 </br>
		 	<button v-on:click="uploadFile()">Change</button>

		 <h3>Change deck cards</h3>
		 	

  		<div v-for="(card, index) in cards"> 
  		-->
<!--Se a carta for a primeira da lista (Ace) mostra a suite-->
 <!--       	<h4 v-if="card.option == 'Ace'">Suite: {{card.suite}} </h4>
        	<p>Card: {{card.option}}</p>
        	<!--<b-button variant="primary">{{index}}</b-button>-->
        	
 <!--       	<input type="file" id="fileCard" ref="fileCard" v-on:change="handleFileUploads(index)"/>
        	</br>
        	</br>


        </div>
	
	        <div>
	        	<button v-on:click="uploadFiles()">Upload cards</button>
	        </div>

	</div> -->
<!--
	<div class="alert alert-success" v-if="showSuccess">
			 
			<button type="button" class="close-btn" v-on:click="showSuccess=false">&times;</button>
			<strong>{{ successMessage }}</strong>
		</div>

	    <div class="alert alert-danger" v-if="showError">
			 
			<button type="button" class="close-btn" v-on:click="showError=false">&times;</button>
			<strong>{{ errorMessage }}</strong>
	</div>
-->

</div>
</template>


<script type="text/javascript">
/*
	export default {
		name: 'Decks',
		props: ['user'],
		data: function(){
			return {
				title: 'Decks',
				decks: [],
				deck: {
					name: '',
					active: 0,
					complete: 0
				},
				isEditDeck: false,
				showSuccess: false,
		        successMessage: '',
		        showError: false,
		        errorMessage: '',
		        cardOptions: ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'],
		        cardSuites: ['Club', 'Diamond', 'Heart', 'Spade'],
		        cards: [],
			}
		},
       methods: {
           getAllDecks: function(){
            	this.axios.get('http://localhost:7555/api/get/decks',
	            	{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
	                	console.log('RESPOSTA NO CLIENTE')
	                	console.log(response.data);

	                	this.decks = response.data;
	                	
	                	console.log(this.decks);
		                	console.log(response);
	                });
            },
            getCardPaths: function(deck){
            	this.axios.get('http://localhost:7555/api/get/card/paths', deck,
	            	{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
	                	console.log('RESPOSTA NO CLIENTE')
	                	console.log(response.data);

	                //	this.decks = response.data;
	                	
	                	//console.log(this.decks);
	                });
            },
            editDeck: function(deck){
            	this.isEditDeck = true;
            	this.deckname = deck.name;
            	this.deck = deck;


            }
        },
        mounted() {
        	this.getAllDecks();
        	this.getCardPaths(deck);

        	for(let a = 0; a < this.cardSuites.length; a++) {
				for(let i = 0; i < this.cardOptions.length; i++) {
					
					this.cards.push(
						//{card: 
							{option: this.cardOptions[i], 
							 suite: this.cardSuites[a]}
						/*});
				}	
			}
			console.log("this.cards");
			console.log(this.cards);
        }		
	} */
</script>

<style scoped>
	tr.activerow {
  		background: #123456  !important;
  		color: #fff          !important;
}

</style>