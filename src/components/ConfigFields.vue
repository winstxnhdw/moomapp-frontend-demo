<template>
  <div>
    <v-card-text>{{ field1.label }}</v-card-text>
    <v-text-field
      v-model="field1.val"
      class="mt-0 pt-0 pl-3 fieldText"
      type="number"
      :hint="field1.hint"
      :step="field1.step"
      :min="field1.min"
      :max="field1.max"
    ></v-text-field>

    <v-card-text>{{ field2.label }}</v-card-text>
    <v-text-field
      v-model="field2.val"
      class="mt-0 pt-0 pl-3 fieldText"
      type="number"
      :hint="field2.hint"
      :step="field2.step"
      :min="field2.min"
    ></v-text-field>
  </div>
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
      },

      field2: {
        label: 'Number of Curbs',
        hint: 'Specify the number of Curb CSV files',
        val: 9,
        step: 1,
        min: 0
      }
    }
  },

  methods: {
    echoField1() {
      eventBus.$emit('field1', this.slider1.val)
    },
    echoField2() {
      eventBus.$emit('field2', this.slider2.val)
    }
  }
}
</script>

<style scoped>
.fieldText {
  width: 200px;
}
</style>
