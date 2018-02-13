<template>
	<div>
	<div class="jumbotron">
			<h1>{{ title }}</h1>
		</div>


	<b-table striped hover :items="users" 
	  :fields="fieldsForUsers" :per-page="5" :current-page="currentTablePage">
	  	<template slot="blocked" slot-scope="row">
	  		{{row.item.blocked ? 'Yes' : 'No'}}
	    </template>
	  	<template slot="actions" slot-scope="row">
			<b-button v-if="isNotAdminAndNotBlocked(row.item)" v-on:click="setBlockPressed(row)" 
				variant="warning">Block</b-button>
			<b-button v-else-if="!row.item.admin" v-on:click="setUnblockPressed(row)" 
				variant="success">Unblock</b-button>
			<b-button v-on:click="showDetails(row.item)" 
				variant="primary">Details</b-button>
			<b-button v-if="!row.item.admin" v-on:click="deleteUser(row.item)"
			 variant="danger">Delete</b-button>
	    </template>
		<template slot="row-details" slot-scope="row">
	      <b-card>
    		<div v-if="blockPressed">
				<b-form-textarea 
					v-model="reasonBlocked"
					placeholder="Please, add a reason to block user."
                	:rows="2"
                	:max-rows="3"></b-form-textarea>
				<b-button variant="secondary" v-on:click="blockUser(currentUser)">Save</b-button>
			</div>

		<!--Mostra a area de texto para adicionar o motivo de desbloqueio do user -->
			<div v-if="unblockPressed">
				<b-form-textarea 
					v-model="reasonUnblocked"
					placeholder="Please, add a reason to unblock user."
                    :rows="2"
                    :max-rows="3"></b-form-textarea>
				<b-button variant="secondary" v-on:click="unblockUser(currentUser)">Save</b-button>
			</div>
	      </b-card>
	    </template>
	  </b-table>
	  <b-pagination :total-rows="users.length" :per-page="5" v-model="currentTablePage" class="my-0" />
		
		<!--
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
	</table>-->

<!--Mostra a area de texto para adicionar o motivo de bloqueio do user -->
	<!--<div v-if="blockPressed">
						<textarea 
						v-model="reasonBlocked"
						placeholder="Please, add a reason to block user."></textarea>
						<button type="button" class="close-btn" v-on:click="blockUser(currentUser)">Save</button>
	</div>-->

<!--Mostra a area de texto para adicionar o motivo de desbloqueio do user -->
	<!--<div v-if="unblockPressed">
						<textarea 
						v-model="reasonUnblocked"
						placeholder="Please, add a reason to unblock user."></textarea>
						<button type="button" class="close-btn" v-on:click="unblockUser(currentUser)">Save</button>
	</div>-->
	

  <b-alert v-if="showSuccess" show dismissible variant="success">
    {{ successMessage }}
  </b-alert>
  <b-alert v-if="showError" show dismissible variant="danger">
    {{ errorMessage }}
  </b-alert>

</div>
</template>

<script type="text/javascript">

	

	export default {
		name: 'UserList',
		props: ['users', 'user', 'serverIp'],
		data: function(){
			return { 
				title: 'List Users',
				detailsUser: null,
				showSuccess: false,
				showError: false,
		        successMessage: '',
		        blockPressed: false,
		        unblockPressed: false,
		        currentUser: null,
		        reasonBlocked: '',
		        reasonUnblocked: '',
		        fieldsForUsers: [
					{
						key: 'id',
						sortable: true
					},
					{
						key: 'name',
						sortable: true
					},
					{
						key: 'email',
						sortable: true
					},
					{
						key: 'nickname',
						sortable: true
					},
					{
						key: 'blocked',
						sortable: true
					},
					{
						key: 'actions',
						sortable: true
					}],
				currentTablePage: 1
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
	            	{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
	                	//Object.assign(this.user, response.data.data);
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
	            	{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
	                	//Object.assign(this.user, response.data.data);
	                	this.unblockedUser();
		                	console.log(response);
                		this.$emit('refresh-users');
	                });
	                this.unblockPressed = false;
	                this.currentUser = false;
	        },
            deleteUser: function(user){
            	//console.log(this.user.token)
            	//console.log(this.user)
            	this.axios.delete(this.serverIp + '/api/admin/users/' +user.id,  
	            	{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
	                	Object.assign(this.user, response.data.data);
	                	this.deletedUser();
		                	console.log(response);
                		this.$emit('refresh-users');
	                });
			},
			setBlockPressed(row){
				row.toggleDetails();
				this.blockPressed = true;
				this.currentUser = row.item;
		        this.reasonBlocked = '';

			},
			setUnblockPressed: function(row){
				row.toggleDetails();
				this.unblockPressed = true;
				this.currentUser = row.item;
		        this.reasonUnblocked = '';
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