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
	     <!--   <label v-else for="blocked">User not blocked.</label> -->
	</div>
	
	<div class="form-group">
	        <label for="reasonBlocked">Reason Blocked</label>
	        <input
	            type="text" class="form-control" v-model="user.reason_blocked"
	            name="reasonBlocked" id="reasonBlocked" disabled/>
	</div>
	</div>

<!-- nao esta a funcionar-->
	<div v-else-if="verifyReasonReactivated(user)" class="form-group">
		<div class="form-group">
		<label for="reasonReactivated">Reason Reactivated</label>
	        <input
	            type="text" class="form-control" v-model="user.reason_reactivated"
	            name="reasonReactivated" id="reasonReactivated" disabled/>
	</div>
	</div>
	
<!--
	 <a v-if="isNotAdminAndNotBlocked(user)" class="btn btn-xs btn-warning" v-on:click.prevent="setBlockPressed(user)">Block</a>
	 <a v-else-if="!user.admin" class="btn btn-xs btn-primary" v-on:click.prevent="setUnblockPressed(user)">Unblock</a>
	 <a v-if="!user.admin" class="btn btn-xs btn-danger" v-on:click.prevent="deleteUser(user)">Delete</a>
-->

	<b-button v-if="isNotAdminAndNotBlocked(user)" v-on:click="setBlockPressed(user)" 
		variant="warning">Block</b-button>
	<b-button v-else-if="!user.admin" v-on:click="setBlockPressed(user)" 
		variant="success">Unblock</b-button>
	<b-button v-if="!user.admin" v-on:click="deleteUser(user)" 
		variant="danger">Delete</b-button>


	 <div v-if="blockPressed">
	 	<!--TODOOOOOOOOOOOOOOOOOOOOOOOOOOO -->
	 	    <b-form-textarea 
                     v-model="reasonBlocked"
                     placeholder="Please, add a reason to block user."
                     :rows="3"
                     :max-rows="6">
    		</b-form-textarea>
						<button type="button" class="close-btn" v-on:click="blockUser(currentUser)">Save</button>
	</div>

	<div v-if="unblockPressed">
						<textarea 
						v-model="reasonUnblocked"
						placeholder="Please, add a reason to unblock user."></textarea>
						<button type="button" class="close-btn" v-on:click="unblockUser(currentUser)">Save</button>
	</div>

	<div class="alert alert-success" v-if="showSuccess">
					<button type="button" class="close-btn" v-on:click="showSuccess=false">&times;</button>
					<strong>{{ successMessage }}</strong>
	</div>

	</div>
</template>


<script type="text/javascript">
	export default {
		name: 'UserDetails',
		props: ['user'],
		data: function(){
			return { 
				/*user: {
					name: '',
					nickname: '',
					email: '',
					blocked: '',
					reason_blocked: '',
					reason_reactivated: '',
					total_points: '',
					total_games_played: ''
			
				}*/
				blockPressed: false,
				unblockPressed: false,
				reasonBlocked: '',
				reasonUnblocked: '',
				showSuccess: false,
				successMessage: '',
				currentUser: null,
				//isReasonReactivatd: false
		}
	},
	methods: {
		blockUser: function(user){
            	this.axios.put('http://localhost:7555/api/admin/block/user/' +user.id, 
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
            	this.axios.put('http://localhost:7555/api/admin/unblock/user/' +user.id,
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
            	this.axios.delete('http://localhost:7555/api/admin/delete/user/' +user.id,  
	            	{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
	                	Object.assign(this.user, response.data.data);
	                	this.deletedUser();
		                	console.log(response);
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
	        //	console.log(user.id, user.admin);
          		return !user.blocked && !user.admin == 1 ;
      		}
	}
}
	</script>
