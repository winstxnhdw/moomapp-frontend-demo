<template>
  <div id="map">

    <div id="vignette"></div>

      <svg id="zoomBar" viewBox="0 0 300 300">
        <circle id="outerCircle" cx=150 cy=150 r=10 />
        <circle id="innerCircle" cx=150 cy=150 r=9 :stroke-dashoffset="currentZoom"/>
      </svg>

    <l-map ref="myMap" 
      v-on:keydown="keyPress"
      :options="{attributionControl: false, zoomControl: false, zoomSnap: 0, wheelPxPerZoomLevel: 100, wheelDebounceTime: 0, doubleClickZoom: false}" 
      :crs="crs"
      :zoom="zoom"
      :center="center"
      :minZoom="minZoom"
      :maxZoom="maxZoom"
      :maxBounds="bounds"
      :maxBoundsViscosity="1.0"
      @update:zoom="zoomUpdate"
      @click="createMarker">

      <l-image-overlay :url="url" :bounds="bounds"/>

      <l-polyline 
        :lat-lngs="interpolate" 
        :color="polyline.color" 
        :opacity="polyline.opacity" 
        :dashArray="polyline.dashArray"/>

      <l-marker ref="myMarkers"
        v-for="(marker, index) in markers"
        :key="index"
        :draggable="draggable" 
        :lat-lng="marker"
        :icon="icon"
        @click="deleteMarker($event, index)" 
        @drag="dragEvent($event, index)"
        @dragstart="dragStart($event, index)"
        @dragend="dragEnd($event, index)">
      </l-marker>

      <l-control position="bottomleft" >
        <button type="button" class="btn buttons" data-toggle="button" @click="modeSwitch"> {{mode}} </button>
      </l-control>

      <l-control position="bottomright" >
        <b-button id="infobarBtn" class="buttons" v-b-toggle.sidebar-right>Info</b-button>
        <b-sidebar id="sidebar-right" bg-variant="dark" class="infobar" text-variant="light" title="INSTRUCTIONS" right shadow>
          <div class="px-3 py-2 sidebarText">
            <h4>General Usage</h4>
            <p>
              - Click anywhere on the map to begin setting waypoints
            </p>
            <p>
              - Hold click and drag on a waypoint to change the position of the waypoints
            </p>
            <p>
              - Use the shape toolbars to multi-select and manipulate waypoints.
            </p>
            <h4>Keybinds</h4>
            <p>
              Press Z to delete the previous waypoint
            </p>
            <p>
              Press X to delete all waypoints
            </p>
            <p>
              Press C to cycle through modes
            </p>
          </div>
        </b-sidebar>
      </l-control>
    
    </l-map>
  </div>
</template>

<script>
import L from 'leaflet';
import { LMap, LMarker, LControl, LPolyline, LImageOverlay} from 'vue2-leaflet';
import 'leaflet-draw';

