<template>
  <div id="map">
    <Vignette />
    <ZoomBar ref="zoomBar" :min-zoom="minZoom" :max-zoom="maxZoom" />

    <l-map
      ref="myMap"
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
      @keydown="keyPress"
    >
      <v-alert class="text-center" elevation="24" type="warning" :value="warnAlert.value" transition="fade-transition">
        {{ warnAlert.label }}
      </v-alert>

      <l-control-layers position="topleft"></l-control-layers>

      <l-layer-group layerType="overlay" name="Map">
        <l-image-overlay :url="url" :bounds="bounds" />
      </l-layer-group>

      <l-layer-group layerType="overlay" name="Paths">
        <l-polyline
          :lat-lngs="polyline.array"
          :color="polyline.colour"
          :opacity="polyline.opacity"
          :dashArray="polyline.dashArray"
          :weight="polyline.weight"
        />

        <l-polyline :lat-lngs="optimisedPath.array" :color="optimisedPath.colour" :weight="optimisedPath.weight" />
      </l-layer-group>

      <l-layer-group layerType="overlay" name="Routes">
        <l-polyline
          ref="myRoutes"
          v-for="(route, index) in routes.array"
          :key="index"
          :lat-lngs="route"
          :color="routes.colour"
          :opacity="routes.opacity"
          :weight="routes.weight"
          @click="routeSelect(index)"
          @mouseover="routeMouseOver(index)"
          @mouseleave="routeMouseLeave(index)"
        />
      </l-layer-group>

      <l-layer-group layerType="overlay" name="Curbs">
        <l-polyline
          v-for="(curb, index) in curbs.array"
          :key="index"
          :lat-lngs="curb"
          :color="curbs.colour"
          :opacity="curbs.opacity"
          :weight="curbs.weight"
        />
      </l-layer-group>

      <l-layer-group layerType="overlay" name="Waypoints">
        <l-marker
          ref="myMarkers"
          v-for="(marker, index) in markers"
          :key="index"
          :draggable="draggable"
          :lat-lng="marker"
          :icon="icon"
          @click="deleteMarker($event, index)"
          @drag="markerDragEvent($event, index)"
          @dragstart="markerDragStart($event, index)"
          @dragend="markerDragEnd($event, index)"
          @mouseover="markerMouseOver(index)"
        >
          <l-tooltip :options="{ offset: [0, -20], opacity: 0.7, direction: 'top' }" :content="tooltipIndex" />
        </l-marker>
      </l-layer-group>

      <l-control position="bottomright">
        <v-btn outlined class="buttons" @click="modeSwitch">
          {{ mode }}
        </v-btn>
      </l-control>
      <l-control position="bottomleft">
        <v-btn outlined class="buttons" @click="toggleAnalytics">
          {{ this.drawerLabel }}
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
import { LMap, LMarker, LControl, LPolyline, LImageOverlay, LControlLayers, LLayerGroup, LTooltip } from 'vue2-leaflet'
import _ from 'lodash'
import L from 'leaflet'
import 'leaflet-draw'

