<template>
  <div>
    <line-chart class="pt-5" ref="lineChart" :chart-data="datacollection" :options="options"></line-chart>
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
            pointRadius: 0
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
        },
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          position: 'top',
          text: 'Path Curvature Analysis'
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

    updateChart() {
      this.$refs.lineChart.renderChart(this.datacollection, this.options)
    },

    fillData(unoptimisedCurvature, optimisedCurvature) {
      this.datacollection = {
        labels: this.range(0, unoptimisedCurvature.length),
        datasets: [
          {
            label: this.datacollection.datasets[0].label,
            backgroundColor: this.datacollection.datasets[0].backgroundColor,
            pointRadius: this.datacollection.datasets[0].pointRadius,
            data: unoptimisedCurvature
          },
          {
            label: this.datacollection.datasets[1].label,
            backgroundColor: this.datacollection.datasets[1].backgroundColor,
            pointRadius: this.datacollection.datasets[1].pointRadius,
            data: optimisedCurvature
          }
        ]
      }
    }
  },

  mounted() {
    this.$store.watch(
      function(state) {
        return state.curvatures
      },
      function() {
        console.log('test')
      }
    )
    eventBus.$on('curvatures', data => {
      this.fillData(data['unoptimised'], data['optimised'])
    })
  }
}
</script>
