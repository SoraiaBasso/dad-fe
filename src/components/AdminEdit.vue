<template>
	<div class="jumbotron">
	    <h1>Admin Area</h1>

	</br>
	<h3>Administrator Details</h3>
	    <div class="form-group">
	        <label for="inputNickname">Nickname</label>
	        <input
	            type="text" class="form-control" v-model="adminUpdated.nickname"
	            name="nickname" id="inputNickname" 
	            placeholder="Nickname"/>
	    </div>

	    <div class="form-group">
	        <label for="inputEmail">Administrator Email</label>
	        <input v-validate="'required|email'" :class="{'input': true, 'is-danger': errors.has('email') }"
	            type="email" class="form-control" v-model="adminUpdated.email"
	            name="email" id="inputEmail"
	            placeholder="Adminstrator email"/>
	             <span v-show="errors.has('email')" class="text-danger">{{ errors.first('email') }}</span>

	    </div>

		<b-button variant="secondary" v-on:click.prevent="showChangePassword()">Change Password</b-button>

		<div v-if="isChangePassword" class="form-group">
	        <label for="oldPassword">Current Password</label>
	        <input v-validate="'required'"
	            type="password" class="form-control" v-model="oldPassword"
	            name="oldPassword" id="oldPassword" 
	            placeholder="Current Password"/>
	            <span v-show="errors.has('oldPassword')" class="text-danger">{{ errors.first('oldPassword') }}</span>
	    </div>

	    <div v-if="isChangePassword" class="form-group">
	        <label for="newPassword">New Password</label>
	        <input v-validate="'required'"
	            type="password" class="form-control" v-model="newPassword"
	            name="newPassword" id="newPassword" 
	            placeholder="Nem Password"/>
	            <span v-show="errors.has('newPassword')" class="text-danger">{{ errors.first('newPassword') }}</span>
	    </div>

	    <div v-if="isChangePassword" class="form-group">
	        <label for="password_confirmation">Password Confirmation</label>
	        <input v-validate="'required|confirmed:newPassword'"
	            type="password" class="form-control"
	            name="password_confirmation" id="password_confirmation" 
	            placeholder="Confirm Password"/>
	            <span v-show="errors.has('password_confirmation')" class="text-danger">{{ errors.first('password_confirmation') }}</span>
	    </div> 

		</br>
		</br>
	<h3>Platform Details</h3>
	<!--Alterar o email da plataforma -->
		<div class="form-group">
	        <label for="inputPlatformEmail">Platform Email</label>
	        <input v-validate="'required|email'" :class="{'input': true, 'is-danger': errors.has('platformEmail') }"
	            type="email" class="form-control" v-model="config.platform_email"
	            name="platformEmail" id="inputPlatformEmail"
	            placeholder="Platform email"/>
	             <span v-show="errors.has('platformEmail')" class="text-danger">{{ errors.first('platformEmail') }}</span>

	    </div>

	    <div class="alert alert-success" v-if="showSuccess">
			 
			<button type="button" class="close-btn" v-on:click="showSuccess=false">&times;</button>
			<strong>{{ successMessage }}</strong>
		</div>

	    <div class="form-group">
	    	<a class="btn btn-primary" v-on:click.prevent="saveUser()">Save Changes</a>
	        <a class="btn btn-warning" v-on:click.prevent="cancelEdit()">Cancel</a>
	    </div>


<!--************************************FEEDBACK*************************************-->	    
	    <div class="alert alert-success" v-if="showSuccess">
			 
			<button type="button" class="close-btn" v-on:click="showSuccess=false">&times;</button>
			<strong>{{ successMessage }}</strong>
		</div>


	    </div> 

	</div>
	</div>
</template>

<script type="text/javascript">
	export default {
		name: 'AdminEdit',
		props: ['user', 'serverIp'],
		data: function(){
			return { 
				adminUpdated: {
						nickname: '',
						email: '',
				
					},
				config: {
				platform_email: ''
				},
				oldPassword: '',
				newPassword: '',
				showSuccess: false,
		        successMessage: '',
		        isChangePassword: false,
				showError: false
			}
			
		},
	    methods: {
	        saveUser: function(){
	            this.axios.put(this.serverIp +'/api/admin/' +this.user.id,
	            	this.adminUpdated,  
	            	{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{

	                	this.savedUser();
	                	this.user.nickname = this.adminUpdated.nickname;
	                	this.user.email = this.adminUpdated.email;

		                //console.log(response);
	                });
	                if(this.isChangePassword){

		            this.axios.put(this.serverIp +'/api/admin/password/' +this.user.id,
		            	{oldPassword: this.oldPassword, newPassword: this.newPassword},
	            		{ headers: { Authorization: "Bearer " + this.user.token } })
		                .then(response=>{
		                	this.savedUser();

		                	console.log(response);
		                });
	                }
	        },
	        savedUser: function(){
	            this.showSuccess = true;
	            this.successMessage = 'Changes have been saved.';
	        },
	        showChangePassword: function(){
	        	this.isChangePassword = !this.isChangePassword;
	        },
	        getConfigDetails: function(){
	        	this.axios.get(this.serverIp + '/api/admin/config/details', 
					{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{

	                	Object.assign(this.config, response.data);
	                	
	                	console.log(response.data);
	                	//console.log(this.config.platform_email);
	                });
	        },
	        cancelEdit: function(){
	            this.$router.push('/');
	        }
		}, 
		mounted() {
			this.getConfigDetails();
			Object.assign(this.adminUpdated, this.user);

		}

	}
</script>

<style scoped>	

</style>