export default {
  name: 'Map',

  props: {
    drawerState: {
      type: Boolean,
      required: true
    },
    drawerLabel: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      tooltipIndex: null,
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

      polyline: {
        array: [],
        colour: '#FFF',
        opacity: 0.6,
        dashArray: '5, 10',
        weight: 1
      },

      optimisedPath: {
        array: [],
        colour: '#EF6C00',
        weight: 8
      },

      warnAlert: {
        value: false,
        label: ''
      },

      curbs: {
        array: [],
        colour: 'white',
        opacity: 0.6,
        weight: 1
      },

      routes: {
        csv: [],
        array: [],
        colour: 'white',
        opacity: 0.4,
        weight: 8,
        trackArray: [],
        trackCsv: [],
        trackExit: [],
        selected: false
      },

      connections: {
        exitCsv: [],
        exitId: [],
        entranceCsv: [],
        entranceId: []
      },

      sliders: {
        maxlatdev: 0.5,
        safetythresh: 0.5,
        displacement: 1,
        weight: 50
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
    LTooltip,
    ZoomBar,
    Vignette
  },

  methods: {
    // General functions
    resetHighlight() {
      if (this.selectedMarkersId.length == 0) {
        return
      }

      this.selectedMarkersId.forEach(markerIdx => {
        this.$refs.myMarkers[markerIdx].mapObject.setIcon(this.icon)
        this.$refs.myMarkers[markerIdx].mapObject.setOpacity(1)
      })
    },

    resetRoutes() {
      for (let i in this.$refs.myRoutes) {
        this.$refs.myRoutes[i].mapObject.setStyle({ weight: this.routes.weight })
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

    toggleAnalytics() {
      // Open
      if (this.drawerState == true) {
        this.$emit('toggle-sidebar')
      }
      // Close
      else {
        this.$emit('toggle-sidebar')
      }
    },

    drawMarker(latLng) {
      this.markers.push(latLng)
      this.polyline.array.push(latLng)
    },

    deleteMarker(event, index) {
      if (this.mode != 'Delete Mode') {
        return
      }

      this.markers.splice(index, 1)
      this.polyline.array.splice(index, 1)
    },

    createMarker(event) {
      if (this.mode != 'Create Mode') {
        return
      }

      this.drawMarker(event.latlng)
    },

    // Saves marker's original position
    markerDragStart(event, index) {
      if (this.mode != 'Select Mode') {
        return
      }

      let latlng = event.target.getLatLng()

      if (this.selectedMarkersId.includes(index)) {
        this.oldMarkerPos = []
        this.oldClickedMarkerPos = [latlng.lat, latlng.lng]

        this.selectedMarkersId.forEach(markerIdx => {
          let oldLat = this.markers[markerIdx].lat
          let oldLng = this.markers[markerIdx].lng
          this.oldMarkerPos.push([oldLat, oldLng])
        })
      } else {
        this.mode = 'Create Mode'
      }
    },

    // Dynamically updates the markers and path
    markerDragEvent(event, index) {
      if (this.mode == 'Select Mode') {
        let delta_lat = event.latlng.lat - this.oldClickedMarkerPos[0]
        let delta_lng = event.latlng.lng - this.oldClickedMarkerPos[1]

        this.selectedMarkersId.forEach((markerIdx, id) => {
          let newLat = this.oldMarkerPos[id][0] + delta_lat
          let newLng = this.oldMarkerPos[id][1] + delta_lng
          let newLatLng = this.setLatLng(newLat, newLng)
          this.polyline.array[markerIdx] = newLatLng
          this.markers.splice(markerIdx, 1, newLatLng)
        })
        this.polyline.array.splice() // Refreshes the polyline path
      } else {
        this.mode = 'Drag Mode'
        let newLatLng = this.setLatLng(event.latlng.lat, event.latlng.lng)
        this.polyline.array.splice(index, 1, newLatLng)
      }
    },

    // Updates the marker's position after dragging (for single-marker dragging)
    markerDragEnd(event, index) {
      if (this.mode != 'Select Mode') {
        let latlng = event.target.getLatLng()
        this.markers[index].lat = latlng.lat
        this.markers[index].lng = latlng.lng
      }

      this.resetHighlight()

      setTimeout(() => (this.mode = 'Create Mode'))
    },

    markerMouseOver(index) {
      this.tooltipIndex = index.toString()
    },

    routeSelect(index) {
      this.clearSelectedMarkers()
      this.routes.trackArray.push(_.cloneDeep(this.routes.array[index]))
      this.routes.trackCsv.push(this.routes.csv[index])

      if (this.routes.selected == false) {
        for (let id in this.routes.array[index]) {
          this.drawMarker(_.cloneDeep(this.routes.array[index][id]))
        }
        this.routes.selected = true
      } else {
        let entranceCsv = this.routes.csv[index]
        let exitCsv = this.routes.trackCsv[this.routes.trackCsv.length - 2]
        let connectionsId = null

        for (let connection in this.connections.entranceCsv) {
          if (
            this.connections.exitCsv[connection] == exitCsv &&
            this.connections.entranceCsv[connection] == entranceCsv
          ) {
            connectionsId = connection
          }
        }

        let exitId = this.connections.exitId[connectionsId]
        let exitRoute = this.routes.trackArray[this.routes.trackArray.length - 2]
        let exitRouteId = exitRoute.length - 1
        let exitDropNum = exitRouteId - exitId
        let newExit = _.dropRight(exitRoute, exitDropNum)

        let entranceId = this.connections.entranceId[connectionsId]
        let entranceRoute = this.routes.trackArray[this.routes.trackArray.length - 1]
        let entranceDropNum = entranceId
        let newEntrance = _.drop(entranceRoute, entranceDropNum)

        this.markers = []
        this.polyline.array = []

        this.routes.trackExit.push([newExit[newExit.length - 1].lng, newExit[newExit.length - 1].lat])
        this.routes.trackArray.splice(this.routes.trackArray.length - 2, 1, newExit)
        this.routes.trackArray.splice(this.routes.trackArray.length - 1, 1, newEntrance)

        for (let route in this.routes.trackArray) {
          for (let i in this.routes.trackArray[route]) {
            this.drawMarker(_.cloneDeep(this.routes.trackArray[route][i]))
          }
        }
      }

      let routesToKeepId = []

      this.connections.exitCsv.forEach((csv, id) => {
        if (this.routes.csv[index] == csv) {
          let routeId = this.routes.csv.findIndex(route => route == this.connections.entranceCsv[id])
          routesToKeepId.push(routeId)
        }
      })

      this.resetRoutes()

      for (let i in this.$refs.myRoutes) {
        let idx = parseInt(i)
        if (routesToKeepId.includes(idx) == false) {
          this.$refs.myRoutes[idx].mapObject.setStyle({ weight: 0 })
        }
      }
    },

    routeMouseOver(index) {
      this.$refs.myRoutes[index].mapObject.setStyle({ opacity: 1 })
    },

    routeMouseLeave(index) {
      this.$refs.myRoutes[index].mapObject.setStyle({ opacity: this.routes.opacity })
    },

    zoomBarUpdate(zoom) {
      this.$refs.zoomBar.zoomUpdate(zoom)
    },

    importCsv(data) {
      // x: longitude, y: lattitude
      this.clearSelectedMarkers()

      this.markers = []
      this.polyline.array = []
      this.routes.array = []
      this.curbs.array = []
      this.routes.selected = []
      this.routes.trackArray = []
      this.routes.trackCsv = []

      let waypointsData = data['waypoints']
      let curbsData = data['curbs']
      let connectionsData = data['connections']

      for (let csv in waypointsData) {
        let laneArray = []

        for (let id in waypointsData[csv]['x']) {
          let newLng = waypointsData[csv]['x'][id]
          let newLat = waypointsData[csv]['y'][id]
          laneArray.push(this.setLatLng(newLat, newLng))
        }
        this.routes.array.push(laneArray)
      }
      this.routes.csv = Object.keys(waypointsData)
      this.resetRoutes()

      // Import curbs
      for (let id in curbsData) {
        let curb = []

        for (let i in data['curbs'][id]['x']) {
          let newLng = data['curbs'][id]['x'][i]
          let newLat = data['curbs'][id]['y'][i]
          let newLatLng = [newLat, newLng]
          curb.push(newLatLng)
        }

        this.curbs.array.push(curb)
        this.mode = 'View Mode'
      }

      // Import connections
      this.connections.exitCsv = connectionsData['exit']['csv']
      this.connections.exitId = connectionsData['exit']['id']
      this.connections.entranceCsv = connectionsData['entrance']['csv']
      this.connections.entranceId = connectionsData['entrance']['id']
    },

    setOptimisedPath(data) {
      this.optimisedPath.array = []
      let unoptimisedCurvature = []
      let optimisedCurvature = []

      for (let id in data['x']) {
        let newLat = data['y'][id]
        let newLng = data['x'][id]
        this.optimisedPath.array.push(this.setLatLng(newLat, newLng))
        unoptimisedCurvature.push(data['wk'][id])
        optimisedCurvature.push(data['ok'][id])
      }

      let curvatures = { unoptimised: unoptimisedCurvature, optimised: optimisedCurvature }
      // this.$store.commit('chart/setCurvatures')
      eventBus.$emit('curvatures', curvatures)
      eventBus.$emit('notLoading')
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

          indices.forEach(idx => {
            this.polyline.array.splice(idx, 1)
            this.markers.splice(idx, 1)
          })
          this.clearSelectedMarkers()
        }
      } else if (event.originalEvent.key == 'Enter') {
        this.toggleAnalytics()
      }
    }
  },

  watch: {
    warnAlert: {
      handler(newVal) {
        if (newVal) {
          setTimeout(() => {
            this.warnAlert.value = false
          }, 2000)
        }
      },
      deep: true
    }
  },

  mounted() {
    eventBus.$on('importCsv', () => {
      getAPI
        .get('/importcsv')
        .then(response => {
          this.importCsv(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    })

    eventBus.$on('optimise', () => {
      if (this.selectedMarkers.length <= 1) {
        eventBus.$emit('cancel')
        this.warnAlert.value = true
        this.warnAlert.label = 'Please select a path of greater than length 1 before optimizing.'
        return
      }

      let params = {
        x: this.selectedMarkers.map(x => x.lng),
        y: this.selectedMarkers.map(y => y.lat),
        maxlatdev: this.sliders.maxlatdev,
        safetythresh: this.sliders.safetythresh,
        displacement: this.sliders.displacement,
        weight: this.sliders.weight,
        width: this.fields.width
      }

      getAPI
        .post('/optimise', params)
        .then(response => {
          this.setOptimisedPath(response.data)
        })
        .catch(error => {
          eventBus.$emit('cancel')
          console.log(error)
        })
    })

    eventBus.$on('exportCsv', () => {
      if (this.routes.trackCsv.length == 0) {
        this.warnAlert.value = true
        this.warnAlert.label = 'Please select or optimize a path before exporting.'
        return
      }

      let path = []

      if (this.optimisedPath.array.length != 0) {
        path = this.optimisedPath.array
      } else if (this.selectedMarkers.length != 0) {
        path = this.selectedMarkers
      } else {
        this.alert = true
        return
      }

      let params = {
        x: path.map(x => x.lng),
        y: path.map(y => y.lat),
        csv: this.routes.trackCsv,
        exitrefs: this.routes.trackExit
      }

      getAPI.post('/exportcsv', params).catch(error => {
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
      this.sliders.displacement = data
    })
    eventBus.$on('slider4', data => {
      this.sliders.weight = data
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
          this.markers.forEach((marker, id) => {
            if (layer.getBounds().contains(marker) == true) {
              this.selectedMarkersId.push(id)
              this.selectedMarkers.push(marker)
            }
          })
        } else if (type === 'circle') {
          this.markers.forEach((marker, id) => {
            if (map.distance(layer.getLatLng(), marker) < layer.getRadius()) {
              this.selectedMarkersId.push(id)
              this.selectedMarkers.push(marker)
            }
          })
        }

        // Visualise selected markers
        this.selectedMarkersId.forEach(markerIdx => {
          this.$refs.myMarkers[markerIdx].mapObject.setIcon(this.iconSelected)
          this.$refs.myMarkers[markerIdx].mapObject.setOpacity(0.7)
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
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
