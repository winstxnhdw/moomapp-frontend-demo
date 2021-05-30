<template>
  <div>
    <v-btn align="center" class="mt-8 centreButton" :loading="isLoading" @click="echoOptimise">
      Optimize
    </v-btn>
    <v-btn align="center" class="mt-2 centreButton" :disabled="isDisabled" @click="clearOptimisedPath">
      Clear
    </v-btn>
  </div>
</template>

<script>
import { eventBus } from './../event-bus'

export default {
  name: 'OptimiseBtn',

  data() {
    return {
      isLoading: false,
      isDisabled: true
    }
  },

  methods: {
    echoOptimise() {
      this.isLoading = true
      eventBus.$emit('optimise')
    },

    clearOptimisedPath() {
      this.isDisabled = true
      eventBus.$emit('clearOptimisedPath')
    }
  },
  mounted() {
    eventBus.$on('notLoading', () => {
      this.isLoading = false
      this.isDisabled = false
    })

    eventBus.$on('cancel', () => {
      this.isLoading = false
      this.isDisabled = true
    })
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
