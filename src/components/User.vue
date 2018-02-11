<template>
	<div>
		<user-list :users="users" :user="user" :serverIp="serverIp" @details-click="detailsUser" @delete-click="deleteUser" @message="childMessage" ref="usersListRef"></user-list>


	  <b-alert v-if="showSuccess" show dismissible variant="success">
	    {{ successMessage }}
	  </b-alert>

	<!--
		<user-edit :user="currentUser" @user-saved="savedUser" @user-canceled="cancelEdit" v-if="currentUser"></user-edit>		-->		

	<!--
		<user-create></user-create>
-->
		<user-details :user="currentUser" :serverIp="serverIp" v-if="currentUser"></user-details>	

	<!--	<div>
			<user-details :user="currentUser"  @details-click="detailsUser"></user-details>	
		</div> -->

	</div>				
</template>

<script type="text/javascript">
	import UserList from './UserList.vue';
	import UserEdit from './UserEdit.vue';
	import UserCreate from './UserCreate.vue';
	import UserDetails from './UserDetails.vue';
	
	export default {
		props: ['user', 'serverIp'],
		data: function(){
			return { 
		        showSuccess: false,
		        successMessage: '',
		        currentUser: null,
		        users: []
			}
		},
	    methods: {
	        editUser: function(user){
	            this.currentUser = user;
	            this.showSuccess = false;
	        },
	        detailsUser: function(user){
	            this.currentUser = user;
	            console.log("asdasdasd");
	            console.log(this.currentUser);
	            this.showSuccess = false;
	        },
	        /*DUVIDA - devo fazer as coisas aqui no pai ou no list users?*/
	        deleteUser: function(user){
	            axios.delete(this.serverIp + '/api/users/'+user.id)
	                .then(response => {
	                    this.showSuccess = true;
	                    this.successMessage = 'User Deleted';
	                    this.getUsers();
	                });
	        },
	        savedUser: function(){
	            this.currentUser = null;
	            this.$refs.usersListRef.editingUser = null;
	            this.showSuccess = true;
	            this.successMessage = 'User Saved';
	        },
	        cancelEdit: function(){
	            this.currentUser = null;
	            this.$refs.usersListRef.editingUser = null;
	            this.showSuccess = false;
	        },
	        getUsers: function(){
	        	//Faz um pedido ao Servidor para ir buscar os users
				
				this.axios.get(this.serverIp +'/api/users', 
					{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
	                	//Mostra a resposta no log
						console.log(response);
						//Põe os users que foi buscar na variavel users
						//Isto vai fazer com que os users sejam automaticamente mostrados
						//Porque na tag <user-list> está lá a variavel users
	                	this.users = response.data; 
	                });
			},
			childMessage: function(message){
				this.showSuccess = true;
	            this.successMessage = message;
			}
	    },
	    components: {
	    	'user-list': UserList,
	    	'user-edit': UserEdit,
	    	'user-details': UserDetails,
	    	'user-create': UserCreate,
	    },
	    mounted() {
	    	//O metodo mounted() vai ser executado quando a página estiver pronta
			this.getUsers();
		}

	}
</script>

<style scoped>	
p {
	font-size: 2em;
	text-align: center;
}
</style>







<!--
<template>
	<div>
		<div class="jumbotron">
			<h1>{{ title }}</h1>
			<p>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
		</div>

					
	</div>				
</template>

<script type="text/javascript">
	
	
</script>

<style scoped>	
p {
	font-size: 2em;
	text-align: center;
}
</style>

-->