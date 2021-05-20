<template>
  <div id="map">
    <div id="vignette"></div>

    <svg id="zoomBar" viewBox="0 0 300 300">
      <circle id="outerCircle" cx="150" cy="150" r="10" />
      <circle id="innerCircle" cx="150" cy="150" r="9" />
      <circle id="innerCircleShadow" cx="150" cy="150" r="9" />
      <text id="zoomText" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">
        ZOOM
      </text>
    </svg>

    <!-- <input class="input" type="file" @change="importCSV" /> -->

    <l-map
      ref="myMap"
      v-on:keydown="keyPress"
      :options="{
        attributionControl: false,
        zoomControl: false,
        zoomSnap: 0,
        wheelPxPerZoomLevel: 100,
        wheelDebounceTime: 0,
        doubleClickZoom: false
      }"
      :crs="crs"
      :zoom="zoom"
      :minZoom="minZoom"
      :maxZoom="maxZoom"
      :maxBounds="bounds"
      :maxBoundsViscosity="0.9"
      @update:zoom="zoomUpdate"
      @click="createMarker"
    >
      <l-image-overlay :url="url" :bounds="bounds" />

      <l-polyline
        :lat-lngs="interpolate"
        :color="polyline.color"
        :opacity="polyline.opacity"
        :dashArray="polyline.dashArray"
        :weight="polyline.weight"
      />

      <l-marker
        ref="myMarkers"
        v-for="(marker, index) in markers"
        :key="index"
        :draggable="draggable"
        :lat-lng="marker"
        :icon="icon"
        @click="deleteMarker($event, index)"
        @drag="dragEvent($event, index)"
        @dragstart="dragStart($event, index)"
        @dragend="dragEnd($event, index)"
      ></l-marker>

      <!-- <l-marker
        v-for="(marker, id) in optiMarkers"
        :key="id"
        :draggable="draggable" 
        :lat-lng="marker"
        :icon="icon">
      </l-marker> -->

      <l-control position="bottomright">
        <v-btn outlined class="buttons" @click="modeSwitch">
          {{ mode }}
        </v-btn>
        <v-btn outlined class="buttons" @click="optimiseWaypoints">
          Optimize
        </v-btn>
      </l-control>
    </l-map>
  </div>
</template>

<script>
import { getAPI } from '@/axios'
import { LMap, LMarker, LControl, LPolyline, LImageOverlay } from 'vue2-leaflet'
import L from 'leaflet'
import 'leaflet-draw'
import gsap from 'gsap'

