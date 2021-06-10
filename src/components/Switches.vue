<template>
  <div>
    <v-card class="pa-3">
      <v-card-text class="pl-0 pt-0">Optimization</v-card-text>
      <v-switch
        inset
        v-model="toggleValue"
        :color="switch1.colour"
        :label="switch1.label"
        :hint="switch1.hint"
      ></v-switch>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Switches',
  data() {
    return {
      switch1: {
        label: 'Toggle Piecewise',
        colour: 'orange darken-3',
        hint: 'Toggles between route optimization and piecewise optimization'
      }
    }
  },

  computed: {
    toggleValue: {
      get() {
        return this.$store.state.switches.togglePiecewise
      },
      set(value) {
        this.$store.commit('switches/setToggle', value)
      }
    }
  }
}
</script>
