<template>
	<div class="jumbotron">
	    <h2 v-if="!isForgotPasswordPressed">Login</h2>
	    <h2 v-else>Password reset</h2>

	    <div v-if="!isForgotPasswordPressed" class="form-group">
	        <label for="inputLogin">Login</label>
	        <input v-validate="'required'" 
	            type="text" class="form-control" v-model="login"
	            name="login" id="inputLogin" 
	            placeholder="Nickname or Email"/>
	        <span v-show="errors.has('login')" class="text-danger">{{ errors.first('login') }}</span>
	    </div>

	    <div v-if="!isForgotPasswordPressed" class="form-group">
	        <label for="password">Password</label>
	        <input v-validate="'required'" 
	            type="password" class="form-control" v-model="password"
	            name="password" id="password" 
	            placeholder="Password"/>
	        <span v-show="errors.has('password')" class="text-danger">{{ errors.first('password') }}</span>
	    </div>

	    <div v-if="!isForgotPasswordPressed" class="form-group">
			<b-button variant="primary" v-on:click="doLogin()">Login</b-button>
	    </div>

	    <div v-if="!isForgotPasswordPressed" class="form-group">
			<b-button variant="warning" v-on:click="forgotPassword()">I forgot my password!</b-button>
	    </div>

	    <div v-if="isForgotPasswordPressed" class="form-group">
	        <label for="inputRecuperationEmail">Email</label>
	        <input v-validate="'required|email'" 
	            type="email" :class="{'input': true, 'is-danger': errors.has('email') } + ' form-control'"
	            v-model="recuperationEmail"
	            name="recuperationEmail" id="inputRecuperationEmail" 
	            placeholder="Insert your email address"/>
	        <span v-show="errors.has('inputRecuperationEmail')" class="text-danger">{{ errors.first('inputRecuperationEmail') }}</span>
	        <b-button variant="warning" v-on:click="resetPassword(recuperationEmail)">Reset password!</b-button>
	    </div>


	  <b-alert v-if="showError" show dismissible variant="danger">
	    {{ errorMessage }}
	  </b-alert>

	</div>		
</template>

<script type="text/javascript">
	export default {
		name: 'Login',
		props: ['user', 'serverIp'],
		data: function(){
			return { 
				login: '',
				password: '',
				recuperationEmail: '',
				showError: false,
		        errorMessage: '',
		        isForgotPasswordPressed: false
				}
		},
	    methods: {
	        doLogin: function(){
	            this.axios.post(this.serverIp +'/login', 
	            	{username: this.login, password: this.password})
	                .then(response=>{
	                	console.log(response);
	                	console.log(this.user);
	                	console.log(response.data);
	                	Object.assign(this.user, response.data);
	                	//window.token = response.data.token; //O window é para a variavel ser global
	                	this.user.token = response.data.token;

	                	//Linha 26 do App.vue. Emite o event is-logged e faz o metodo que la esta
	                	this.$emit('is-logged', true);
	                	//o push faz com que se vá para aquela rota
	                	this.$root.saveUser(this.user);

	                	this.$root.initSocket();

	                	this.$router.push('/');

	                	
	                }).catch(error => {
						console.log(error);
						this.showError = true;
						console.log(error.response);
						console.log(error.data);

						if(error.response){
							if(error.response.data.message){
								this.errorMessage = error.response.data.message;	
							}else{
								this.errorMessage = "Code: " + error.response.status 
								+ ", Message: " + error.response.statusText;
							}	
						}
						
					});
	        },
	        resetPassword: function(recuperationEmail){
	        	this.axios.post(this.serverIp +'/password/reset',
	        		{email: recuperationEmail}).then(response=>{

	        		console.log('Password RESET RECEIVED FIELDS');
	        		console.log(response.data);


	        	}).catch(error => {
						console.log(error);
						this.showError = true;
						if(error.response){
							if(error.response.data.message){
								this.errorMessage = error.response.data.message;	
							}else{
								this.errorMessage = "Code: " + error.response.status 
								+ ", Message: " + error.response.statusText;
							}	
						}
						
					});
	        	},
	        forgotPassword: function(){

		        	if(this.isForgotPasswordPressed){
		        		this.isForgotPasswordPressed = false;
		        	} else {
		        		this.isForgotPasswordPressed = true;
		        	}
		        	
	        	}
	        },
	        mounted() {
	        }
		}
	
</script>