export default {
  name: 'Map',
  data() {
    return {
      csv: null,
      markers: [],
      optiMarkers: [],
      selectedMarkersId: [],
      selectedMarkers: [],
      interpolate: [],
      oldMarkerPos: [],
      oldClickedMarkerPos: null,
      mode: 'Create Mode',

      minZoom: 0,
      maxZoom: 4,
      zoom: 0,
      currentZoom: 0,
      draggable: true,
      crs: L.CRS.Simple,
      url: require('/src/assets/ngeeann_map.png'),
      bounds: [
        [-383, -408.65],
        [393, 446.15]
      ],

      icon: L.icon({
        iconUrl: require('/src/assets/marker.svg'),
        iconSize: [5, 5],
        iconAnchor: [2.5, 2.5],
        shadowUrl: require('/src/assets/s_marker.svg'),
        shadowSize: [20, 20],
        shadowAnchor: [10, 10]
      }),

      icon_selected: L.icon({
        iconUrl: require('/src/assets/marker_selected.svg'),
        iconSize: [5, 5],
        iconAnchor: [2.5, 2.5],
        shadowUrl: require('/src/assets/s_marker_selected.svg'),
        shadowSize: [20, 20],
        shadowAnchor: [10, 10]
      }),

      polyline: {
        color: '#FFF',
        opacity: 0.6,
        dashArray: '5, 10',
        weight: 1
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
        let selectedMarker = this.selectedMarkersId[id]
        this.$refs.myMarkers[selectedMarker].mapObject.setIcon(this.icon)
        this.$refs.myMarkers[selectedMarker].mapObject.setOpacity(1)
      })
    },

    // Event handlers
    modeSwitch() {
      this.resetHighlight()
      if (this.mode == 'Create Mode') {
        this.mode = 'Delete Mode'
      } else if (this.mode == 'Delete Mode') {
        this.mode = 'Create Mode'
      } else {
        this.mode = 'Create Mode'
      }
    },

    deleteMarker(event, index) {
      if (this.mode == 'Delete Mode') {
        this.markers.splice(index, 1)
        this.interpolate.splice(index, 1)
      }
    },

    createMarker(event) {
      if (this.mode == 'Create Mode') {
        this.markers.push(event.latlng)
        this.interpolate.push([event.latlng.lat, event.latlng.lng])
      }
    },

    // Saves marker's original position
    dragStart(event, index) {
      if (this.mode == 'Select Mode') {
        let latlng = event.target.getLatLng()

        if (this.selectedMarkersId.includes(index)) {
          this.oldMarkerPos = []
          this.oldClickedMarkerPos = [latlng.lat, latlng.lng]

          this.selectedMarkersId.forEach((dummy, id) => {
            let selectedMarker = this.selectedMarkersId[id]
            let oldLat = this.markers[selectedMarker].lat
            let oldLng = this.markers[selectedMarker].lng
            this.oldMarkerPos.push([oldLat, oldLng])
          })
        } else {
          this.mode = 'Create Mode'
        }
      }
    },

    // Dynamically updates the markers and path
    dragEvent(event, index) {
      if (this.mode == 'Select Mode') {
        let delta_lat = event.latlng.lat - this.oldClickedMarkerPos[0]
        let delta_lng = event.latlng.lng - this.oldClickedMarkerPos[1]

        this.selectedMarkersId.forEach((dummy, id) => {
          let selectedMarker = this.selectedMarkersId[id]
          let newLat = this.oldMarkerPos[id][0] + delta_lat
          let newLng = this.oldMarkerPos[id][1] + delta_lng
          let newLatLng = { lat: newLat, lng: newLng }
          this.interpolate[selectedMarker][0] = newLat
          this.interpolate[selectedMarker][1] = newLng
          this.markers.splice(selectedMarker, 1, newLatLng)
        })
        this.interpolate.splice() // Refreshes the polyline path
      } else {
        this.mode = 'Drag Mode'
        this.interpolate.splice(index, 1, [event.latlng.lat, event.latlng.lng])
      }
    },

    // Updates the marker's position after dragging (for single-marker dragging)
    dragEnd(event, index) {
      if (this.mode != 'Select Mode') {
        let latlng = event.target.getLatLng()
        this.markers[index].lat = latlng.lat
        this.markers[index].lng = latlng.lng
      }

      this.resetHighlight()

      setTimeout(() => (this.mode = 'Create Mode'))
    },

    zoomUpdate(zoom) {
      let oldZoom = this.currentZoom
      this.currentZoom = (57 / (this.maxZoom - this.minZoom)) * (zoom - this.minZoom)

      gsap.fromTo(
        '#innerCircle',
        {
          strokeDashoffset: oldZoom
        },
        {
          strokeDashoffset: this.currentZoom,
          ease: 'Expo.easeOut'
        }
      )

      gsap.fromTo(
        '#innerCircleShadow',
        {
          strokeDashoffset: oldZoom
        },
        {
          strokeDashoffset: this.currentZoom,
          ease: 'power3.out'
        }
      )
    },

    importCSV(event) {
      // x: longitude, y: lattitude
      const self = this

      this.$papa.parse(event.target.files[0], {
        header: true,
        complete: function(results) {
          let data = results.data
          data.forEach((dummy, id) => {
            let newLat = parseFloat(data[id].y)
            let newLng = parseFloat(data[id].x)
            let newLatLng = { lat: newLat, lng: newLng }
            self.markers.push(newLatLng)
            self.interpolate.push([newLat, newLng])
          })
        }
      })
    },

    optimiseWaypoints() {
      let x = []
      let y = []

      this.selectedMarkers.forEach((dummy, id) => {
        x.push(this.selectedMarkers[id].lng)
        y.push(this.selectedMarkers[id].lat)
      })

      getAPI
        .get('/optimise', {
          params: {
            x: x,
            y: y
          }
        })
        .then(response => {
          this.optiMarkers = []
          this.selectedMarkers.forEach((dummy, id) => {
            let newLat = response.data[1][id]
            let newLng = response.data[0][id]
            let newLatLng = { lat: newLat, lng: newLng }
            this.optiMarkers.push(newLatLng)
          })
        })
        .catch(error => {
          console.log(error)
        })
    },

    exportWaypoints() {
      if (this.optiMarkers.length) {
        let data = {}
        let dataJSON = []

        this.optiMarkers.forEach((dummy, id) => {
          let x = this.optiMarkers[id].lng
          let y = this.optiMarkers[id].lat
          data = { x: x, y: y }
          dataJSON.push(data)
        })

        let dataCSV = this.$papa.unparse(dataJSON)
        this.$papa.download(dataCSV, 'solution')
      }
    },

    keyPress(event) {
      if (event.originalEvent.key == 'c') {
        this.modeSwitch()
      } else if (event.originalEvent.key == 'z') {
        this.resetHighlight()
        this.markers.pop()
        this.interpolate.pop()
      } else if (event.originalEvent.key == 'x') {
        if (this.mode != 'Select Mode') {
          this.markers = []
          this.interpolate = []
        } else {
          this.resetHighlight()
          let indices = this.selectedMarkersId.reverse()

          indices.forEach((dummy, id) => {
            this.interpolate.splice(indices[id], 1)
            this.markers.splice(indices[id], 1)
          })
        }
      }
    }
  },

  computed: {
    dynamicSize() {
      return [this.iconSize, this.iconSize * 1.15]
    },

    dynamicAnchor() {
      return [this.iconSize / 2, this.iconSize * 1.15]
    }
  },

  mounted() {
    gsap.fromTo(
      '#map',
      {
        opacity: 0
      },
      {
        opacity: 1,
        duration: 1.5,
        ease: 'Expo.easeIn'
      }
    )
    this.$nextTick(() => {
      const map = this.$refs.myMap.mapObject
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
      })

      map.addControl(drawControl)

      const editableLayers = new window.L.FeatureGroup().addTo(map)

      // Finds selected markers
      map.on(window.L.Draw.Event.CREATED, e => {
        let layer = e.layer
        let type = e.layerType
        this.selectedMarkers = []
        this.selectedMarkersId = []

        if (type === 'rectangle') {
          this.markers.forEach((dummy, id) => {
            if (layer.getBounds().contains(this.markers[id]) == true) {
              this.selectedMarkersId.push(id)
              this.selectedMarkers.push(this.markers[id])
            }
          })
        } else if (type === 'circle') {
          this.markers.forEach((dummy, id) => {
            if (map.distance(layer.getLatLng(), this.markers[id]) < layer.getRadius()) {
              this.selectedMarkersId.push(id)
              this.selectedMarkers.push(this.markers[id])
            }
          })
        }

        // Visualise selected markers
        this.selectedMarkersId.forEach((dummy, id) => {
          let selectedMarker = this.selectedMarkersId[id]
          this.$refs.myMarkers[selectedMarker].mapObject.setIcon(this.icon_selected)
          this.$refs.myMarkers[selectedMarker].mapObject.setOpacity(0.7)
        })

        this.mode = 'Select Mode'
        editableLayers.removeLayer(layer)
      })

      // Prevents the user from performing irrelevant actions
      map.on('draw:toolbaropened', () => {
        this.mode = 'Draw Mode'
      })
    })
  }
}
</script>

