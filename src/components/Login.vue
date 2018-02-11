<template>
	<div class="jumbotron">
	    <h2>Login</h2>

	    <div class="form-group">
	        <label for="inputLogin">Login</label>
	        <input v-validate="'required'" 
	            type="text" class="form-control" v-model="login"
	            name="login" id="inputLogin" 
	            placeholder="Nickname or Email"/>
	        <span v-show="errors.has('login')" class="text-danger">{{ errors.first('login') }}</span>
	    </div>

	    <div class="form-group">
	        <label for="password">Password</label>
	        <input v-validate="'required'" 
	            type="password" class="form-control" v-model="password"
	            name="password" id="password" 
	            placeholder="Password"/>
	        <span v-show="errors.has('password')" class="text-danger">{{ errors.first('password') }}</span>
	    </div>

	    <div class="form-group">
			<b-button variant="primary" v-on:click="doLogin()">Login</b-button>
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
				showError: false,
		        errorMessage: ''
				}
		},
	    methods: {
	        doLogin: function(){
	            this.axios.post(this.serverIp +'/login', 
	            	{username: this.login, password: this.password})
	                .then(response=>{
	                	console.log(response);
	                	console.log(this.user);
	                	console.log(response.date);
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
		},
	}
</script>