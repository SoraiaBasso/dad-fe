<template>
	<div class="jumbotron">
	    <h2>Edit User</h2>
	    <div class="form-group">
	        <label for="inputName">Name</label>
	        <input
	            type="text" class="form-control" v-model="userUpdated.name"
	            name="name" id="inputName" 
	            placeholder="Fullname"/>
	    </div>
	    <div class="form-group">
	        <label for="inputNickname">Nickname</label>
	        <input
	            type="text" class="form-control" v-model="userUpdated.nickname"
	            name="nickname" id="inputNickname" 
	            placeholder="Nickname"/>
	    </div>

	    <div class="form-group">
	        <label for="inputEmail">Email</label>
	        <input v-validate="'required|email'" :class="{'input': true, 'is-danger': errors.has('email') }"
	            type="email" class="form-control" v-model="userUpdated.email"
	            name="email" id="inputEmail"
	            placeholder="Email address"/>
	             <span v-show="errors.has('email')" class="text-danger">{{ errors.first('email') }}</span>

	    </div>

	    <div class="form-group">
			<b-button variant="secondary" v-on:click="showChangePassword()">Change Password</b-button>
	    </div>

	    <div v-if="isChangePassword" class="form-group">
	        <label for="password">Password</label>
	        <input v-validate="'required'"
	            type="password" class="form-control" v-model="password"
	            name="password" id="password" 
	            placeholder="Password"/>
	            <span v-show="errors.has('password')" class="text-danger">{{ errors.first('password') }}</span>
	    </div>

	    <div v-if="isChangePassword" class="form-group">
	        <label for="password_confirmation">Password Confirmation</label>
	        <input v-validate="'required|confirmed:password'"
	            type="password" class="form-control"
	            name="password_confirmation" id="password_confirmation" 
	            placeholder="Password"/>
	            <span v-show="errors.has('password_confirmation')" class="text-danger">{{ errors.first('password_confirmation') }}</span>
	    </div> 

		<div class="alert alert-success" v-if="showSuccess">
			 
			<button type="button" class="close-btn" v-on:click="showSuccess=false">&times;</button>
			<strong>{{ successMessage }}</strong>
		</div>

	    <div class="form-group">
			<b-button variant="primary" v-on:click="saveUser()">Save Changes</b-button>
			<b-button variant="danger" v-on:click="deleteUser()">Delete Account</b-button>
			<b-button variant="warning" v-on:click="cancelEdit()">Cancel</b-button>
	    </div>
	</div>
</template>

<script type="text/javascript">
	export default {
		name: 'UserEdit',
		props: ['user', 'serverIp'],
		data: function(){
			return { 
			userUpdated: {
					name: '',
					nickname: '',
					email: '',
			
				},
				password: '',
				showSuccess: false,
		        successMessage: '',
		        isChangePassword: false
			}
		},
	    methods: {
	        saveUser: function(){
	            this.axios.put(this.serverIp + '/api/users/' +this.user.id,
	            	this.userUpdated,  
	            	{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
	                	this.savedUser();
	                	this.user.name = this.userUpdated.name;
	                	this.user.nickname = this.userUpdated.nickname;
	                	this.user.email = this.userUpdated.email;


		                console.log(response);

	                });
	                if(this.isChangePassword){
		            this.axios.put(this.serverIp + '/api/users/password/' +this.user.id,
		            	{password: this.password},
	            		{ headers: { Authorization: "Bearer " + this.user.token } })
		                .then(response=>{
		                	
		                	console.log(response);
		                });
	                }
	        },
	        savedUser: function(){
	            this.showSuccess = true;
	            this.successMessage = 'User Saved';
	        },
	        deletedUser: function(){
	        	this.user.id = 0;
			    this.user.name = '';
			    this.user.nickname = '';
			    this.user.email = '';
			    this.user.admin = 0;
			    this.user.token = null

	            this.$router.push('/login');
	            alert('User Deleted!');

	        },
	        showChangePassword: function(){
	        	this.isChangePassword = !this.isChangePassword;
	        },
	        deleteUser(){
	        	this.axios.delete(this.serverIp + '/api/users/' +this.user.id,  
	            	{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
	                	Object.assign(this.user, response.data.data);
	                	this.deletedUser();
		                	console.log(response);
	                });
	        },
	        cancelEdit: function(){
	            this.$router.push('/');
	        },
	        getUserByToken: function(){
	        	this.axios.get(this.serverIp + '/api/user/'+this.user.token, 
					{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
	                	Object.assign(this.user, response.data);
	                	console.log(response);
	                });
	        }
		},
		mounted() {
			Object.assign(this.userUpdated, this.user);
		}

	}
</script>

<style scoped>	

</style>