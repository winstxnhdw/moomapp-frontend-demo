<script>
export default {
  name: 'Optimise',

  computed: {
    getMaxLateralDeviation() {
      return this.$store.state.sliders.maxLateralDeviation
    },
    getSafetyThreshold() {
      return this.$store.state.sliders.safetyThreshold
    },
    getWaypointDisplacement() {
      return this.$store.state.sliders.waypointDisplacement
    },
    getWeight() {
      return this.$store.state.sliders.weight
    },
    checkToggleOptimise() {
      return this.$store.state.optimise.toggleOptimise
    }
  },

  watch: {
    checkToggleOptimise() {
      console.log('test')
    }
  },

  methods: {}
}
</script>
