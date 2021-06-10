<template>
  <Optimise />
  <div>
    <v-btn align="center" class="mt-8 centreButton" :loading="checkToggleLoading" @click="optimisePath">
      Optimize
    </v-btn>
    <v-btn align="center" class="mt-2 centreButton" :disabled="checkToggleDisable" @click="clearOptimisedPath">
      Clear
    </v-btn>
  </div>
</template>

<script>
import Optimise from './Optimise'
export default {
  name: 'OptimiseBtn',

  components: {
    Optimise
  },

  computed: {
    togglePiecewise() {
      return this.$store.state.switches.togglePiecewise
    },
    checkToggleLoading() {
      return this.$store.state.optimise.toggleOptimise
    },
    checkToggleDisable() {
      return this.$store.state.optimise.toggleClear
    }
  },

  methods: {
    optimisePath() {
      this.$store.commit('optimise/toggleOptimise')
    },

    clearOptimisedPath() {
      this.$store.commit('optimise/toggleClear')
    }
  }
}
</script>

<style scoped>
.centreButton {
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
}
</style>
