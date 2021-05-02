<template>
  <div id="app">
    <LoadingScreen :isLoading="isLoading" />
    <main v-if="!isLoading">
      <Map />
      <SplashScreen id="splash" />
    </main>
  </div>
</template>

<script>
import LoadingScreen from './components/LoadingScreen'
import Map from './components/Map'
import SplashScreen from './components/SplashScreen'

export default {
  name: 'App',
  components: {
    Map,
    LoadingScreen,
    SplashScreen
  },
  
  data() {
    return {
      isLoading: true
    };
  },

  mounted() {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }
}
</script>

<style>
  #splash {
    position: fixed;
    z-index: 1000;
  }
</style>
