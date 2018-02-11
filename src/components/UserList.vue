<template>
	<div>
	<div class="jumbotron">
			<h1>{{ title }}</h1>
		</div>
		
	<table class="table table-striped">
	    <thead>
	        <tr>
	        	<th>Id</th>
	            <th>Name</th>
	            <th>Email</th>
	            <th>Nickname</th>
	            <th>Blocked</th>
	            <th>Actions</th>
	        </tr>
	    </thead>
	    <tbody>
	        <tr v-for="user in users"  :key="user.id" :class="{activerow: detailsUser === user}">
	        	<td>{{ user.id }}</td>
	            <td>{{ user.name }}</td>
	            <td>{{ user.email }}</td>
	            <td>{{ user.nickname }}</td>
	            <td v-if="user.blocked">Yes</td> 
	            <td v-else>No</td>

	            <td>
	            	<!--
	                <a v-if="isNotAdminAndNotBlocked(user)" class="btn btn-xs btn-warning" v-on:click.prevent="setBlockPressed(user)">Block</a>
	                <a v-else-if="!user.admin" class="btn btn-xs btn-primary" v-on:click.prevent="setUnblockPressed(user)">Unblock</a>
	                
	                <a class="btn btn-xs btn-primary" v-on:click.prevent="showDetails(user)">Details</a>
	                <a v-if="!user.admin" class="btn btn-xs btn-danger" v-on:click.prevent="deleteUser(user)">Delete</a>
					-->

					<b-button v-if="isNotAdminAndNotBlocked(user)" v-on:click="setBlockPressed(user)" 
						variant="warning">Block</b-button>
					<b-button v-else-if="!user.admin" v-on:click="setUnblockPressed(user)" 
						variant="success">Unblock</b-button>
					<b-button v-on:click="showDetails(user)" 
						variant="primary">Details</b-button>
					<b-button v-if="!user.admin" v-on:click="deleteUser(user)"
					 variant="danger" >Delete</b-button>
	            </td>
	        </tr>
	    </tbody>
	</table>

<!--Mostra a area de texto para adicionar o motivo de bloqueio do user -->
	<div v-if="blockPressed">
						<textarea 
						v-model="reasonBlocked"
						placeholder="Please, add a reason to block user."></textarea>
						<button type="button" class="close-btn" v-on:click="blockUser(currentUser)">Save</button>
	</div>

<!--Mostra a area de texto para adicionar o motivo de bloqueio do user -->
	<div v-if="unblockPressed">
						<textarea 
						v-model="reasonUnblocked"
						placeholder="Please, add a reason to unblock user."></textarea>
						<button type="button" class="close-btn" v-on:click="unblockUser(currentUser)">Save</button>
	</div>
	

  <b-alert v-if="showSuccess" show dismissible variant="success">
    {{ successMessage }}
  </b-alert>

</div>
</template>

<script type="text/javascript">

	

	export default {
		name: 'UserList',
		props: ['users', 'user', 'serverIp'],
		data: function(){
			return { 
				/*user: {
					name: '',
					nickname: '',
					email: '',
					blocked: '',
					admin: 0
			
				},*/
				title: 'List Users',
				detailsUser: null,
				showSuccess: false,
		        successMessage: '',
		        blockPressed: false,
		        unblockPressed: false,
		        currentUser: null,
		        reasonBlocked: '',
		        reasonUnblocked: ''
			}
		},


//TODO - nos metodos block e unblock e delete impedir que o admin possa fazer isso a ele pp

        methods: {
            blockUser: function(user){
            	this.axios.put(this.serverIp + '/api/admin/block/user/' +user.id, 
            		{reason_blocked: this.reasonBlocked}, 
	            	{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
	                	//Object.assign(this.user, response.data.data);
	                	this.blockedUser();
		                	console.log(response);
	                });
	                this.blockPressed = false;
	                this.currentUser = null;
	               
            },
            unblockUser: function(user){
            	this.axios.put(this.serverIp + '/api/admin/unblock/user/' +user.id,
            		{reason_reactivated: this.reasonUnblocked},  
	            	{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
	                	//Object.assign(this.user, response.data.data);
	                	this.unblockedUser();
		                	console.log(response);
	                });
	                this.unblockPressed = false;
	                this.currentUser = false;
	        },
            deleteUser: function(user){
    /*        	this.axios.interceptors.request.use(request => {
  console.log('Starting Request', request)
  return request
})*/
            	console.log(this.user.token)
            	console.log(this.user)
            	this.axios.delete(this.serverIp + '/api/admin/delete/user/' +user.id,  
	            	{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
	                	Object.assign(this.user, response.data.data);
	                	this.deletedUser();
		                	console.log(response);
	                });

                //this.$emit('delete-click', user);
			},
			setBlockPressed(user){
				this.blockPressed = true;
				this.currentUser = user;

			},
			setUnblockPressed: function(user){
				this.unblockPressed = true;
				this.currentUser = user;
			},
			blockedUser: function(){
				this.showSuccess = true;
	            this.successMessage = 'User Blocked';
			},
			unblockedUser: function(){
				this.showSuccess = true;
	            this.successMessage = 'User Unblocked';
			},
			showDetails: function(user){
				this.detailsUser = user;
                this.$emit('details-click', user);
	        },
			deletedUser: function(){
	            this.showSuccess = true;
	            this.successMessage = 'User Deleted';
	        },
	        isNotAdminAndNotBlocked: function(user){
	        //	console.log(user.id, user.admin);
          		return !user.blocked && !user.admin == 1 ;
      		}
        }		
	}
</script>

<style scoped>
	tr.activerow {
  		background: #123456  !important;
  		color: #fff          !important;
}

</style>