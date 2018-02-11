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

<!-- TODO so mostra este link se quem esta logado for o admin-->
        <router-link to="/admin/edit" v-if="isLoggedInAndAdmin()" class="nav-link">Admin Area</router-link>
        <router-link to="/decks" v-if="isLoggedInAndAdmin()" class="nav-link">Decks</router-link>


      </b-navbar-nav>
        </b-collapse>
  </b-navbar>

  <!-- O :user serve para passar a variavel user (declarade neste componente pai) para os componentes filhos
  essa var tem que ser declarada nos props[] do filho que a vai usar -->
  <router-view @is-logged="isLogged" 
    :user="user" :isLoggedIn="isLoggedIn"
    :pendingGames="pendingGames" :activeGames="activeGames"
    :cardImages="cardImages"
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
        isLoggedIn:false}
    },
    methods: {
      doLogout: function() {
        this.axios.post('http://localhost:7555/logout',
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
    },
      created() {
        //O metodo mounted() vai ser executado quando a página estiver pronta
        this.user = this.$store.getters.getUser;
        this.isLoggedIn = this.user.token != null && this.user.token != undefined;
    },
      beforeMount() {
        this.$root.initSocket();
    }
  }
</script>