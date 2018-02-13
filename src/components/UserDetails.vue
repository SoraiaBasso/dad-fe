<template>
	<div>
		<div class="jumbotron">
		<h1>User Details: {{user.name}}</h1>

		</div>

	<div class="form-group">
	        <label for="nickname">Nickname</label>
	        <input
	            type="text" class="form-control" v-model="user.nickname"
	            name="nickname" id="nickname" disabled/>
	</div>

	<div class="form-group">
	        <label for="email">Email</label>
	        <input
	            type="text" class="form-control" v-model="user.email"
	            name="email" id="nickname" disabled/>
	</div>

	<div class="form-group">
	        <label for="totalPoints">Total Points</label>
	        <input
	            type="text" class="form-control" v-model="user.total_points"
	            name="totalPoints" id="totalPoints" disabled/>
	</div>

	<div class="form-group">
	        <label for="totalGamesPlayed">Total Games Played</label>
	        <input
	            type="text" class="form-control" v-model="user.total_games_played"
	            name="totalGamesPlayed" id="totalGamesPlayed" disabled/>
	</div>

	<div v-if="user.blocked" class="form-group">
		<div class="form-group">
	        <label  for="blocked">User is currently blocked.</label>
	</div>
	
	<div class="form-group">
	        <label for="reasonBlocked">Reason Blocked</label>
	        <input
	            type="text" class="form-control" v-model="user.reason_blocked"
	            name="reasonBlocked" id="reasonBlocked" disabled/>
	</div>
	</div>

	<div v-else-if="verifyReasonReactivated(user)" class="form-group">
		<div class="form-group">
		<label for="reasonReactivated">Reason Reactivated</label>
	        <input
	            type="text" class="form-control" v-model="user.reason_reactivated"
	            name="reasonReactivated" id="reasonReactivated" disabled/>
	</div>
	</div>


	<b-button v-if="isNotAdminAndNotBlocked(user)" v-on:click="setBlockPressed(user)" 
		variant="warning">Block</b-button>
	<b-button v-else-if="!user.admin" v-on:click="setUnblockPressed(user)" 
		variant="success">Unblock</b-button>
	<b-button v-if="!user.admin" v-on:click="deleteUser(user)" 
		variant="danger">Delete</b-button>


	 <div v-if="blockPressed">
	 	    <b-form-textarea 
                     v-model="reasonBlocked"
                     placeholder="Please, add a reason to block user."
                     :rows="2"
                     :max-rows="3">
    		</b-form-textarea>
			<b-button variant="secondary" v-on:click="blockUser(currentUser)">Save</b-button>
	</div>

	<div v-if="unblockPressed">
 	    <b-form-textarea 
                 v-model="reasonUnblocked"
                 placeholder="Please, add a reason to unblock user."
                 :rows="2"
                 :max-rows="3">
		</b-form-textarea>
		<b-button variant="secondary" v-on:click="unblockUser(currentUser)">Save</b-button>
	</div>

	

	  <b-alert v-if="showSuccess" show dismissible variant="success">
	    {{ successMessage }}
	  </b-alert>
	  <b-alert v-if="showError" show dismissible variant="danger">
	    {{ errorMessage }}
	  </b-alert>
	</div>

	</div>
</template>


<script type="text/javascript">
	export default {
		name: 'UserDetails',
		props: ['user', 'serverIp', 'loggedUser'],
		data: function(){
			return { 
				blockPressed: false,
				unblockPressed: false,
				reasonBlocked: '',
				reasonUnblocked: '',
				showSuccess: false,
				successMessage: '',
				showError: false,
				errorMessage: '',
				currentUser: null,
				//isReasonReactivatd: false
		}
	},
	methods: {
		blockUser: function(user){
            	if(!this.reasonBlocked){
            		this.showError = true;
            		this.errorMessage = 'You must fill a reason!';
            		return;
            	}
            	this.axios.put(this.serverIp + '/api/admin/users/block/' +user.id, 
            		{reason_blocked: this.reasonBlocked}, 
	            	{ headers: { Authorization: "Bearer " + this.loggedUser.token } })
	                .then(response=>{
	                	this.blockedUser();
		                console.log(response);
		                this.$emit('refresh-users');
	                });
	                this.blockPressed = false;
	                this.currentUser = null;

	               
            },
            unblockUser: function(user){
            	if(!this.reasonUnblocked){
            		this.showError = true;
            		this.errorMessage = 'You must fill a reason!';
            		return;
            	}
            	this.axios.put(this.serverIp + '/api/admin/users/unblock/' +user.id,
            		{reason_reactivated: this.reasonUnblocked},  
	            	{ headers: { Authorization: "Bearer " + this.loggedUser.token } })
	                .then(response=>{
	                	
	                	this.unblockedUser();
		                console.log(response);
		                this.$emit('refresh-users');
	                });
	                this.unblockPressed = false;
	                this.currentUser = false;
	        },
	        deleteUser: function(user){
            	this.axios.delete(this.serverIp + '/api/admin/users/' +user.id,  
	            	{ headers: { Authorization: "Bearer " + this.loggedUser.token } })
	                .then(response=>{
	                	Object.assign(this.user, response.data.data);
	                	this.deletedUser();
	                	console.log(response);
	                	this.$emit('refresh-users');
	                });
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
			deletedUser: function(){
	            this.showSuccess = true;
	            this.successMessage = 'User Deleted';
	        },
	        verifyReasonReactivated: function(user){
	        	if(user.reason_reactivated === null){
	        		return true;
	        	}
	        },
	        isNotAdminAndNotBlocked: function(user){
          		return !user.blocked && !user.admin == 1 ;
      		}
	}
}
	</script>
