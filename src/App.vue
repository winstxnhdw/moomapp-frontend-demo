<template>
  <div id="app">
    <v-app>
      <LoadingScreen v-if="isLoading" />

      <v-main v-if="!isLoading">
        <Mobile v-if="isMobile()" />

        <div v-else>
          <v-navigation-drawer app fixed permanent left hide-overlay width="30%" class="pa-0 ma-0">
            <Analytics />
          </v-navigation-drawer>

          <Map v-if="loadMap" />
          <SplashScreen id="SplashScreen" />
        </div>
      </v-main>
    </v-app>
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
v-navigation-drawer__content {
  height: 100%;
  overflow-y: hidden !important;
  overflow-x: hidden;
}
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
</style>
