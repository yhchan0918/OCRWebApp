<template>
  <v-app>
    <NavBar/>
    <v-main>
      <Home/>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "@/components/NavBar.vue"
import Home from "@/views/Home.vue"

export default {
   name: "App",
  data(){
    return{
      
      
    }
  },
 
  components: {
    NavBar,
    Home,
  },

  
};
</script>
