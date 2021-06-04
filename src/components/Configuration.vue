<template>
  <div>
    <v-card class="pa-3">
      <v-card-text class="pl-0 pt-0">Import CSV files</v-card-text>
      <v-btn class="mb-3" :width="200" @click="importCsv">{{ importLabel }}</v-btn>
    </v-card>
    <v-card class="pa-3 mt-3">
      <v-card-text class="pl-0 pt-0">Export CSV files</v-card-text>
      <v-btn class="mb-3" :width="200">Export</v-btn>
    </v-card>
  </div>
</template>

<script>
import { eventBus } from './../event-bus'
export default {
  name: 'Configuration',

  data() {
    return {
      importLabel: 'Import'
    }
  },

  methods: {
    importCsv() {
      this.importLabel = 'Refresh'
      eventBus.$emit('importCsv')
    }
  }
}
</script>
