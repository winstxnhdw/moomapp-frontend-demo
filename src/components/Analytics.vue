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
          <v-card flat height="100vh">
            <AnalysisChart />
          </v-card>
        </v-container>
      </v-tab-item>

      <v-tab-item :key="2" value="optimization">
        <v-container>
          <v-card flat min-height="100vh">
            <Sliders />
            <ConfigFields />
            <OptimiseBtn />
          </v-card>
        </v-container>
      </v-tab-item>

      <v-tab-item :key="3" value="configuration">
        <v-container>
          <Configuration />
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import AnalysisChart from './AnalysisChart'
import Configuration from './Configuration'
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
    Configuration,
    Sliders,
    ConfigFields,
    OptimiseBtn
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
