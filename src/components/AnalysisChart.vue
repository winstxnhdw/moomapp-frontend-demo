<template>
  <line-chart :chart-data="datacollection"></line-chart>
</template>

<script>
import LineChart from './../plugins/chart.js'

export default {
  name: 'AnalysisChart',
  data() {
    return {
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
            backgroundColor: '#EF6C00',
            data: [this.getRandomInt(), this.getRandomInt()]
          },
          {
            label: 'Data One',
            backgroundColor: '#EF6C00',
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
