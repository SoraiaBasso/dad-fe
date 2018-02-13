<template>
	<div>
	<div class="jumbotron">
			<h1>{{ title }}</h1>
			<h2 v-if="isLoggedIn">Welcome: {{user.name}}</h2>
			<h2><b-badge variant="warning">Total players: {{totalNumberPlayers}}</b-badge></h2>
			<h2><b-badge variant="warning">Total games played: {{totalGamesPlayed}}</b-badge></h2>
		</div>

<!-- Mostra a informação para o user que está logado-->
	<div v-if="isLoggedIn" class="form-group">
	        <h4>You have played <strong>{{user.total_games_played}}</strong> games!</h4>

	        <h4>You have won <strong>{{totalWins}} </strong> games, 
	        	lost <strong> {{totalLosts}} </strong> games 
	        	and draw <strong>{{totalDraws}} </strong>times!</h4>
	        <h4>Total Points: <strong>{{totalPoints}}</strong></h4>
	        <h4>Point Average: <strong>{{pointAverage}}</strong></h4>

	</div>
		
	</br>
	</br>


<!--mostra o top 5 com os jogadores com mais jogos-->
<h3>Top 5 players with more games played</h3>


	<table class="table table-striped " >
	    <thead>
	        <tr>
	        	<th>Position</th> <!--posicao do jogador de1 a 5 -->
	            <th>Nickname</th>
	            <th>Games played</th>
	        </tr>
	    </thead>
	    <tbody>
	        <tr v-for="user, key in newUsersByGames" :users="users" :key="user.id">
	        	<td >{{++key}}</td>  
	            <td>{{ user.nickname }}</td>
	            <td>{{ user.total_games_played }}</td>
	            
	        </tr>
	    </tbody>
	</table>

<!--mostra o top 5 com os jogadores com mais pontos-->
<h3>Top 5 players with more points</h3>

	<table class="table table-striped">
	    <thead>
	        <tr>
	        	<th>Position</th> 
	            <th>Nickname</th>
	            <th>Total points</th>
	        </tr>
	    </thead>
	    <tbody>
	        <tr v-for="user, key in newUsersByPoints" :users="users" :key="user.id">
	        	<td >{{++key}}</td>  
	            <td>{{ user.nickname }}</td>
	            <td>{{ user.total_points }}</td>
	            
	        </tr>
	    </tbody>
	</table>

<!--mostra o top 5 com os jogadores com mais pontos-->
<h3>Top 5 players by average</h3>

	<table class="table table-striped">
	    <thead>
	        <tr>
	        	<th>Position</th> 
	            <th>Nickname</th>
	            <th>Average</th>
	        </tr>
	    </thead>
	    <tbody>
	        <tr v-for="user, key  in newUsersByAverage" :users="users" :key="user.id">
	        	<td >{{++key}}</td>  
	            <td>{{ user.nickname }}</td>
	            <td>{{ user.avg }}</td>
	            
	        </tr>
	    </tbody>
	</table>

<!--SÓ PARA O ADMINISTRADOR-->

<!--lista de todos os jogadores com o total de jogos, vitorias, empates e derrotas-->

<div v-if="user && user.admin">
  <b-table striped hover :items="usersForAdmin" 
  :fields="fieldsForUsersForAdmin" :per-page="5" :current-page="currentTablePage"></b-table>
  <b-pagination :total-rows="usersForAdmin.length" :per-page="5" v-model="currentTablePage" class="my-0" />


  <div class="small">
    <line-chart v-if="gamesHistoryData" :chart-data="gamesHistoryData"></line-chart>
  </div>

</div>

	</div>
	
</template>


