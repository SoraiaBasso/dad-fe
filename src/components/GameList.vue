<template>
	<div>
	<div class="jumbotron">
			<h1>{{ title }}</h1>
		</div>
		
	<table class="table table-striped">
	    <thead>
	        <tr>
	        	<th>Id</th>
	            <th>Total players</th>
	            <th>Created by</th>
	            <th>Created at</th>
	            <th>Actions</th>
	        </tr>
	    </thead>
	    <tbody>
	        <tr v-for="game in pendingGames"  :key="game.id"> 

	        	<td>{{ game.id }}</td>
	            <td>{{ game.total_players }}</td>
	            <td>{{ game.created_by.nickname }}</td>
	            <td>{{ game.created_at | formatDate }}</td> 

  				<b-button variant="success" 
  					v-if="isCreator(game.created_by.nickname)"
  					:disabled="game.total_players < 4" 
	            	v-on:click="startGame(game.id)">Start Game</b-button>
  				<b-button variant="warning" 
  					v-if="isCreator(game.created_by.nickname)"
	            	v-on:click="removeGame(game.id)">Remove Game</b-button>
	            <b-button variant="primary" 
	            	v-else-if="isJoined(game.users)" 
	            	disabled
	            	>Joined</b-button>
				<b-button variant="danger" 
	            	v-else-if="game.total_players == 4"
	            	disabled>Game Full</b-button>
				<b-button variant="primary" 
	            	v-else 
	            	v-on:click="joinGame(game.id)">Join Game</b-button>
	        </tr>
	    </tbody>
	</table>

</div>
</template>

<script type="text/javascript">

	export default {
		name: 'GameList',
		props: ['pendingGames', 'user'],
		data: function(){
			return { 
				title: 'Games'
			}
		}, methods: {
	        isCreator: function(creatorNickname){
	        	return creatorNickname === this.user.nickname;
	        },
	        isJoined: function(users){
	        	for (let i = 0; i < users.length; i++){
	        		let user = users[i];
	        		if(this.user.id == user.id){
	        			return true;
	        		}
	        	}
	        	return false;
	        },
	        joinGame: function(gameId){
	        	this.$root.joinGame(gameId);
	        },
	        startGame: function(gameId){
	        	this.$root.startGame(gameId);
	        },
	        removeGame: function(gameId){
	        	this.$root.removeGame(gameId);
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