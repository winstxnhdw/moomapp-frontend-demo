<template>
  <div id="map">
    <div id='vignette'> </div>
    <l-map ref="map" 
      v-on:keydown="keyPress"
      :options="{attributionControl: false, zoomControl: false, zoomSnap: 0, wheelPxPerZoomLevel: 30, wheelDebounceTime: 0, doubleClickZoom: false}" 
      :zoom="zoom" 
      :center="center"
      @click="createMarker">

      <l-tile-layer :url="url"></l-tile-layer>
      <l-polyline 
        :lat-lngs="interpolate" 
        :color="polyline.color" 
        :opacity="polyline.opacity" 
        :dashArray="polyline.dashArray"/>

      <l-marker
        v-for="(marker, index) in markers" 
        :key="index"
        :draggable="draggable" 
        :lat-lng="marker"
        :icon="icon"
        @click="deleteMarker($event, index)" 
        @drag="updatePath($event, index)"
        @dragstart="saveMarkerPos"
        @dragend="updateLast($event, index)">
      </l-marker>

      <l-control position="bottomleft" >
        <button type="button" class="btn buttons" data-toggle="button" @click="modeSwitch"> {{mode}} </button>
      </l-control>
    
    </l-map>
  </div>
</template>

<script>
import L from 'leaflet';
import { LMap, LTileLayer, LMarker, LControl, LPolyline} from 'vue2-leaflet';
import 'leaflet-draw';

export default {
  name: 'Map',
  data() {
    return {
      zoom: 18,
      center: L.latLng(1.331142, 103.774454),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      markers: [],
      selectedMarkersId: [],
      selectedMarkers: [],
      oldMarkerPos: [],
      oldClickedMarkerPos: null,
      draggable: true,
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
      modes: ['Create Mode', 'Delete Mode', 'Drag Mode', 'Select Mode'],
      mode: 'Create Mode',
      buttonActive: false
    }
  },

  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControl,
    LPolyline
    },

  methods: {
    modeSwitch() {
      if(this.mode == this.modes[0]) {
        this.mode = this.modes[1];
      }

      else if(this.mode == this.modes[1]) {
        this.mode = this.modes[0];
      }

      else {
        this.mode = this.modes[0];
      }
    },
    deleteMarker(event, index) {
      if(this.mode == this.modes[1]) {
        this.markers.splice(index, 1);
        this.interpolate.splice(index, 1);
      }
    },
    createMarker(event) {
      if(this.mode == this.modes[0]) {
        this.markers.push(event.latlng);
        this.interpolate.push([event.latlng.lat, event.latlng.lng]);
      }
    },
    updatePath(event, index) {
      if(this.mode == this.modes[3]) {
        var delta_lat = event.latlng.lat - this.oldClickedMarkerPos[0];
        var delta_lng = event.latlng.lng - this.oldClickedMarkerPos[1];
        
        this.selectedMarkersId.forEach((dummy, id) => {
          var selectedMarker = this.selectedMarkersId[id];
          var newLat = this.oldMarkerPos[id][0] + delta_lat;
          var newLng = this.oldMarkerPos[id][1] + delta_lng;
          var newLatLng = {lat: newLat, lng: newLng}
          this.interpolate[selectedMarker][0] = newLat
          this.interpolate[selectedMarker][1] = newLng
          this.markers.splice(selectedMarker, 1, newLatLng);
        });
        this.interpolate.splice();
      }

      else {
        this.mode = this.modes[2]
        this.interpolate.splice(index, 1, [event.latlng.lat, event.latlng.lng]);
      }
    },
    updateLast(event, index) {
      if(this.mode != this.modes[3]) {
        var latlng = event.target.getLatLng();
        this.markers[index].lat = latlng.lat;
        this.markers[index].lng = latlng.lng;
      }
      setTimeout(() => this.mode = this.modes[0]);
    },

    saveMarkerPos(event) {
      if(this.mode == this.modes[3]) {
        var latlng = event.target.getLatLng();
        console.log(this.selectedMarkers)
        console.log(event.target.getLatLng())
        console.log(event.target)
        
        if(this.selectedMarkers.includes(latlng)) {
          this.oldMarkerPos = [];
          this.oldClickedMarkerPos = [latlng.lat, latlng.lng];
        
          this.selectedMarkersId.forEach((dummy, id) => {
            var selectedMarker = this.selectedMarkersId[id];
            var oldLat = this.markers[selectedMarker].lat;
            var oldLng = this.markers[selectedMarker].lng;
            this.oldMarkerPos.push([oldLat, oldLng]);
          }); 
        }

        else {
          this.mode = this.modes[0];
        }
      }
    },

    keyPress(event) {
      if(event.originalEvent.key == 'c') {
        var currentIndex = this.modes.indexOf(this.mode)

        if(currentIndex >= this.modes.length - 1) {
          currentIndex = 0;
        }

        else {
          currentIndex++;
        }

        this.mode = this.modes[currentIndex];
      }

      else if(event.originalEvent.key == 'z') {
        this.markers.pop();
        this.interpolate.pop();
      }

      else if(event.originalEvent.key == 'x') {
        this.markers = []
        this.interpolate = []
      }
    },
    
    click: (e) => console.log("clusterclick", e),
    ready: (e) => console.log('ready', e)
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
        var layer = e.layer;
        var type = e.layerType;
        this.selectedMarkers = [];
        this.selectedMarkersId = [];

        if(type === 'rectangle') {
          this.markers.forEach((dummy, id) => {
            if(layer.getBounds().contains(this.markers[id]) == true) {
              this.selectedMarkersId.push(id);
              this.selectedMarkers.push(this.markers[id]);
            }
          });
        }

        else if(type === 'circle') {
          this.markers.forEach((dummy, id) => {
            if(layer.getLatLng().distanceTo(this.markers[id]) < layer.getRadius()) {
              this.selectedMarkersId.push(id);
              this.selectedMarkers.push(this.markers[id])
            }
          });
        }

        this.mode = this.modes[3];
        editableLayers.removeLayer(layer);
      });

      map.on('draw:toolbaropened', () => {
        this.mode = 'Draw Mode';
      });
    });
  }
};
</script>

<style scoped>
  @import "~leaflet-draw/dist/leaflet.draw.css";

  #map {
    position: 'relative';
    height: 100vh;
    width: 100vw;
    z-index: -1;
  }

  .buttons {
    margin-right: 5px;
    border: none;
    background-color: rgb(126, 95, 88);
    z-index: 1;
    opacity: 0.8;
    color: white;
    font-family: 'Roboto Mono', monospace;
    font-size: 15px;
    border-radius: 10px;
  }

  .buttons:hover {
    opacity: 1;
  }

  #vignette {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    box-shadow: inset 0 0 100px black;
    z-index: 1000;
    pointer-events: none;
}
</style>