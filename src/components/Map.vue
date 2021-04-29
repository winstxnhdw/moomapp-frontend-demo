<template>
  <div class="map">
    <l-map ref="map" :options="{attributionControl: false, zoomControl: false}" :zoom="zoom" :center="center" @click="createMarker">
      <l-tile-layer :url="url"></l-tile-layer>
      <l-polyline :lat-lngs="interpolate" />

      <v-marker-cluster :options="clusterOptions" @clusterclick="click()" @ready="ready">
        <l-marker :draggable="true" :key="index" v-for="(marker, index) in markers" :lat-lng="marker" @click="deleteMarker(index)" @drag="updatePath($event, index)"></l-marker>
      </v-marker-cluster>

      <l-control position="bottomleft" >
        <button type="button" class="btn btn-dark buttons" @click="allowDelete"> Delete Mode </button>
        <button type="button" class="btn btn-dark buttons" @click="allowCreate"> Create Mode </button>
      </l-control>
    
    </l-map>
  </div>
</template>

<script>
import L from 'leaflet';
import { LMap, LTileLayer, LMarker, LControl, LPolyline} from 'vue2-leaflet';
import Vue2LeafletMarkercluster from 'vue2-leaflet-markercluster';
import 'leaflet-draw';

export default {
  name: 'Map',
  data() {
    return {
      zoom: 18,
      center: L.latLng(1.331142, 103.774454),
      url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
      markers: [],
      clusterOptions: {
        disableClusteringAtZoom: 18,
        chunkedLoading: true
      },
      interpolate: [],
      mode: 'create'
    }
  },

  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControl,
    LPolyline,
    "v-marker-cluster": Vue2LeafletMarkercluster
    },

  methods: {
    allowCreate() {
      this.mode = 'create'
    },
    allowDelete() {
      this.mode = 'delete'
    },
    deleteMarker(index) {
      if(this.mode == 'delete') {
        this.markers.splice(index, 1);
        this.interpolate.splice(index, 1);
      }
    },
    createMarker(event) {
      if(this.mode == 'create') {
        this.markers.push(event.latlng);
        this.interpolate.push([event.latlng.lat, event.latlng.lng]);
      }
    },
    updatePath(event, index) {
      this.interpolate.splice(index, 1, [event.latlng.lat, event.latlng.lng]);
    },
    
    click: (e) => console.log("clusterclick", e),
    ready: (e) => console.log('ready', e),
  },
  
  mounted() {
    this.$nextTick(() => {
      const map = this.$refs.map.mapObject;
      const drawControl = new window.L.Control.Draw({
        position: 'topleft',
        draw: {
          polyline: {
            allowIntersection: false,
            showArea: true
          },
          polygon: false,
          rectangle: true,
          circle: true,
          marker: false,
        }
      });

      map.addControl(drawControl);

      const editableLayers = new window.L.FeatureGroup().addTo(map);

      map.on(window.L.Draw.Event.CREATED, (e) => {
        const layer = e.layer;
        editableLayers.addLayer(layer);
      });

      map.on('draw:toolbaropened', () => {
        this.mode = 'draw'
      });
    });
  }
};
</script>

<style scoped>
  @import "~leaflet-draw/dist/leaflet.draw.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

  .map {
    height: 100vh;
    width: 100vw;
  }

  .buttons {
    margin-right: 5px;
  }
</style>