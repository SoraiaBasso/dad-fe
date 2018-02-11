<template>
	<div class="jumbotron">
	    <h1>Admin Area</h1>

	</br>
	<h3>Administrator Details</h3>
	    <div class="form-group">
	        <label for="inputNickname">Nickname</label>
	        <input
	            type="text" class="form-control" v-model="user.nickname"
	            name="nickname" id="inputNickname" 
	            placeholder="Nickname"/>
	    </div>

	    <div class="form-group">
	        <label for="inputEmail">Administrator Email</label>
	        <input v-validate="'required|email'" :class="{'input': true, 'is-danger': errors.has('email') }"
	            type="email" class="form-control" v-model="user.email"
	            name="email" id="inputEmail"
	            placeholder="Adminstrator email"/>
	             <span v-show="errors.has('email')" class="text-danger">{{ errors.first('email') }}</span>

	    </div>

		<button v-on:click.prevent="showChangePassword()">Change Password</button>

		<div v-if="isChangePassword" class="form-group">
	        <label for="oldPassword">Current Password</label>
	        <input v-validate="'required'"
	            type="password" class="form-control" v-model="oldPassword"
	            name="oldPassword" id="oldPassword" 
	            placeholder="Current Password"/>
	            <span v-show="errors.has('oldPassword')" class="text-danger">{{ errors.first('oldPassword') }}</span>
	    </div>

	    <div v-if="isChangePassword" class="form-group">
	        <label for="newPassword">New Password</label>
	        <input v-validate="'required'"
	            type="password" class="form-control" v-model="newPassword"
	            name="newPassword" id="newPassword" 
	            placeholder="Nem Password"/>
	            <span v-show="errors.has('newPassword')" class="text-danger">{{ errors.first('newPassword') }}</span>
	    </div>

	    <div v-if="isChangePassword" class="form-group">
	        <label for="password_confirmation">Password Confirmation</label>
	        <input v-validate="'required|confirmed:newPassword'"
	            type="password" class="form-control"
	            name="password_confirmation" id="password_confirmation" 
	            placeholder="Confirm Password"/>
	            <span v-show="errors.has('password_confirmation')" class="text-danger">{{ errors.first('password_confirmation') }}</span>
	    </div> 

		</br>
	<h3>Platform Details</h3>
	<!--Alterar o email da plataforma -->
		<div class="form-group">
	        <label for="inputPlatformEmail">Platform Email</label>
	        <input v-validate="'required|email'" :class="{'input': true, 'is-danger': errors.has('platformEmail') }"
	            type="email" class="form-control" v-model="config.platform_email"
	            name="platformEmail" id="inputPlatformEmail"
	            placeholder="Platform email"/>
	             <span v-show="errors.has('platformEmail')" class="text-danger">{{ errors.first('platformEmail') }}</span>

	    </div>

	    <div class="alert alert-success" v-if="showSuccess">
			 
			<button type="button" class="close-btn" v-on:click="showSuccess=false">&times;</button>
			<strong>{{ successMessage }}</strong>
		</div>

	    <div class="form-group">
	    	<a class="btn btn-primary" v-on:click.prevent="saveUser()">Save Changes</a>
	        <a class="btn btn-warning" v-on:click.prevent="cancelEdit()">Cancel</a>
	    </div>

		<h2>DECKS MANAGEMENT</h2>

		 <div id= "uploadForm" class="form-group">
		 	<h4>CREATE A NEW DECK</h4>

			<div class="form-group">
		        <label for="inputDeckName">Deck name</label>
		        <input
		            type="text" class="form-control" 
		            name="deckname" id="deckname" v-model="deckname"
		            placeholder="Deck name"/>
		    </div>



		 </br>
		 </br>

		 <h1>Choose an image to represent your deck</h1>
		 	<input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
		 </br>
		 </br>
		 </br>
		 	<button v-on:click="uploadFile()">CREATE DECK</button>

<!--****TODO isto so deve aparecer se ja tiver sido criado o baralho*****-->

<!--<div class="container">
   				 <div class="large-12 medium-12 small-12 cell">
      				<label> Choose cards
        			<input type="file" id="files" ref="files" multiple v-on:change="handleFileUploads()"/>
      				</label>
      				<button v-on:click="uploadFiles()">Upload cards</button>
    			</div>
  			</div>-->
		 <h3>Add cards to the deck</h3>
		 	

  		<div v-if="showCards" v-for="(card, index) in cards"> 
<!--Se a carta for a primeira da lista (Ace) mostra a suite-->
        	<h4 v-if="card.option == 'Ace'">Suite: {{card.suite}} </h4>
        	<p>Card: {{card.option}}</p>
        	<!--<b-button variant="primary">{{index}}</b-button>-->
        	
        	<input type="file" id="fileCard" ref="fileCard" v-on:change="handleFileUploads(index)"/>
        	</br>
        	</br>


        </div>
	
	        <div>
	        	<button v-on:click="uploadFiles()">Upload cards</button>
	        </div>

	    </div> 

