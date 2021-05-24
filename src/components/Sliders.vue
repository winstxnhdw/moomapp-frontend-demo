<template>
  <div>
    <v-card-text>{{ slider1.label }}</v-card-text>
    <v-slider
      v-model="slider1.val"
      :hint="slider1.hint"
      :step="slider1.step"
      :color="slider1.colour"
      :min="slider1.min"
      :max="slider1.max"
      @change="echoSlider1"
    >
      <template v-slot:append>
        <v-text-field v-model="slider1.val" class="mt-0 pt-0 sliderText" hide-details type="number"></v-text-field>
      </template>
    </v-slider>

    <v-card-text>{{ slider2.label }}</v-card-text>
    <v-slider
      v-model="slider2.val"
      :hint="slider2.hint"
      :step="slider2.step"
      :color="slider2.colour"
      :min="slider2.min"
      :max="slider2.max"
      @change="echoSlider2"
    >
      <template v-slot:append>
        <v-text-field v-model="slider2.val" class="mt-0 pt-0 sliderText" hide-details type="number"></v-text-field>
      </template>
    </v-slider>
  </div>
</template>

<script>
import { eventBus } from './../event-bus'

export default {
  name: 'Sliders',

  data() {
    return {
      slider1: {
        label: 'Max Lateral Deviation',
        hint: 'Optimized path will not exceed the set limits (in metres)',
        val: 0.5,
        colour: 'orange darken-3',
        step: 0.01,
        min: 0,
        max: 1.0
      },

      slider2: {
        label: 'Safety Threshold',
        hint: 'Optimized path will not exceed the set limits (in metres)',
        val: 0.5,
        colour: 'orange darken-3',
        step: 0.01,
        min: 0,
        max: 1.0
      }
    }
  },

  methods: {
    echoSlider1() {
      eventBus.$emit('update', this.slider1.val)
    },
    echoSlider2() {
      eventBus.$emit('slider2', this.slider2.val)
    }
  }
}
</script>

<style scoped>
.sliderText {
  width: 55px;
}
</style>
