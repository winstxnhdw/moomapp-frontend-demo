<template>
  <v-card class="pa-3 mt-3">
    <v-card-text class="noselect">{{ field1.label }}</v-card-text>
    <v-text-field
      v-model="field1.val"
      class="mt-0 pt-0 pl-3 fieldText"
      type="number"
      :hint="field1.hint"
      :step="field1.step"
      :min="field1.min"
      :max="field1.max"
    ></v-text-field>
  </v-card>
</template>

<script>
import { eventBus } from './../event-bus'

export default {
  name: 'ConfigFields',

  data() {
    return {
      field1: {
        label: 'Vehicle Width',
        hint: "Specify the vehicle's width (in metres)",
        val: 2.0,
        step: 0.01,
        min: 0.1,
        max: 10
      }
    }
  },

  methods: {
    echoField1() {
      eventBus.$emit('field1', this.slider1.val)
    }
  }
}
</script>

<style scoped>
.fieldText {
  width: 200px;
}
</style>
