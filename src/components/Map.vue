<template>
  <div id="map">

    <div id="vignette"></div>

      <svg id="zoomBar" viewBox="0 0 300 300">
        <circle id="outerCircle" cx=150 cy=150 r=10 />
        <circle id="innerCircle" cx=150 cy=150 r=9 :stroke-dashoffset="currentZoom"/>
      </svg>

    <l-map ref="map" 
      v-on:keydown="keyPress"
      :options="{attributionControl: false, zoomControl: false, zoomSnap: 0, wheelPxPerZoomLevel: 100, wheelDebounceTime: 0, doubleClickZoom: false}" 
      :zoom="zoom" 
      :minZoom="minZoom"
      :center="center"
      @update:zoom="zoomUpdate"
      @click="createMarker">

      <l-tile-layer :url="url"></l-tile-layer>
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
        @drag="updatePath($event, index)"
        @dragstart="saveMarkerPos($event, index)"
        @dragend="updateLast($event, index)">
      </l-marker>

      <l-control position="bottomleft" >
        <button type="button" class="btn buttons" data-toggle="button" @click="modeSwitch"> {{mode}} </button>
      </l-control>

      <l-control position="bottomright" >
        <b-button id="infobarBtn" v-b-toggle.sidebar-right>Info</b-button>
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
import { LMap, LTileLayer, LMarker, LControl, LPolyline} from 'vue2-leaflet';
import 'leaflet-draw';

export default {
  name: 'Map',
  data() {
    return {
      minZoom: 13,
      maxZoom: 18,
      zoom: 18,
      currentZoom: 57,
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
      modes: ['Create Mode', 'Delete Mode'],
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
    updateLast(event, index) {
      if(this.mode != 'Select Mode') {
        var latlng = event.target.getLatLng();
        this.markers[index].lat = latlng.lat;
        this.markers[index].lng = latlng.lng;
      }

      this.selectedMarkersId.forEach((dummy, id) => {
          var selectedMarker = this.selectedMarkersId[id]
          this.$refs.myMarkers[selectedMarker].mapObject.setOpacity(1);
      });

      setTimeout(() => this.mode = this.modes[0]);
    },

    saveMarkerPos(event, index) {
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
          this.mode = this.modes[0];
        }
      }
    },

    zoomUpdate(zoom) {
      this.currentZoom = (57/(this.maxZoom - this.minZoom)) * (zoom - this.minZoom);
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

        this.selectedMarkersId.forEach((dummy, id) => {
          var selectedMarker = this.selectedMarkersId[id]
          this.$refs.myMarkers[selectedMarker].mapObject.setOpacity(0.5);
        });

        this.mode = 'Select Mode';
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

  #zoomBar {
    left: 850px;
    margin-top: -850px;
    position: fixed;
    z-index: 1000;
    pointer-events: none;
  }

  #outerCircle {
    fill: none;
    stroke: rgb(133, 129, 129);
    stroke-width: 5px;
    opacity: 0.5;
  }

  #innerCircle {
    fill: none;
    stroke: rgb(255, 255, 255);
    stroke-width: 2px;
    stroke-dasharray: 57;
    animation: stroke-dashoffset 0.4s;
    opacity: 1;
  }

  #zoomLabel {
    left: 1800px;
    margin-top: 87px;
    font-size: 30px;
    position: fixed;
    z-index: 1000;
    pointer-events: none;
    font-family: 'Roboto Mono', monospace;
    color: white;
  }

  .infobar {
    opacity: 0.7;
  }

  .sidebarText {
    color: white;
    font-family: 'Roboto Mono', monospace;
  }
</style>