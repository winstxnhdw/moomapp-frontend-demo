<template>
  <div id="app">
    <LoadingScreen :isLoading="isLoading" />

    <main v-if="!isLoading">
      <div v-if="isMobile()">
        <Mobile />
      </div>

      <div v-else>
        <Map />
        <SplashScreen id="SplashScreen" />
      </div>
    </main>
  </div>
</template>

<script>
import LoadingScreen from './components/LoadingScreen'
import Mobile from './components/Mobile'
import Map from './components/Map'
import SplashScreen from './components/SplashScreen'

export default {
  name: 'App',
  components: {
    Mobile,
    Map,
    LoadingScreen,
    SplashScreen
  },
  
  data() {
    return {
      isLoading: true
    };
  },

  methods: {
    isMobile() {
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
      }

      else {
        return false;
      }
    }
  },

  mounted() {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
</script>

<style>
  #SplashScreen {
    position: fixed;
    z-index: 1000;
  }
</style>
