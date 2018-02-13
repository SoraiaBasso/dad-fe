<template>
	<div class="jumbotron">
		<h1>Deck Management</h1>

	  <b-table striped hover :items="decks" 
	  :fields="fieldsForDecks" :per-page="5" :current-page="currentTablePage">
	  	<template slot="complete" slot-scope="row">
	  		{{row.item.complete ? 'Yes' : 'No'}}
	    </template>
	  	<template slot="active" slot-scope="row">
	  		{{row.item.active ? 'Yes' : 'No'}}
	    </template>
	  	<template slot="actions" slot-scope="row">

	  		<span v-if="row.item.active">Deck being used. Can't make changes.</span>
	  		<div v-else>
		      <b-button variant="warning" size="sm" @click.stop="showDeck(row.item.id)" class="mr-2">
		        Edit
		      </b-button>
		      <b-button variant="danger" size="sm" @click.stop="deleteDeck(row.item.id)" class="mr-2">
		        Delete
		      </b-button>
	  		</div>
	    </template>

	  </b-table>
	  <b-pagination :total-rows="decks.length" :per-page="5" v-model="currentTablePage" class="my-0" />


		 </br>
		 </br>
		 <div id= "uploadForm" class="form-group">
		 	<h3>Create a New Deck</h3>

			<div class="form-group">
		        <label for="inputDeckName">Deck name</label>
		        <input
		            type="text" class="form-control" 
		            name="deckname" id="deckname" v-model="deckname"
		            placeholder="Deck name"/>
		    </div>

		 </br>
		 </br>

		 <h4>Choose an image to represent your deck</h4>
		 	<input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
		 </br>
		 </br>
		 </br>
		 	<b-button variant="secondary" v-on:click="createDeck()">Create Deck</b-button>
  		
  		<!--Mostrar as cartas de um deck-->	
		 	<div v-if="showCards">
		 		
				<h3 v-if="showCards">Add cards to the deck {{deckToEdit}}</h3>

		        <div v-for="(card, index) in cards" :key="index">

		        	<!--Se a carta for a primeira da lista (Ace) mostra a suite-->
					<h4 v-if="card.value == 'Ace'">Suite: {{card.suite}} </h4>
				    <b-card-group deck
				                  class="mb-3">

				        <b-card :header="card.value" 
				        		bg-variant="light"
				                class="text-center"
                				footer-tag="footer"
                				header-bg-variant="info"
                				border-variant="info"
                				header-text-variant="white"
						        >
						    	<img v-if="card.image" height="80" width="60" 
			            		:src="'data:image/png;base64, ' + card.image">
			            		<span v-else>No Image Chosen.</span>

            				<em slot="footer">
									<input type="file" id="fileCard" ref="fileCard" 
						    		v-on:change="handleFileUploads(index)"/>
            				</em>
				        </b-card>

				    </b-card-group>

		        </div>

			    <button v-on:click="uploadFiles()">Upload cards</button>
	        </div>

		</div> 

<!--****************************************FEEDBACK***************************************************-->	    
		    <div class="alert alert-success" v-if="showSuccess">
				 
				<button type="button" class="close-btn" v-on:click="showSuccess=false">&times;</button>
				<strong>{{ successMessage }}</strong>
			</div>

		    <div class="alert alert-danger" v-if="showError">
				 
				<button type="button" class="close-btn" v-on:click="showError=false">&times;</button>
				<strong>{{ errorMessage }}</strong>
			</div>
       
	    </div> 

	</div>

</div>
</template>


