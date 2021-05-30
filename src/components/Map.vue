<template>
  <div id="map">
    <Vignette />
    <ZoomBar ref="zoomBar" :min-zoom="minZoom" :max-zoom="maxZoom" />

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
      @update:zoom="zoomBarUpdate"
      @click="createMarker"
    >
      <l-control-layers position="topleft"></l-control-layers>
      <l-layer-group layerType="overlay" name="Map">
        <l-image-overlay :url="url" :bounds="bounds" />
      </l-layer-group>

      <l-layer-group layerType="overlay" name="Paths">
        <l-polyline
          :lat-lngs="polyline.array"
          :color="polyline.color"
          :opacity="polyline.opacity"
          :dashArray="polyline.dashArray"
          :weight="polyline.weight"
        />

        <l-polyline :lat-lngs="optimisedPath.array" :color="optimisedPath.color" :weight="optimisedPath.weight" />
      </l-layer-group>

      <l-layer-group layerType="overlay" name="Markers">
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
      </l-layer-group>

      <l-control position="bottomright">
        <v-btn outlined class="buttons" @click="modeSwitch">
          {{ mode }}
        </v-btn>
      </l-control>
    </l-map>
  </div>
</template>

<script>
import Vignette from './Vignette'
import ZoomBar from './ZoomBar'
import { eventBus } from './../event-bus'
import { getAPI } from '@/axios'
import { LMap, LMarker, LControl, LPolyline, LImageOverlay, LControlLayers, LLayerGroup } from 'vue2-leaflet'
import L from 'leaflet'
import 'leaflet-draw'
import gsap from 'gsap'

