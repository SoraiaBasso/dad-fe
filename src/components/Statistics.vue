<template>
	<div>
	<div class="jumbotron">
			<h1>{{ title }}</h1>
			<h2 v-if="isLoggedIn">Welcome: {{user.name}}</h2>

		</div>

<!--mostra o total de jogos jogados pelo utilizador que está logado-->
	<div v-if="isLoggedIn" class="form-group">
	        <h4>You have played <strong>{{user.total_games_played}}</strong> games!</h4>

	        <h4>You have won <strong>{{totalWins}} </strong> games, 
	        	lost <strong> {{totalLosts}} </strong> games 
	        	and draw <strong>{{totalDraws}} </strong>times!</h4>

	</div>
		
	</br>
	</br>

<!--mostra o total de jogadors e o total de jogos jogados-->
	<table class="table table-striped">
	    <thead>
	        <tr>
	            <th>Number of players</th>
	            <th>Number of games played</th>
	        </tr>
	    </thead>

	    <tbody>
	        <tr>
	            <td>{{totalNumberPlayers}}</td>
	            <td>{{totalGamesPlayed}}</td>
	        </tr>
	    </tbody>
	</table>

<!--mostra o top 5 com os jogadores com mais jogos-->
<h3>Top 5 players with more games played</h3>
	<table class="table table-striped">
	    <thead>
	        <tr>
	        	<th>Position</th> <!--posicao do jogador de1 a 5 -->
	            <th>Nickname</th>
	            <th>Games played</th>
	        </tr>
	    </thead>
	    <tbody>
	        <tr v-for="user, key in newUsersByGames" :users="users" :key="user.id">
	        	<td >{{++key}}</td>  <!--posicao do jogador de1 a 5  fazer um order by -->
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
	        	<th>Position</th> <!--posicao do jogador de1 a 5 -->
	            <th>Nickname</th>
	            <th>Total points</th>
	        </tr>
	    </thead>
	    <tbody>
	        <tr v-for="user in newUsersByPoints" :users="users" :key="user.id">
	        	<td >POSITION</td>  <!--posicao do jogador de1 a 5  fazer um order by -->
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
	        	<th>Position</th> <!--posicao do jogador de1 a 5 -->
	            <th>Nickname</th>
	            <th>Average</th>
	        </tr>
	    </thead>
	    <tbody>
	        <tr v-for="user in newUsersByAverage" :users="users" :key="user.id">
	        	<td >POSITION</td>  <!--posicao do jogador de1 a 5  fazer um order by -->
	            <td>{{ user.nickname }}</td>
	            <td>mostar media</td>
	            
	        </tr>
	    </tbody>
	</table>

<!--SO PARA O ADMIN : fazer esta restricao-->

<!--lista de todos os jogadores com o total de jogos, vitorias, empates e derrotas-->
<!-- TODO -->


	</div>
	
</template>


<script type="text/javascript">
	export default {
		name: 'Statistics',
		props: ['user',  'isLoggedIn'],
		//props: ['users'],
		data: function(){
			return { 
				title: 'Statistics',
				users: [],
				totalNumberPlayers: 0,
				totalGamesPlayed: 0,
				newUsersByGames: [],
				newUsersByPoints: [],
				newUsersByAverage: [],
				totalWins: 0,
				totalLosts: 0,
				totalDraws: 0
				//positions: [6]
				//position: 0
			}
		},
		methods: {
             listTopFiveUsersByNumOfGames: function(){
				this.axios.get('http://localhost:7555/api/statistics/topFiveByNumOfGames')
	                .then(response=>{
	                	//Mostra a resposta no log
						console.log(response);
						//var myArray = {p1:'1º', p2: '2º', p3: '3º', p4: '4º', p5: '5º'};
						//Object.assign(this.user, response.data.data);
	                	this.users = response.data; 
	                	this.newUsersByGames = this.users.slice();

	                	/*for(var i = 0; i< this.auxUsers.lenght(); i++){
	                		this.newUsers.push(i: this.auxUsers[i]);
	                	}*/
	                });
			},
			getTotalNumberOfPlayers: function(){
				this.axios.get('http://localhost:7555/api/statistics/numberOfPlayers')
	                .then(response=>{
	                	console.log('RESPOSTA numero de jogadores:')
	                	console.log(response.data)
	                	this.totalNumberPlayers = response.data.count;

	                	/*console.log(response.data)
	                	this.totalNumberPlayers = response.data;*/
	                });
			},
			getTotalGamesPlayed: function(){
				this.axios.get('http://localhost:7555/api/statistics/totalGamesPlayed')
	                .then(response=>{
	                	console.log(response.data)
	                	this.totalGamesPlayed = response.data.count;
	                });
			},
			getTopFiveUsersByPoints: function(){
				this.axios.get('http://localhost:7555/api/statistics/topFiveByPoints')
	                .then(response=>{
	                	//Mostra a resposta no log
						console.log(response);

						//Object.assign(this.user, response.data.data);
	                	this.users = response.data;
	                	this.newUsersByPoints = this.users.slice(); 
	                });
			},
			getTopFiveUsersByAverage: function(){
				this.axios.get('http://localhost:7555/api/statistics/topFiveByAverage')
	                .then(response=>{
	                	//Mostra a resposta no log
						console.log(response);

						//Object.assign(this.user, response.data.data);
	                	this.users = response.data;
	                	this.newUsersByAverage = this.users.slice(); 

	                	//TODO **************MPOSTRAR A MEDIA DE CADA JOGADOR

	                });
			}, //Métodos só para o utilizador autenticado
			getOwnTotalWins: function(){
				this.axios.get('http://localhost:7555/api/statistics/user/totalWins/' + this.user.id,
							{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{

	                	this.totalWins = response.data.count;
	                });
			},
			getOwnTotalLosts: function(){
				console.log('PEDIR O TOTAL DE DERROTAS...');
				this.axios.get('http://localhost:7555/api/statistics/user/totalLosts/' + this.user.id,
							{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{

	                	console.log('TOTAL DE DERROTAS DO USER', response.data.count)
	                	this.totalLosts = response.data.count;
	                });
			},
			getOwnTotalDraws: function(){
				this.axios.get('http://localhost:7555/api/statistics/user/totalDraws/' + this.user.id,
							{ headers: { Authorization: "Bearer " + this.user.token } })
	                .then(response=>{

	                	console.log('TOTAL DE DERROTAS DO USER', response.data.count)
	                	this.totalDraws = response.data.count;
	                });
			}
        },
       /* computed:{
  			convertUsersArray: function(){
  				var newUsers = [5];
  				var positions = [5];

    			for(var i = 1; i < this.positions; i++){
      				this.positions.push(i);
    			}
    		//	return positions;
  			}
		}, */
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