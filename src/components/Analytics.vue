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
        <v-card flat height="100%">
          <v-card-text>contact</v-card-text>
          <line-chart :chart-data="datacollection"></line-chart>
          <v-btn @click="fillData()">Randomize</v-btn>
        </v-card>
      </v-tab-item>
      <v-tab-item :key="2" value="optimization">
        <v-card flat min-height="100%">
          <v-card-text>contact</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item :key="3" value="configuration">
        <v-card flat min-height="100%">
          <v-card-text>contact</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import LineChart from './AnalysisChart.js'

export default {
  name: 'Analytics',
  data() {
    return {
      tab: 'analysis',
      datacollection: {}
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

.tabs {
  font-family: 'Roboto Mono', monospace;
}
</style>
