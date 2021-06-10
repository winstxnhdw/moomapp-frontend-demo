import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const AnalysisChart = {
  namespaced: true,
  state: {
    curvatures: {}
  },

  mutations: {
    setCurvatures(state, data) {
      state.curvatures = data
    }
  }
}

const Switches = {
  namespaced: true,
  state: {
    togglePiecewise: false
  },

  mutations: {
    setToggle(state, data) {
      state.togglePiecewise = data
    }
  }
}

const Sliders = {
  namespaced: true,
  state: {
    maxLateralDeviation: 0.5,
    safetyThreshold: 0.5,
    waypointDisplacement: 3.0,
    weight: 50
  },

  mutations: {
    setMaxLateralDeviation(state, data) {
      state.maxLateralDeviation = data
    },
    setSafetyThreshold(state, data) {
      state.safetyThreshold = data
    },
    setWaypointDisplacement(state, data) {
      state.waypointDisplacement = data
    },
    setWeight(state, data) {
      state.weight = data
    }
  }
}

const ModeButton = {
  namespaced: true,
  state: {
    mode: 'Create Mode'
  },

  mutations: {
    setCreate(state) {
      state.mode = 'Create Mode'
    },

    setDelete(state) {
      state.mode = 'Delete Mode'
    }
  }
}

const Optimise = {
  namespaced: true,
  state: {
    toggleOptimise: false,
    toggleClear: true
  },

  mutations: {
    toggleOptimise(state) {
      state.toggleOptimise = !state.toggleOptimise
    },
    toggleClear(state) {
      state.toggleClear = !state.toggleClear
    }
  }
}

export default new Vuex.Store({
  modules: {
    chart: AnalysisChart,
    switches: Switches,
    sliders: Sliders,
    modebtn: ModeButton,
    optimise: Optimise
  }
})
