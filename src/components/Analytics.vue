<template>
  <div>
    <v-tabs rounded fixed-tabs dark v-model="tab">
      <v-tabs-slider></v-tabs-slider>
      <v-tab href="#analysis" @change="animateChart">
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
          <v-card flat>
            <AnalysisChart ref="analysis" />
          </v-card>
        </v-container>
      </v-tab-item>

      <v-tab-item :key="2" value="optimization">
        <v-container>
          <v-card flat>
            <Sliders />
            <ConfigFields />
            <OptimiseBtn />
          </v-card>
        </v-container>
      </v-tab-item>

      <v-tab-item :key="3" value="configuration">
        <v-container>
          <v-card flat>
            <Switches />
            <IOButton />
          </v-card>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import AnalysisChart from './AnalysisChart'
import IOButton from './IOButton'
import Switches from './Switches'
import Sliders from './Sliders'
import ConfigFields from './ConfigFields'
import OptimiseBtn from './OptimiseBtn'

export default {
  name: 'Analytics',
  data() {
    return {
      tab: 'analysis',
      datacollection: {}
    }
  },

  components: {
    AnalysisChart,
    IOButton,
    Switches,
    Sliders,
    ConfigFields,
    OptimiseBtn
  },

  methods: {
    animateChart() {
      setTimeout(() => this.$refs.analysis.updateChart())
    }
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
