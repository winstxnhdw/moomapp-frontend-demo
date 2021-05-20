<template>
  <div id="app">
    <LoadingScreen v-if="isLoading" />

    <main v-if="!isLoading">
      <Mobile v-if="isMobile()" />

      <div v-else>
        <v-row no-gutters>
          <v-col cols="3">
            <Analytics />
          </v-col>
          <v-col cols="9">
            <Map v-if="loadMap" />
          </v-col>
        </v-row>
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
import Analytics from './components/Analytics'

export default {
  name: 'App',
  components: {
    Mobile,
    Map,
    LoadingScreen,
    SplashScreen,
    Analytics
  },

  data() {
    return {
      isLoading: true,
      loadMap: false
    }
  },

  methods: {
    isMobile() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
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
  background-color: rgb(0, 0, 0);
  position: fixed;
  height: 100vh;
  width: 100vw;
}

#SplashScreen {
  position: fixed;
  z-index: 1000;
}

.fitHeight {
  height: 100%;
}
</style>
