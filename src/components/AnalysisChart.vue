<template>
  <div>
    <line-chart class="pt-5" ref="lineChart" :chart-data="datacollection" :options="options"></line-chart>
  </div>
</template>

<script>
import LineChart from './../plugins/chart.js'

export default {
  name: 'AnalysisChart',
  data() {
    return {
      datacollection: {
        datasets: [
          {
            label: 'Unoptimized',
            backgroundColor: '#C81B23',
            pointRadius: 0
          },
          {
            label: 'Optimized',
            backgroundColor: '#EF6C00',
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

  computed: {
    getCurvature() {
      return this.$store.state.chart.curvatures
    }
  },

  watch: {
    getCurvature(newVal) {
      this.fillData(newVal['unoptimised'], newVal['optimised'])
    }
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
  }
}
</script>