export default {
  name: 'Map',
  data() {
    return {
      markers: [],
      selectedMarkersId: [],
      selectedMarkers: [],
      interpolate: [],
      oldMarkerPos: [],
      oldClickedMarkerPos: null,
      mode: 'Create Mode',

      minZoom: 0,
      maxZoom: 4,
      zoom: 0,
      currentZoom: 57,
      draggable: true,
      crs: L.CRS.Simple,
      url: require('/src/assets/ngeeann_map.png'),
      bounds: [
        [-383, -408.65], 
        [393, 446.15]
      ],

      icon: L.icon({
        iconUrl: require('/src/assets/marker.svg'),
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      }),

      icon_selected: L.icon({
        iconUrl: require('/src/assets/marker_selected.svg'),
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      }),

      polyline: {
        color: '#FFF',
        opacity: 0.6,
        dashArray: "5, 10"
      }
    }
  },

  components: {
    LMap,
    LMarker,
    LControl,
    LPolyline,
    LImageOverlay
    },

  methods: {
    // General functions
    resetHighlight() {
      this.selectedMarkersId.forEach((dummy, id) => {
          var selectedMarker = this.selectedMarkersId[id]
          this.$refs.myMarkers[selectedMarker].mapObject.setIcon(this.icon);
      });
    },

    // Event handlers
    modeSwitch() {
      this.resetHighlight();
      
      if(this.mode == 'Create Mode') {
        this.mode = 'Delete Mode';
      }

      else if(this.mode == 'Delete Mode') {
        this.mode = 'Create Mode';
      }

      else {
        this.mode = 'Create Mode';
      }
    },

    deleteMarker(event, index) {
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

    // Saves marker's original position
    dragStart(event, index) {
      if(this.mode == 'Select Mode') {
        var latlng = event.target.getLatLng();
        
        if(this.selectedMarkersId.includes(index)) {
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
          this.mode = 'Create Mode';
        }
      }
    },

    // Dynamically updates the markers and path
    dragEvent(event, index) {
      if(this.mode == 'Select Mode') {
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
        this.interpolate.splice(); // Refreshes the polyline path
      }

      else {
        this.mode = 'Drag Mode'
        this.interpolate.splice(index, 1, [event.latlng.lat, event.latlng.lng]);
      }
    },

    // Updates the marker's position after dragging (for single-marker dragging)
    dragEnd(event, index) {
      if(this.mode != 'Select Mode') {
        var latlng = event.target.getLatLng();
        this.markers[index].lat = latlng.lat;
        this.markers[index].lng = latlng.lng;
      }

      this.resetHighlight();

      setTimeout(() => this.mode = 'Create Mode');
    },

    zoomUpdate(zoom) {
      this.currentZoom = (57/(this.maxZoom - this.minZoom)) * (zoom - this.minZoom);
    },

    keyPress(event) {
      if(event.originalEvent.key == 'c') {
        this.modeSwitch()
      }

      else if(event.originalEvent.key == 'z') {
        this.markers.pop();
        this.interpolate.pop();
      }

      else if(event.originalEvent.key == 'x') {
        this.markers = []
        this.interpolate = []
      }
    }
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
      const map = this.$refs.myMap.mapObject;
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

      // Finds selected markers
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

        // Visualise selected markers
        this.selectedMarkersId.forEach((dummy, id) => {
          var selectedMarker = this.selectedMarkersId[id]
          this.$refs.myMarkers[selectedMarker].mapObject.setIcon(this.icon_selected);
        });

        this.mode = 'Select Mode';
        editableLayers.removeLayer(layer);
      });

      // Prevents the user from performing irrelevant actions
      map.on('draw:toolbaropened', () => {
        this.mode = 'Draw Mode';
      });
    });
  }
};
</script>

<style scoped>
  @import "~leaflet-draw/dist/leaflet.draw.css";

  .leaflet-container {
    background-color: black;
  }

  .buttons {
    border: none;
    background-color: rgb(126, 95, 88);
    border-radius: 10px;
    color: white;
    font-family: 'Roboto Mono', monospace;
    font-size: 15px;
    margin-right: 5px;
    opacity: 0.8;
    z-index: 1;
  }

  .buttons:hover {
    opacity: 1;
  }

  .infobar {
    opacity: 0.7;
  }

  .sidebarText {
    color: white;
    font-family: 'Roboto Mono', monospace;
  }

  #map {
    height: 100vh;
    position: 'relative';
    width: 100vw;
    z-index: -1;
  }

  #vignette {
    box-shadow: inset 0 0 100px black;
    height: 100vh;
    left: 0;
    top: 0;
    position: fixed;
    pointer-events: none;
    width: 100vw;
    z-index: 1000;
  }

  #zoomBar {
    left: 850px;
    margin-top: -850px;
    position: fixed;
    pointer-events: none;
    z-index: 1000;
  }

  #outerCircle {
    fill: none;
    opacity: 0.5;
    stroke: rgb(133, 129, 129);
    stroke-width: 5px;
  }

  #innerCircle {
    animation: stroke-dashoffset 0.4s;
    fill: none;
    opacity: 1;
    stroke: rgb(255, 255, 255);
    stroke-width: 2px;
    stroke-dasharray: 57;
  }
</style>