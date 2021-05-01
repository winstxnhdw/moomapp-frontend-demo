<template>
  <div id="app">
    <LoadingScreen :isLoading="isLoading" />
    <main v-if="!isLoading">
      <Map />
    </main>
  </div>
</template>

<script>
import LoadingScreen from './components/LoadingScreen'
import Map from './components/Map'

export default {
  name: 'App',
  components: {
    Map,
    LoadingScreen
  },
  
  data() {
    return {
      isLoading: true
    };
  },

  mounted() {
    setTimeout(() => {
      this.isLoading = false;
    }, 10000);
  }
}
</script>

<style>
</style>