<style scoped>
@import '~leaflet-draw/dist/leaflet.draw.css';

.leaflet-container {
  background-color: black;
}

.buttons {
  border: none;
  background-color: rgb(0, 0, 0);
  border-radius: 8px;
  color: white;
  font-family: 'Roboto Mono', monospace;
  font-size: 15px;
  margin-right: 5px;
  opacity: 0.7;
  z-index: 1;
}

.buttons:hover {
  opacity: 1;
}

#map {
  position: fixed;
  height: 100%;
  width: 75%;
}

#vignette {
  box-shadow: inset 0 0 100px black;
  height: inherit;
  position: fixed;
  pointer-events: none;
  width: inherit;
  z-index: 1000;
}

#zoomBar {
  left: 45%;
  margin-top: -45%;
  position: fixed;
  pointer-events: none;
  z-index: 1000;
}

#zoomText {
  fill: white;
  font-family: 'Krona One', sans-serif;
  font-size: 1.5px;
}

#outerCircle {
  fill: none;
  opacity: 0.4;
  stroke: rgb(133, 129, 129);
  stroke-width: 5px;
}

#innerCircle {
  fill: none;
  opacity: 1;
  stroke: rgb(255, 255, 255);
  stroke-linecap: round;
  stroke-width: 2px;
  stroke-dasharray: 57;
}

#innerCircleShadow {
  fill: none;
  opacity: 0.3;
  stroke: rgb(255, 255, 255);
  stroke-linecap: round;
  stroke-width: 4px;
  stroke-dasharray: 57;
}

.input {
  position: fixed;
  z-index: 1000;
}
</style>