<!--************************************FEEDBACK*************************************-->	    
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
		name: 'UserEdit',
		props: ['user'],
		data: function(){
			return { 
				config: {
				platform_email: ''
				},
				deckname: '',
				oldPassword: '',
				newPassword: '',
				showSuccess: false,
		        successMessage: '',
		        isChangePassword: false,
		        file: '',
		        files: [],
		        createdDeckId: 0,
				showError: false,
		        errorMessage: '',
		        cardOptions: ['Ace', '2', '3', '4', '5', '6', '7', 'Jack', 'Queen', 'King'],
		        cardSuites: ['Club', 'Diamond', 'Heart', 'Spade'],
		        cards: [],
		        showCards: false
			}
			
		},
	    methods: {
	        saveUser: function(){
	            this.axios.put('http://localhost:7555/api/admin/edit/' +this.user.id,
	            	this.user,  
	            	{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
	                	//Object.assign(this.user, response.data.data);
	                	this.savedUser();

		                	console.log(response);
	                });
	                if(this.isChangePassword){
	                	//console.log(this.newPassword, this.oldPassword, this.password_confirmation);
/*
this.axios.interceptors.request.use(request => {
  console.log('Starting Request', request)
  return request
})*/

		            this.axios.put('http://localhost:7555/api/admin/edit/password/' +this.user.id,
		            	{oldPassword: this.oldPassword, newPassword: this.newPassword},
	            		{ headers: { Authorization: "Bearer " + this.user.token } })
		                .then(response=>{
		                	this.savedUser();

		                	console.log(response);
		                });
	                }
	        },
	        savedUser: function(){
	            this.showSuccess = true;
	            this.successMessage = 'Changes have been saved.';
	        },
	        showChangePassword: function(){
	        	this.isChangePassword = !this.isChangePassword;
	        },
	       
	        //fazer a api ???
	        cancelEdit: function(){
	        	axios.get('api/users/'+this.user.id)
	                .then(response=>{
	                	// Copy object properties from response.data.data to this.user
	                	// without creating a new reference
	                	Object.assign(this.user, response.data.data);
	                	this.$emit('user-canceled', this.user);
	                });
	        },
	      /*  getUserByToken: function(){
	        	this.axios.get('http://localhost:7555/api/user/'+this.user.token, 
					{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
	                	//o object assign copia as propriedades que veem na resposta para o objecto user que ja existe
	                	//nesta pagina sem criar uma nova instancia dele
	                	Object.assign(this.user, response.data);
	                	console.log(response);
	                });
	        },*/
	        getConfigDetails: function(){
	        	this.axios.get('http://localhost:7555/api/admin/config/details', 
					{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{

	                	Object.assign(this.config, response.data);
	                	
	                	console.log(response.data);
	                	//console.log(this.config.platform_email);
	                });
	        },
	        handleFileUpload: function(){
	        	 this.file = this.$refs.file.files[0];

	        },
	        handleFileUploads:  function(index){
	        //	console.log(this.$refs.fileCard[index]);
	        //	console.log(this.$refs.fileCard[index].files[0]);
	        	this.files[index] = this.$refs.fileCard[index].files[0];
	        },
	        uploadFile: function(){
	        	let formData = new FormData();
	        	formData.append('file', this.file);
	        	formData.append('deckname', this.deckname);

	//TODO : validacao se existe ficheiro para ulpoad ou nao - vai dar problemas na publicacao
        	
	        	this.axios.post('http://localhost:7555/upload', formData,
					{ headers: { Authorization: "Bearer " + this.user.token,
								 'Content-Type': 'multipart/form-data'} })
	                .then(response=>{
	                	//console.log('A new deck was created!');
	                	//console.log('BARALHO CRIADO TEM O ID');

	                	console.log(response.data);

			           
	                	this.createdDeckId = response.data.deckId;

	                	this.showSuccess = true;
			            this.successMessage = 'Deck was created.';
			            this.showCards = true;
	                }).catch(function(){
					  	console.log('Error: file not uploaded!');
					});
	        }, 
	        uploadFiles: function(){
	        	let formData = new FormData();
	        	formData.append('deckId', this.createdDeckId);

	        	for( var i = 0; i < this.files.length; i++ ){
				  let file = this.files[i];

				  formData.append('files[' + i + ']', file);
				}

				this.axios.post( 'http://localhost:7555/upload/multiple/cards', formData,
				  {headers: { Authorization: "Bearer " + this.user.token,
								 'Content-Type': 'multipart/form-data'}}).then(function(response){

					  console.log('SUCCESS!!');
					  console.log(response);

					})
					.catch(function(error){

					  console.log('FAILURE!!');
					  console.log(error);

				});
	        }
		}, 
		mounted() {
			//this.getUserByToken();
			this.getConfigDetails();

			for(let a = 0; a < this.cardSuites.length; a++) {
				for(let i = 0; i < this.cardOptions.length; i++) {
					
					this.cards.push(
						//{card: 
							{option: this.cardOptions[i], 
							 suite: this.cardSuites[a]}
						/*}*/);
				}	
			}
			console.log("this.cards");
			console.log(this.cards);
		}

	}
</script>

<style scoped>	

</style>