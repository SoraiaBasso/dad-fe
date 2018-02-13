<template>
  <div id="app">
  <b-navbar toggleable="md" type="dark" variant="info">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand href="#">Sueca</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">

      <b-navbar-nav>
        
        
        <router-link to="/lobby" v-if="isLoggedIn" class="nav-link">Lobby</router-link>

        <router-link to="/users" v-if="isLoggedInAndAdmin()" class="nav-link">Users</router-link>

        <router-link to="/listStatistics" class="nav-link">Statistics</router-link> 

        <b-nav-item v-if="isLoggedIn" v-on:click.prevent="doLogout()">Logout</b-nav-item>
        
        <router-link to="/user/edit" v-if="isLoggedInAndNotAdmin()" class="nav-link">Edit Profile</router-link>

        <router-link to="/users/create" v-if="!isLoggedIn" class="nav-link">Register</router-link>
        <router-link to="/login" v-if="!isLoggedIn" class="nav-link">Login</router-link>

        <router-link to="/admin/edit" v-if="isLoggedInAndAdmin()" class="nav-link">Admin Area</router-link>
        <router-link to="/decks" v-if="isLoggedInAndAdmin()" class="nav-link">Decks</router-link>


      </b-navbar-nav>
        </b-collapse>
  </b-navbar>
      <b-modal ref="gameOverModalRef" id="myModal" hide-footer>
        {{computedMessage}}
      <b-btn class="mt-3" variant="outline-success" block @click="resetGameOver">Close</b-btn>

  </b-modal>


  <!-- Passamos as var~iáveis declaradas no main js para os componentes filhos -->
  <router-view @is-logged="isLogged" 
    :user="user" :isLoggedIn="isLoggedIn"
    :pendingGames="pendingGames" :activeGames="activeGames"
    :cardImages="cardImages"
    :serverIp="serverIp"
    ></router-view>

   </div>
</template>

<script>

export default {
  name: 'App',
    data() {
      return {
        user: this.$root.user,
        pendingGames: this.$root.pendingGames,
        activeGames: this.$root.activeGames,
        cardImages: this.$root.cardImages,
        serverIp: this.$root.serverIp,
        gamesOver: this.$root.gamesOver,
        isLoggedIn:false}
    },
    computed: {
      computedMessage: function () {
        var msg = '';
        if(this.gamesOver.length) {
          var gameOver = this.gamesOver[0];
          var userWon = false;

          for (var i = 0; i < gameOver.users.length; i++) {
            var userAux = gameOver.users[i];
            if(userAux.id == this.user.id &&
              userAux.teamId == gameOver.teamWinner){
              userWon = true;
              break;
            }
          }
          var wonMessage = '';
          if(userWon){
            wonMessage = "You Won! ";
          }else{
            wonMessage = "You lost... ";
          }

          msg = "Game " + gameOver.id + " is over."+
          wonMessage+"\nTeam 1 Card Points: " + gameOver.team1_cardpoints +
          ". Team 2 Card Points: " + gameOver.team2_cardpoints;

          if(gameOver.team1_cheating){
            msg += "\n Team 1 Cheated!";
          }
          if(gameOver.team2_cheating){
            msg += "\n Team 2 Cheated!";
          }

        }
        return msg;
      }
    },
    methods: {
      doLogout: function() {
        this.axios.post(this.serverIp +'/logout',
          { token: this.user.token })
          .then(response => {
            console.log(response);
            this.user = {
                          id: 0,
                          name: '',
                          nickname: '',
                          email: '',
                          admin: 0,
                          token: null
                           };
            this.isLogged(false);
            this.$root.saveUser(this.user);
            this.$root.disconnectSocket();
            this.$router.push('/login');

          }).catch(error => {
            console.log(error);
            this.showError = true;
            if(error.response) {
              if (error.response.data.message) {
                this.errorMessage = error.response.data.message;
              } else {
                this.errorMessage = "Code: " + error.response.status +
                  ", Message: " + error.response.statusText;
              } 
            }
            
            this.user = {
                          id: 0,
                          name: '',
                          nickname: '',
                          email: '',
                          admin: 0,
                          token: null
                           };
            this.isLogged(false);
            this.$root.saveUser(this.user);
            this.$root.disconnectSocket();
            this.$router.push('/login');

          });
      },
      isLogged: function(flag){
          this.isLoggedIn = flag;
      },
      isLoggedInAndAdmin: function(flag){
          return this.isLoggedIn && this.user.admin == 1;
      },
      isLoggedInAndNotAdmin: function(flag){
          return this.isLoggedIn && this.user.admin == 0; 
      },
      resetGameOver () {
        this.$root.resetGameOver();
      }
    },    
    watch: {
        gamesOver() {
          console.log("gameOver watch");
          console.log(this.gamesOver);
          if(this.gamesOver.length) {
              this.$refs.gameOverModalRef.show();
          }else{
              this.$refs.gameOverModalRef.hide();
          }
        },
        deep: true
      },
      created() {
        this.user = this.$store.getters.getUser;
        this.isLoggedIn = this.user.token != null && this.user.token != undefined;
    },
      beforeMount() {
        this.$root.initSocket();
    }
  }
</script>