<script type="text/javascript">
	export default {
		name: 'Decks',
		props: ['user', 'serverIp'],
		data: function(){
			return {
				showSuccess: false,
		        successMessage: '',
				showError: false,
		        errorMessage: '',
		        decks: [],
				deckToEdit: 0,
				deckname: '',
		        file: '',
		        files: [],
		        cardOptions: ['Ace', '2', '3', '4', '5', '6', '7', 'Jack', 'Queen', 'King'],
		        cardSuites: ['Club', 'Diamond', 'Heart', 'Spade'],
		        cards: [],
		        showCards: false,
				fieldsForDecks: [
					{
						key: 'id',
						sortable: true
					},
					{
						key: 'name',
						sortable: true
					},
					{
						key: 'active',
						sortable: true
					},
					{
						key: 'complete',
						sortable: true
					},
					{
						key: 'created_at',
						sortable: true
					},
					{
						key: 'updated_at',
						sortable: true
					},
					{
						key: 'actions'
					}
				],
				currentTablePage: 1
			}
		},
       methods: {
	        handleFileUpload: function(){
	        	 this.file = this.$refs.file.files[0];

	        },
	        handleFileUploads:  function(index){
	        //	console.log(this.$refs.fileCard[index]);
	        //	console.log(this.$refs.fileCard[index].files[0]);
	        	this.files[index] = this.$refs.fileCard[index].files[0];
	        },
	        getDecks:  function(){
	        	this.axios.get(this.serverIp + '/api/decks',
					{ headers: { Authorization: "Bearer " + this.user.token,
								 'Content-Type': 'multipart/form-data'} })
	                .then(response=>{
	                	console.log("GET Decks");
	                	console.log(response);
	                	this.decks = response.data;
	                });
	        },
	        createDeck: function(){
	        	let formData = new FormData();
	        	formData.append('file', this.file);
	        	formData.append('deckname', this.deckname);
        	
	        	this.axios.post(this.serverIp + '/upload', formData,
					{ headers: { Authorization: "Bearer " + this.user.token,
								 'Content-Type': 'multipart/form-data'} })
	                .then(response=>{
	                	//console.log('A new deck was created!');
	                	//console.log('BARALHO CRIADO TEM O ID');

	                	console.log(response.data);

			           
	                	this.createdDeckId = response.data.deckId;

	                	this.showSuccess = true;
			            this.successMessage = 'Deck was created.';
			            this.getDecks();
	                }).catch(function(){
					  	console.log('Error: file not uploaded!');
					});
	        }, 
	        showDeck: function(deckId){
	        	this.deckToEdit = deckId;
	        	this.showCards = true;
	        	this.files = [];
	        	this.getCardImages(deckId);

	        }, 
	        deleteDeck:  function(deckId){
	        	this.axios.delete(this.serverIp + '/api/decks/' + deckId,
					{ headers: { Authorization: "Bearer " + this.user.token} })
	                .then(response=>{
	                	//console.log('A new deck was created!');
	                	//console.log('BARALHO CRIADO TEM O ID');

	                	console.log(response);
	                	this.showSuccess = true;
			            this.successMessage = 'Deck was deleted.';


			            this.getDecks();
	                }).catch((error) => {
					  	console.log(error);
					  	console.log(error.response.data);
					  	if(error.response && error.response.data){
					  		this.errorMessage = error.response.data;
					  		this.showError = true;
					  	}


					});
	        },
	        getCardImages:  function(deckId){
				console.log("GET Card Images");
	        	this.axios.get(this.serverIp + '/api/decks/'+deckId+'/cards/images/',
					{ headers: { Authorization: "Bearer " + this.user.token} })
	                .then(response=>{
	                	console.log("Card Images");
	                	console.log(response);
						//this.cards.splice(0, this.cards.length); //faz reset ao array
						//this.cards.push.apply(this.cards, response.data.cards);

						for (var i = 0; i < this.cards.length; i++) {
							var card = this.cards[i];
							card.image = '';

							for (var j = 0; j < response.data.cards.length; j++) {
								var cardResponse = response.data.cards[j];
								if(card.value == cardResponse.value &&
									card.suite == cardResponse.suite){
									card.image = cardResponse.image;
								}

							}

						}

	                }).catch((error) => {
					  	console.log(error);
					  	console.log(error.response.data);
					  	if(error.response && error.response.data){
					  		this.errorMessage = error.response.data;
					  		this.showError = true;
					  	}


					});
	        },
	        uploadFiles: function(){
	        	let formData = new FormData();
	        	formData.append('deckId', this.deckToEdit);

	        	for( var i = 0; i < this.files.length; i++ ){
				  let file = this.files[i];

				  formData.append('files[' + i + ']', file);
				}

				this.axios.post(this.serverIp + '/upload/multiple/cards', formData,
				  {headers: { Authorization: "Bearer " + this.user.token,
								 'Content-Type': 'multipart/form-data'}}).then((response) => {

					console.log('SUCCESS!!');
					console.log(response);
					this.getCardImages(this.deckToEdit);
			  		this.successMessage = "Files Stored!";
			  		this.showSuccess = true;

					})
					.catch((error) => {
					  	console.log(error);
					  	console.log(error.response.data);
					  	if(error.response && error.response.data){
					  		this.errorMessage = error.response.data;
					  		this.showError = true;
					  	}
				});
	        }
        },
        mounted() {
        	this.getDecks();
			for(let a = 0; a < this.cardSuites.length; a++) {
				for(let i = 0; i < this.cardOptions.length; i++) {
					
					this.cards.push({
						value: this.cardOptions[i], 
						suite: this.cardSuites[a],
						image: ''
					});
				}	
			}
			console.log("this.cards");
			console.log(this.cards);
		}
	}
</script>

<style scoped>
	tr.activerow {
  		background: #123456  !important;
  		color: #fff          !important;
}

</style>