<script type="text/javascript">

	 import GamesHistory from '../charts/GamesHistory.js'


	export default {
		name: 'Statistics',
		props: ['user',  'isLoggedIn', 'serverIp'],
		//props: ['users'],
		components: {
	    	'line-chart': GamesHistory,
			
		},
		data: function(){
			return { 
				title: 'Statistics',
				users: [],
				usersForAdmin: [],
				totalNumberPlayers: 0,
				totalGamesPlayed: 0,
				newUsersByGames: [],
				newUsersByPoints: [],
				newUsersByAverage: [],
				totalWins: 0,
				totalLosts: 0,
				totalDraws: 0,
				totalPoints: 0,
				pointAverage: 0,
				fieldsForUsersForAdmin: [
					{
						key: 'id',
						sortable: true
					},
					{
						key: 'nickname',
						sortable: true
					},
					{
						key: 'totalGamesPlayed',
						sortable: true
					},
					{
						key: 'totalWins',
						sortable: true
					},
					{
						key: 'totalDraws',
						sortable: true
					},
					{
						key: 'totalLosts',
						sortable: true
					},
				],
				currentTablePage: 1,
        		gamesHistoryData: null
			}
		}, 
		methods: {
             listTopFiveUsersByNumOfGames: function(){
				this.axios.get(this.serverIp +'/api/statistics/topFiveByNumOfGames')
	                .then(response=>{

	                	this.users = response.data; 
	                	this.newUsersByGames = this.users.slice();

	                });
			},
			getTotalNumberOfPlayers: function(){
				this.axios.get(this.serverIp +'/api/statistics/numberOfPlayers')
	                .then(response=>{
	                	console.log('RESPOSTA numero de jogadores:')
	                	console.log(response.data)
	                	this.totalNumberPlayers = response.data.count;

	                	console.log(response.data)
	                });
			},
			getTotalGamesPlayed: function(){
				this.axios.get(this.serverIp +'/api/statistics/totalGamesPlayed')
	                .then(response=>{
	                	console.log(response.data)
	                	this.totalGamesPlayed = response.data.count;
	                });
			},
			getTopFiveUsersByPoints: function(){
				this.axios.get(this.serverIp +'/api/statistics/topFiveByPoints')
	                .then(response=>{
	                	this.users = response.data;
	                	this.newUsersByPoints = this.users.slice(); 
	                });
			},
			getTopFiveUsersByAverage: function(){
				this.axios.get(this.serverIp +'/api/statistics/topFiveByAverage')
	                .then(response=>{
						console.log("topFiveByAverage");
						console.log(response);

	                	this.users = response.data;
	                	this.newUsersByAverage = this.users.slice(); 

	                });
			}, //Métodos só para o utilizador autenticado
			getOwnTotalWins: function(){
				this.axios.get(this.serverIp + '/api/statistics/users/' + this.user.id + '/totalWins/',
							{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
						console.log("totalWins");
						console.log(response);

	                	this.totalWins = response.data.totalWins;
	                });
			},
			getOwnTotalLosts: function(){
				console.log('PEDIR O TOTAL DE DERROTAS...');
				this.axios.get(this.serverIp + '/api/statistics/users/' + this.user.id + '/totalLosses/',
							{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{

	                	console.log('totalLosts');
						console.log(response);
	                	this.totalLosts = response.data.totalLosts;
	                });
			},
			getOwnTotalDraws: function(){
				this.axios.get(this.serverIp + '/api/statistics/users/' + this.user.id + '/totalDraws/',
							{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{

	                	console.log('totalDraws');
						console.log(response);
	                	this.totalDraws = response.data.totalDraws;
	                });
			},
			getOwnTotalPoints: function(){
				this.axios.get(this.serverIp + '/api/statistics/users/'+ this.user.id + '/totalPoints/',
							{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{

	                	console.log('totalPoints');
						console.log(response);
	                	this.totalPoints = response.data.totalPoints;
	                });
			},
			getOwnPointAverage: function(){
				this.axios.get(this.serverIp + '/api/statistics/users/' + this.user.id + '/pointAverage/',
							{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{

	                	console.log('pointAverage');
						console.log(response);
	                	this.pointAverage = response.data.pointAverage;
	                });
			},//Métodos só para o admin
			getUsersForAdmin: function(){
				this.axios.get(this.serverIp + '/api/statistics/admin/usersStats',
							{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
	                	console.log('usersStats');
	                	console.log('usersStats');
	                	console.log('usersStats');
	                	console.log(response)
						this.usersForAdmin.splice(0, this.usersForAdmin.length);
						this.usersForAdmin.push.apply(this.usersForAdmin, response.data);
	                	
	                });
			},
			getGamesHistoryData: function(){
				this.axios.get(this.serverIp + '/api/statistics/admin/gamesHistoryData',
							{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{
	                	console.log('gamesHistoryData');
	                	console.log('gamesHistoryData');
	                	console.log('gamesHistoryData');
	                	console.log(response);

	                	var days = [];
	                	var counts = [];

	                	for (var i = 0; i < response.data.length; i++) {
	                		var field = response.data[i];

	                		days.push(field.day);
	                		counts.push(field.count);
	                	}

	                	this.fillData(days, counts);
	                	
	                });
			},
		  	clickPaginate: function(page) {
		      console.log(page)
		    },
		  	fillData: function(days, counts) {
				this.gamesHistoryData = {
					labels: days,
					datasets: [{
						label: 'Games By Day',
						backgroundColor: '#ff6600',
						data: counts
					}]
				}
			}
        },
        mounted() {
			this.getTotalNumberOfPlayers();
			this.getTotalGamesPlayed();
			this.listTopFiveUsersByNumOfGames();
			this.getTopFiveUsersByPoints();
			this.getTopFiveUsersByAverage();


			if (this.isLoggedIn) {
				this.getOwnTotalWins();
				this.getOwnTotalLosts();
				this.getOwnTotalDraws();	
				this.getOwnTotalPoints();	
				this.getOwnPointAverage();	
			}


			if(this.isLoggedIn && this.user.admin){
				this.getUsersForAdmin();
				this.getGamesHistoryData();
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