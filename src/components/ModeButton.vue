<template>
  <l-control position="bottomright">
    <v-btn outlined class="buttons" @click="modeSwitch">
      {{ getMode }}
    </v-btn>
  </l-control>
</template>

<script>
import { LControl } from 'vue2-leaflet'
export default {
  name: 'ModeButton',

  components: {
    LControl
  },

  computed: {
    getMode() {
      return this.$store.state.modebtn.mode
    }
  },

  methods: {
    modeSwitch() {
      this.$emit('reset-highlight')
      if (this.getMode == 'Create Mode') {
        this.$store.commit('modebtn/setDelete')
      } else {
        this.$store.commit('modebtn/setCreate')
      }
    }
  }
}
</script>

<style scoped>
.buttons {
  border: none;
  background-color: rgb(0, 0, 0);
  border-radius: 8px;
  color: white;
  font-family: 'Roboto Mono', monospace;
  font-size: 15px;
  margin-right: 5px;
  opacity: 0.7;
  z-index: 1;
}
</style>
