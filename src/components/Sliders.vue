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

    <v-card-text>{{ slider3.label }}</v-card-text>
    <v-slider
      v-model="slider3.val"
      :hint="slider3.hint"
      :step="slider3.step"
      :color="slider3.colour"
      :min="slider3.min"
      :max="slider3.max"
      @change="echoSlider3"
    >
      <template v-slot:append>
        <v-text-field v-model="slider3.val" class="mt-0 pt-0 sliderText" hide-details type="number"></v-text-field>
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
        hint: 'This sets the maximum lateral deviation which the optimized path will not exceed (in metres)',
        val: 0.5,
        colour: 'orange darken-3',
        step: 0.01,
        min: 0,
        max: 1.0
      },

      slider2: {
        label: 'Safety Threshold',
        hint: 'This sets the minimum distance from curb to the vehicle (in metres)',
        val: 0.5,
        colour: 'orange darken-3',
        step: 0.01,
        min: 0,
        max: 1.0
      },

      slider3: {
        label: 'Optimizer Weights',
        hint: 'Larger values would produce smoother paths but a longer and exponential wait time',
        val: 50,
        colour: 'orange darken-3',
        step: 1,
        min: 5,
        max: 95
      }
    }
  },

  methods: {
    echoSlider1() {
      eventBus.$emit('slider1', this.slider1.val)
    },
    echoSlider2() {
      eventBus.$emit('slider2', this.slider2.val)
    },
    echoSlider3() {
      eventBus.$emit('slider3', this.slider3.val)
    }
  }
}
</script>

<style scoped>
.sliderText {
  width: 55px;
}
</style>
