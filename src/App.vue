<template>
  <div id="app">
    <LoadingScreen v-if="isLoading" />

    <main v-if="!isLoading">
      <Mobile v-if="isMobile()" />

      <div v-else>
        <Map v-if="loadMap" />
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
      isLoading: true,
      loadMap: false
    }
  },

  methods: {
    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true
      } else {
        return false
      }
    }
  },

  mounted() {
    setTimeout(() => {
      this.isLoading = false
    }, 500)

    setTimeout(() => {
      this.loadMap = true
    }, 2000)
  }
}
</script>

<style>
#app {
  background-color: black;
  height: 100vh;
  width: 100vw;
}

#SplashScreen {
  position: fixed;
  z-index: 1000;
}
</style>
