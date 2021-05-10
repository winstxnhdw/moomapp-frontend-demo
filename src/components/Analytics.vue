<template>
  <div>
    <b-tabs id="tabs" content-class="mt-3" justified>
      <b-tab title="Analysis" active></b-tab>
      <b-tab title="Optimization"></b-tab>
      <b-tab title="Configuration">
        <div class="tab">
          <b-form-file
            v-model="file1"
            :state="Boolean(file1)"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
          >
          </b-form-file>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
export default {
  name: 'Analytics',
  data() {
    return {
      file1: null
    }
  },

  methods: {}
}
</script>

<style scoped>
.tab-content > .tab-pane {
  border: 0px;
}

.tab {
  padding-right: 10px;
  padding-left: 10px;
}

#tabs {
  color: white !important;
  border-width: 0px;
}

#analyticsBar {
  position: fixed;
  height: 100vh;
  width: 100vw;
}
</style>
