<template>
  <div class="map">
    <l-map :options="{attributionControl: false, zoomControl: false}" :zoom="zoom" :center="center" @click="addMarker">
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker :draggable="true" :key="index" v-for="(marker, index) in markers" :lat-lng="marker" @click="removeMarker(index)"></l-marker>
      <l-control position="bottomleft" >
        <button type="button" class="btn btn-dark buttons" @click="allowDelete"> Delete Mode </button>
        <button type="button" class="btn btn-dark buttons" @click="allowCreate"> Create Mode </button>
      </l-control>
    </l-map>
  </div>
</template>

<script>
import L from 'leaflet';
import { LMap, LTileLayer, LMarker, LControl} from 'vue2-leaflet';

export default {
  name: 'Map',
  data() {
    return {
      zoom: 18,
      center: L.latLng(1.331142, 103.774454),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      markers: [
        L.latLng(1.331142, 103.774454)
      ],
      mode: 'create'
    }
  },

  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControl,
    },

  methods: {
    allowCreate() {
      this.mode = 'create'
    },
    allowDelete() {
      this.mode = 'delete'
    },
    removeMarker(index) {
      if(this.mode == 'delete') {
        this.markers.splice(index, 1);
      }
    },
    addMarker(event) {
      if(this.mode == 'create') {
        this.markers.push(event.latlng);
      }
    }
  }
};
</script>

<style scoped>
  .map {
    height: 100vh;
    width: 100vw;
  }

  .buttons {
    margin-right: 5px;
  }
</style>