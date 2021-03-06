import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const AnalysisChart = {
  namespaced: true,

  state: {
    curvatures: {}
  },

  mutations: {
    setCurvature(state, data) {
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

const OptimiseBtn = {
  namespaced: true,

  state: {
    confirm: false
  },

  mutations: {
    setToggle(state) {
      state.confirm = !state.confirm
    }
  }
}

export default new Vuex.Store({
  modules: {
    chart: AnalysisChart,
    switches: Switches,
    optimisebtn: OptimiseBtn
  }
})