export default {
  name: 'Map',

  data() {
    return {
      csv: null,
      markers: [],
      selectedMarkersId: [],
      selectedMarkers: [],
      oldMarkerPos: [],
      oldClickedMarkerPos: null,
      mode: 'Create Mode',

      minZoom: 0,
      maxZoom: 4,
      zoom: 0,
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

      iconSelected: L.icon({
        iconUrl: require('/src/assets/marker_selected.svg'),
        iconSize: [5, 5],
        iconAnchor: [2.5, 2.5],
        shadowUrl: require('/src/assets/s_marker_selected.svg'),
        shadowSize: [20, 20],
        shadowAnchor: [10, 10]
      }),

      iconOptimised: L.icon({
        iconUrl: require('/src/assets/marker_optimised.svg'),
        iconSize: [5, 5],
        iconAnchor: [2.5, 2.5],
        shadowUrl: require('/src/assets/s_marker_optimised.svg'),
        shadowSize: [20, 20],
        shadowAnchor: [10, 10]
      }),

      polyline: {
        array: [],
        color: '#FFF',
        opacity: 0.6,
        dashArray: '5, 10',
        weight: 1
      },

      optimisedPath: {
        array: [],
        color: '#FFB400',
        weight: 2
      },

      curbs: {
        color: 'white',
        opacity: 0.6,
        weight: 1,
        created: false
      },

      sliders: {
        maxlatdev: 0.5,
        safetythresh: 0.5,
        weights: 50
      },

      fields: {
        width: 2.0
      }
    }
  },

  components: {
    LMap,
    LMarker,
    LControl,
    LPolyline,
    LImageOverlay,
    LControlLayers,
    LLayerGroup,
    ZoomBar,
    Vignette
  },

  methods: {
    // General functions
    resetHighlight() {
      if (this.selectedMarkersId.length != 0) {
        this.selectedMarkersId.forEach((dummy, id) => {
          let selectedMarker = this.selectedMarkersId[id]
          this.$refs.myMarkers[selectedMarker].mapObject.setIcon(this.icon)
          this.$refs.myMarkers[selectedMarker].mapObject.setOpacity(1)
        })
      }
    },

    clearSelectedMarkers() {
      this.resetHighlight()
      this.selectedMarkersId = []
      this.selectedMarkers = []
    },

    setLatLng(newLat, newLng) {
      return { lat: newLat, lng: newLng }
    },

    drawCurbs(curbs) {
      const map = this.$refs.myMap.mapObject
      if (this.curbs.created == false) {
        L.polyline(curbs, this.curbs).addTo(map)
        this.curbs.created = true
      }
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
        this.polyline.array.splice(index, 1)
      }
    },

    createMarker(event) {
      if (this.mode == 'Create Mode') {
        this.markers.push(event.latlng)
        this.polyline.array.push(event.latlng)
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
          let newLatLng = this.setLatLng(newLat, newLng)
          this.polyline.array[selectedMarker] = newLatLng
          this.markers.splice(selectedMarker, 1, newLatLng)
        })
        this.polyline.array.splice() // Refreshes the polyline path
      } else {
        this.mode = 'Drag Mode'
        let newLatLng = this.setLatLng(event.latlng.lat, event.latlng.lng)
        this.polyline.array.splice(index, 1, newLatLng)
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

    zoomBarUpdate(zoom) {
      this.$refs.zoomBar.zoomUpdate(zoom)
    },

    keyPress(event) {
      if (event.originalEvent.key == 'c') {
        this.modeSwitch()
      } else if (event.originalEvent.key == 'z') {
        this.resetHighlight()
        this.markers.pop()
        this.polyline.array.pop()
      } else if (event.originalEvent.key == 'x') {
        if (this.mode != 'Select Mode') {
          this.markers = []
          this.polyline.array = []
        } else {
          let indices = this.selectedMarkersId.reverse()
          this.mode = 'Create Mode'

          indices.forEach((dummy, id) => {
            this.polyline.array.splice(indices[id], 1)
            this.markers.splice(indices[id], 1)
          })
          this.clearSelectedMarkers()
        }
      }
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

    eventBus.$on('importCSV', () => {
      getAPI
        .get('/importcsv')
        .then(response => {
          // x: longitude, y: lattitude
          this.markers = []
          this.polyline.array = []
          let curbs = []

          response.data['2.0']['1']['x'].forEach((dummy, id) => {
            let newLng = response.data['2.0']['1']['x'][id]
            let newLat = response.data['2.0']['1']['y'][id]
            this.markers.push(this.setLatLng(newLat, newLng))
            this.polyline.array.push(this.setLatLng(newLat, newLng))
          })
          Object.entries(response.data['curbs']).forEach((dummy, id) => {
            let curb = []
            response.data['curbs'][id]['x'].forEach((dummy, i) => {
              let newLng = response.data['curbs'][id]['x'][i]
              let newLat = response.data['curbs'][id]['y'][i]
              let newLatLng = [newLat, newLng]
              curb.push(newLatLng)
            })
            curbs.push(curb)
          })
          this.drawCurbs(curbs)
        })
        .catch(error => {
          console.log(error)
        })
    })

    eventBus.$on('optimise', () => {
      let x = []
      let y = []
      let unoptimisedCurvature = []
      let optimisedCurvature = []

      this.selectedMarkers.forEach((dummy, id) => {
        x.push(this.selectedMarkers[id].lng)
        y.push(this.selectedMarkers[id].lat)
      })

      let params = {
        x: x,
        y: y,
        maxlatdev: this.sliders.maxlatdev,
        safetythresh: this.sliders.safetythresh,
        weights: this.sliders.weights,
        width: this.fields.width
      }

      getAPI
        .post('/optimise', params)
        .then(response => {
          this.optimisedPath.array = []

          response.data['x'].forEach((dummy, id) => {
            let newLat = response.data['y'][id]
            let newLng = response.data['x'][id]
            this.optimisedPath.array.push(this.setLatLng(newLat, newLng))
            unoptimisedCurvature.push(response.data['wk'][id])
            optimisedCurvature.push(response.data['ok'][id])
          })
          let curvatures = { unoptimised: unoptimisedCurvature, optimised: optimisedCurvature }
          this.$store.commit('chart/setCurvatures')
          eventBus.$emit('curvatures', curvatures)
          eventBus.$emit('notLoading')
        })
        .catch(error => {
          eventBus.$emit('cancel')
          console.log(error)
        })
    })

    eventBus.$on('clearOptimisedPath', () => {
      this.optimisedPath.array = []
    })

    eventBus.$on('slider1', data => {
      this.sliders.maxlatdev = data
    })
    eventBus.$on('slider2', data => {
      this.sliders.safetythresh = data
    })
    eventBus.$on('slider3', data => {
      this.sliders.weights = data
    })
    eventBus.$on('field1', data => {
      this.fields.width = data
    })

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
        this.clearSelectedMarkers()

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
          this.$refs.myMarkers[selectedMarker].mapObject.setIcon(this.iconSelected)
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
</style>
