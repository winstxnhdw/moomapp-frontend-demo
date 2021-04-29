<template>
  <div class="map">
    <l-map ref="map" :options="{attributionControl: false, zoomControl: false}" :zoom="zoom" :center="center" @click="createMarker">
      <l-tile-layer :url="url"></l-tile-layer>
      <l-polyline :lat-lngs="interpolate" :color="polyline.color" :opacity="polyline.opacity" :dashArray="polyline.dashArray"/>

      <v-marker-cluster :options="clusterOptions" @clusterclick="click()" @ready="ready">
        <l-marker
          :draggable="true" 
          :key="index" 
          :lat-lng="marker"
          :icon="icon"
          v-for="(marker, index) in markers" 
          @click="deleteMarker(index)" 
          @drag="updatePath($event, index)">
        </l-marker>
      </v-marker-cluster>

      <l-control position="bottomleft" >
        <button type="button" class="btn btn-dark buttons" data-toggle="button" @click="modeSwitch"> {{mode}} </button>
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
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      markers: [],
      icon: L.icon({
        iconUrl: require('/src/assets/marker.svg'),
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      }),
      clusterOptions: {
        disableClusteringAtZoom: 18,
        chunkedLoading: true
      },
      polyline: {
        color: '#F04759',
        opacity: 0.6,
        dashArray: "5, 10"
      },
      interpolate: [],
      mode: 'Create Mode',
      buttonActive: false
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
    modeSwitch() {
      if(this.mode == 'Create Mode') {
        this.mode = 'Delete Mode'
      }

      else if(this.mode == 'Delete Mode') {
        this.mode = 'Create Mode'
      }

      else {
        this.mode = 'Create Mode'
      }
    },
    deleteMarker(index) {
      if(this.mode == 'Delete Mode') {
        this.markers.splice(index, 1);
        this.interpolate.splice(index, 1);
      }
    },
    createMarker(event) {
      if(this.mode == 'Create Mode') {
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
  
  computed: {
    dynamicSize() {
      return [this.iconSize, this.iconSize * 1.15];
    },
    dynamicAnchor() {
      return [this.iconSize / 2, this.iconSize * 1.15];
    }
  },

  mounted() {
    this.$nextTick(() => {
      const map = this.$refs.map.mapObject;
      const drawControl = new window.L.Control.Draw({
        position: 'topleft',
        draw: {
          polyline: false,
          polygon: false,
          rectangle: true,
          circle: true,
          circlemarker: false,
          marker: false
        }
      });

      map.addControl(drawControl);

      const editableLayers = new window.L.FeatureGroup().addTo(map);

      map.on(window.L.Draw.Event.CREATED, (e) => {
        const layer = e.layer;
        editableLayers.removeLayer(layer);
      });

      map.on('draw:toolbaropened', () => {
        this.mode = 'Draw Mode'
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