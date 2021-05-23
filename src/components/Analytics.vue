<template>
  <div>
    <v-tabs fixed-tabs dark v-model="tab">
      <v-tabs-slider></v-tabs-slider>
      <v-tab href="#analysis">
        Analysis
      </v-tab>
      <v-tab href="#optimization">
        Optimization
      </v-tab>
      <v-tab href="#configuration">
        Configuration
      </v-tab>
    </v-tabs>

    <v-tabs-items dark class="tabs" v-model="tab">
      <v-tab-item :key="1" value="analysis">
        <v-container>
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
              <v-text-field
                v-model="slider1.val"
                class="mt-0 pt-0 sliderText"
                hide-details
                type="number"
              ></v-text-field>
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
              <v-text-field
                v-model="slider2.val"
                class="mt-0 pt-0 sliderText"
                hide-details
                type="number"
              ></v-text-field>
            </template>
          </v-slider>
          <v-card flat height="100vh">
            <line-chart :chart-data="datacollection"></line-chart>
          </v-card>
        </v-container>
      </v-tab-item>

      <v-tab-item :key="2" value="optimization">
        <v-container>
          <v-card flat min-height="100vh">
            <v-card-text>contact</v-card-text>
          </v-card>
        </v-container>
      </v-tab-item>

      <v-tab-item :key="3" value="configuration">
        <v-container>
          <v-card class="pa-3" min-height="100%">
            <v-card-text class="pl-0 pt-0">Import CSV files</v-card-text>
            <v-btn class="mb-3" @click="importCSV">Import</v-btn>
          </v-card>
          <v-card class="pa-3" min-height="100%">
            <v-card-text class="pl-0 pt-0">Export CSV files</v-card-text>
            <v-btn class="mb-3">Export</v-btn>
          </v-card>
          <v-card class="pa-3" min-height="100vh"> </v-card>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { eventBus } from './../event-bus'
import LineChart from './AnalysisChart.js'

export default {
  name: 'Analytics',
  data() {
    return {
      tab: 'analysis',
      datacollection: {},

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

  components: {
    LineChart
  },

  methods: {
    fillData() {
      this.datacollection = {
        labels: [this.getRandomInt(), this.getRandomInt()],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [this.getRandomInt(), this.getRandomInt()]
          },
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [this.getRandomInt(), this.getRandomInt()]
          }
        ]
      }
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },

    importCSV() {
      eventBus.$emit('importCSV')
    },

    echoSlider1() {
      eventBus.$emit('slider1', this.slider1.val)
    },
    echoSlider2() {
      eventBus.$emit('slider2', this.slider2.val)
    }
  },

  mounted() {
    this.fillData()
  }
}
</script>

<style scoped>
.v-tabs-slider-wrapper,
.v-tab--active {
  color: #fff !important;
}

.v-tabs {
  font-family: 'Roboto Mono', monospace;
}

.v-tabs-slider {
  color: #fff;
}

.v-card__text {
  color: white;
}

.tabs {
  font-family: 'Roboto Mono', monospace;
}

.sliderText {
  width: 55px;
}
</style>
