<template>
  <div>
    <v-card-text class="text-center">Path Curvature Comparison</v-card-text>
    <line-chart :chart-data="datacollection" :options="options"></line-chart>
  </div>
</template>

<script>
import { eventBus } from './../event-bus'
import LineChart from './../plugins/chart.js'

export default {
  name: 'AnalysisChart',
  data() {
    return {
      datacollection: {
        datasets: [
          {
            label: 'Unoptimized',
            backgroundColor: '#EF6C00',
            pointRadius: 2
          },
          {
            label: 'Optimized',
            backgroundColor: '#B300B3',
            pointRadius: 2
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              ticks: {
                display: false
              }
            }
          ]
        }
      }
    }
  },

  components: {
    LineChart
  },

  methods: {
    range(start, end) {
      return Array(end - start + 1)
        .fill()
        .map((_, idx) => start + idx)
    },

    fillData(unoptimisedCurvature, optimisedCurvature) {
      this.datacollection = {
        labels: this.range(0, unoptimisedCurvature.length),
        datasets: [
          {
            label: 'Unoptimized',
            backgroundColor: '#EF6C00',
            data: unoptimisedCurvature,
            pointRadius: 2
          },
          {
            label: 'Optimized',
            backgroundColor: '#B300B3',
            data: optimisedCurvature,
            pointRadius: 2
          }
        ]
      }
    }
  },

  mounted() {
    eventBus.$on('curvatures', data => {
      console.log(data['unoptimised '])
      this.fillData(data['unoptimised'], data['optimised'])
    })
  }
}
</script>
