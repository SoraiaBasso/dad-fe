<template>
	<div>
		<user-list :users="users" :user="user" :serverIp="serverIp" @details-click="detailsUser" @delete-click="deleteUser" @message="childMessage" 
		@refresh-users="getUsers" ref="usersListRef"></user-list>


	  <b-alert v-if="showSuccess" show dismissible variant="success">
	    {{ successMessage }}
	  </b-alert>

		<user-details :user="currentUser" :loggedUser="user" 
		:serverIp="serverIp" v-if="currentUser"
		@refresh-users="getUsers"></user-details>	

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
	            this.getUsers();
	        },
	        cancelEdit: function(){
	            this.currentUser = null;
	            this.$refs.usersListRef.editingUser = null;
	            this.showSuccess = false;
	        },
	        getUsers: function(){
				this.axios.get(this.serverIp +'/api/users', 
					{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
	                	
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
