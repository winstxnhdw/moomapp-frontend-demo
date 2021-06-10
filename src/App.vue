<template>
  <div id="app">
    <v-app>
      <Mobile v-if="!isMobile" />

      <v-main v-else>
        <v-overlay :value="isLoading" :z-index="10000">
          <LoadingScreen />
        </v-overlay>

        <div>
          <v-navigation-drawer
            app
            fixed
            left
            hide-overlay
            width="30%"
            color="#1E1E1E"
            v-model="drawer.state"
            class="pa-0 ma-0"
          >
            <Analytics />
          </v-navigation-drawer>

          <Map
            v-if="loadMap"
            @toggle-sidebar="toggleDrawer"
            :drawer-state="drawer.state"
            :drawer-label="drawer.label"
          />
          <SplashScreen v-if="!isLoading" id="SplashScreen" />
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
      loadMap: true,
      drawer: {
        state: false,
        label: 'Show sidebar'
      }
    }
  },

  methods: {
    isMobile() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    },

    toggleDrawer() {
      this.drawer.state = !this.drawer.state
      if (this.drawer.state == true) {
        this.drawer.label = 'Hide sidebar'
      } else {
        this.drawer.label = 'Show sidebar'
      }
    }
  },

  mounted() {
    setTimeout(() => {
      this.isLoading = false
    }, 1000)
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
</style>
