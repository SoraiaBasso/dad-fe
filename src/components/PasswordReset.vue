<template>
	<div class="jumbotron">
	    <h2>Password reset</h2>

	    <div class="form-group">
	        <label for="password">New Password</label>
	        <input v-validate="'required'" 
	            type="password" class="form-control" v-model="password"
	            name="password" id="password" 
	            placeholder="Password"/>
	        <span v-show="errors.has('password')" class="text-danger">{{ errors.first('password') }}</span>
	    </div>

	    <div class="form-group">
	        <label for="passwordConfirmation">Password Confirmation</label>
	        <input v-validate="'required|confirmed:password'"
	            type="password" class="form-control" v-model="passwordConfirmation"
	            name="passwordConfirmation" id="passwordConfirmation" 
	            placeholder="Password"/>
	        <span v-show="errors.has('passwordConfirmation')" class="text-danger">
	        {{ errors.first('passwordConfirmation') }}</span>
	    </div>

	    <div class="form-group">
			<b-button variant="primary" v-on:click="changePassword()">Change Password</b-button>
	    </div>


	  <b-alert v-if="showError" show dismissible variant="danger">
	    {{ errorMessage }}
	  </b-alert>

	</div>		
</template>

<script type="text/javascript">
	export default {
		name: 'PasswordReset',
		props: ['serverIp'],
		data: function(){
			return { 
				password: '',
				passwordConfirmation: '',
				resetToken: '',
				showError: false,
				errorMessage: ''
				}
		},
	    methods: {
	        changePassword: function(){
	        	console.log(this.resetToken)


	            this.axios.post(this.serverIp + '/changePassword', 
	            {token: this.resetToken, password: this.password})
	                .then(response=>{
	                	console.log(response);

	                	this.$router.push('/login');

	           

	                }).catch(error => {
						console.log(error.response);
						this.showError = true;
						if(error.response){
							if(error.response.data.message){
								this.errorMessage = error.response.data.message;	
							}else{
								this.errorMessage = "Code: " + error.response.status 
								+ ", Message: " + error.response.statusText;
							}
						}else{
							this.errorMessage = "Sorry, something seems to be wrong. Try again later.";	
						}
	                });
	        }
		},
        created() {
            this.resetToken = this.$route.params.resetToken;
        }
    }
	
</script>