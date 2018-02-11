<template>
	<div class="jumbotron">
	    <h2>Create User</h2>
	    <div class="form-group">
	        <label for="inputName">Name</label>
	        <input
	            type="text" class="form-control" v-model="user.name"
	            name="name" id="inputName" 
	            placeholder="Fullname"/>
	    </div>

	    <div class="form-group">
	        <label for="inputNickname">Nickname</label>
	        <input
	            type="text" class="form-control" v-model="user.nickname"
	            name="nickname" id="inputNickname" 
	            placeholder="Nickname"/>
	    </div>

	    <div class="form-group">
	        <label for="password">Password</label>
	        <input v-validate="'required'" 
	            type="password" class="form-control" v-model="user.password"
	            name="password" id="password" 
	            placeholder="Password"/>
	        <span v-show="errors.has('password')" class="text-danger">{{ errors.first('password') }}</span>
	    </div>

	    <div class="form-group">
	        <label for="password_confirmation">Password Confirmation</label>
	        <input v-validate="'required|confirmed:password'"
	            type="password" class="form-control" v-model="user.password_confirmation"
	            name="password_confirmation" id="password_confirmation" 
	            placeholder="Password"/>
	        <span v-show="errors.has('password_confirmation')" class="text-danger">{{ errors.first('password_confirmation') }}</span>
	    </div>

	    <div class="form-group">
	        <label for="inputEmail">Email</label>
	        <input v-validate="'required|email'" :class="{'input': true, 'is-danger': errors.has('email') }"
	            type="email" class="form-control" v-model="user.email"
	            name="email" id="inputEmail"
	            placeholder="Email address"/>
	        <span v-show="errors.has('email')" class="text-danger">{{ errors.first('email') }}</span>

	    </div>

	    <div class="alert alert-success" v-if="showSuccess">
			 
			<button type="button" class="close-btn" v-on:click="showSuccess=false">&times;</button>
			<strong>{{ successMessage }}</strong>
		</div>

	    <div class="alert alert-danger" v-if="showError">
			 
			<button type="button" class="close-btn" v-on:click="showError=false">&times;</button>
			<strong>{{ errorMessage }}</strong>
		</div>

	    <div class="form-group">
	        <a class="btn btn-primary" v-on:click.prevent="saveUser()">Save</a>
	       
<!--
	        <a class="btn btn-default" v-on:click.prevent="cancelEdit()">Cancel</a> -->
	    </div>
	</div>
</template>

<script type="text/javascript">
	export default {
		name: 'UserCreate',
		props: ['serverIp'],
		data: function(){
			return { 
				user: {
					name: '',
					nickname: '',
					email: '',
					password: ''
				},
				showSuccess: false,
		        successMessage: '',
				showError: false,
		        errorMessage: ''
			}
		},
	    methods: {
	        saveUser: function(){
	            this.axios.post(this.serverIp + '/api/users/create', this.user)
	                .then(response=>{
	                	console.log(response);

	                	this.showSuccess = true;
	            		this.successMessage = 'User Saved';

	           

	                }).catch(error => {
						console.log(error.response);
						this.showError = true;
						if(error.response.data.message){
							this.errorMessage = error.response.data.message;	
						}else{
							this.errorMessage = "Code: " + error.response.status 
							+ ", Message: " + error.response.statusText;
						}
	                });
	        }
	      /*  cancelEdit: function(){
	        	axios.get('api/users/'+this.user.id)
	                .then(response=>{
	                	// Copy object properties from response.data.data to this.user
	                	// without creating a new reference
	                	Object.assign(this.user, response.data.data);
	                	this.$emit('user-canceled', this.user);
	                });
	        }*/
		}
	}
</script>