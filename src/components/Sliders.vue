<template>
  <div>
    <v-card class="pa-3 mt-3">
      <v-card-text class="noselect">{{ slider1.label }}</v-card-text>
      <v-slider
        v-model="maxLateralDeviation"
        :hint="slider1.hint"
        :step="slider1.step"
        :color="slider1.colour"
        :min="slider1.min"
        :max="slider1.max"
      >
        <template v-slot:append>
          <v-text-field
            v-model="maxLateralDeviation"
            class="mt-0 pt-0 sliderText"
            hide-details
            type="number"
          ></v-text-field>
        </template>
      </v-slider>
    </v-card>

    <v-card class="pa-3 mt-3">
      <v-card-text class="noselect">{{ slider2.label }}</v-card-text>
      <v-slider
        v-model="safetyThreshold"
        :hint="slider2.hint"
        :step="slider2.step"
        :color="slider2.colour"
        :min="slider2.min"
        :max="slider2.max"
      >
        <template v-slot:append>
          <v-text-field
            v-model="safetyThreshold"
            class="mt-0 pt-0 sliderText"
            hide-details
            type="number"
          ></v-text-field>
        </template>
      </v-slider>
    </v-card>

    <v-card class="pa-3 mt-3">
      <v-card-text class="noselect">{{ slider3.label }}</v-card-text>
      <v-slider
        v-model="waypointDisplacement"
        :hint="slider3.hint"
        :step="slider3.step"
        :color="slider3.colour"
        :min="slider3.min"
        :max="slider3.max"
      >
        <template v-slot:append>
          <v-text-field
            v-model="waypointDisplacement"
            class="mt-0 pt-0 sliderText"
            hide-details
            type="number"
          ></v-text-field>
        </template>
      </v-slider>
    </v-card>

    <v-card class="pa-3 mt-3">
      <v-card-text class="noselect">{{ slider4.label }}</v-card-text>
      <v-slider
        v-model="weight"
        :hint="slider4.hint"
        :step="slider4.step"
        :color="slider4.colour"
        :min="slider4.min"
        :max="slider4.max"
      >
        <template v-slot:append>
          <v-text-field v-model="weight" class="mt-0 pt-0 sliderText" hide-details type="number"></v-text-field>
        </template>
      </v-slider>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Sliders',

  data() {
    return {
      slider1: {
        label: 'Max Lateral Deviation',
        hint: 'This sets the maximum lateral deviation which the optimized path will not exceed (in metres)',
        colour: 'orange darken-3',
        step: 0.01,
        min: 0,
        max: 1.0
      },

      slider2: {
        label: 'Safety Threshold',
        hint: 'This sets the minimum distance from curb to the vehicle (in metres)',
        colour: 'orange darken-3',
        step: 0.01,
        min: 0,
        max: 1.0
      },

      slider3: {
        label: 'Waypoint Displacement',
        hint: 'This sets the linear displacement between individual optimized points (in metres)',
        colour: 'orange darken-3',
        step: 0.01,
        min: 0.01,
        max: 5
      },

      slider4: {
        label: 'Optimizer Weight',
        hint: 'Larger values would produce smoother paths but a longer and exponential wait time',
        colour: 'orange darken-3',
        step: 1,
        min: 0,
        max: 100
      }
    }
  },

  computed: {
    maxLateralDeviation: {
      get() {
        return this.$store.state.sliders.maxLateralDeviation
      },

      set(value) {
        this.$store.commit('sliders/setMaxLateralDeviation', value)
      }
    },

    safetyThreshold: {
      get() {
        return this.$store.state.sliders.safetyThreshold
      },

      set(value) {
        this.$store.commit('sliders/setSafetyThreshold', value)
      }
    },

    waypointDisplacement: {
      get() {
        return this.$store.state.sliders.waypointDisplacement
      },

      set(value) {
        this.$store.commit('sliders/setWaypointDisplacement', value)
      }
    },

    weight: {
      get() {
        return this.$store.state.sliders.weight
      },

      set(value) {
        this.$store.commit('sliders/setWeight', value)
      }
    }
  }
}
</script>

<style scoped>
.sliderText {
  width: 55px;
}
</style>
