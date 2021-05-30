import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const Chart = {
  namespaced: true,
  state: {
    curvatures: {}
  },
  mutations: {
    setCurvatures(state, data) {
      state.curvatures = data
    }
  },
  getters: {
    getCurvatures(state) {
      return state.curvatures
    }
  }
}

export default new Vuex.Store({
  modules: {
    chart: Chart
  }
})
