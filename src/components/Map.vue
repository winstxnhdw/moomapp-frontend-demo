<template>
  <div id="map">
    <div id='vignette'> </div>
    <l-map ref="map" 
      :options="{attributionControl: false, zoomControl: false}" 
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
        :draggable="true" 
        :lat-lng="marker"
        :icon="icon"
        @click="deleteMarker(index)" 
        @drag="updatePath($event, index)"
        @dragstart="saveMarkerPos"
        @dragend="updateLast($event, index)">
      </l-marker>

      <l-control position="bottomleft" >
        <button type="button" class="btn btn-dark buttons" data-toggle="button" @click="modeSwitch"> {{mode}} </button>
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
      selectedMarkers: [],
      oldMarkerPos: [],
      oldClickedMarkerPos: null,
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
    LPolyline
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
      if(this.mode == 'Select Mode') {
        var delta_lat = event.latlng.lat - this.oldClickedMarkerPos[0];
        var delta_lng = event.latlng.lng - this.oldClickedMarkerPos[1];
        
        for(var m=0; m < this.selectedMarkers.length; m++) {
          var selectedMarker = this.selectedMarkers[m];
          this.interpolate[selectedMarker][0] = this.oldMarkerPos[m][0] + delta_lat;
          this.interpolate[selectedMarker][1] = this.oldMarkerPos[m][1] + delta_lng;
          this.markers[selectedMarker].lat = this.oldMarkerPos[m][0] + delta_lat;
          this.markers[selectedMarker].lng = this.oldMarkerPos[m][1] + delta_lng;
        }
        this.interpolate.splice();
      }

      else {
        this.interpolate.splice(index, 1, [event.latlng.lat, event.latlng.lng]);
      }
    },
    updateLast(event, index) {
      if(this.mode == 'Select Mode') {
        console.log(event)
      }

      else {
        var latlng = event.target.getLatLng();
        this.markers[index].lat = latlng.lat;
        this.markers[index].lng = latlng.lng;
      }

      this.mode = 'Create Mode'
    },

    saveMarkerPos(event) {
      if(this.mode == 'Select Mode') {
        var latlng = event.target.getLatLng();
        this.oldMarkerPos = [];
        this.oldClickedMarkerPos = [latlng.lat, latlng.lng];
        
        for(var i=0; i < this.selectedMarkers.length; i++) {
          var selectedMarker = this.selectedMarkers[i];
          var oldLat = this.markers[selectedMarker].lat;
          var oldLng = this.markers[selectedMarker].lng;
          this.oldMarkerPos.push([oldLat, oldLng]);
        }
      }
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
        var markersInside = [];
        var layer = e.layer;
        var type = e.layerType;

        if(type === 'rectangle') {
          for(var i=0; i < this.markers.length; i++) {
            if(layer.getBounds().contains(this.markers[i]) == true) {
              markersInside.push(i);
            }
          }
        }

        else if(type === 'circle') {
          for(var n=0; n < this.markers.length; n++) {
            if(layer.getLatLng().distanceTo(this.markers[n]) < layer.getRadius()) {
              markersInside.push(n);
            }
          }
        }

        this.mode = 'Select Mode';
        this.selectedMarkers = markersInside;

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
  @import "~leaflet.markercluster/dist/MarkerCluster.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

  #map {
    position: 'relative';
    height: 100vh;
    width: 100vw;
    z-index: -1;
  }

  .buttons {
    margin-right: 5px;
    z-index: 1;
  }

  #vignette {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    box-shadow: inset 0 0 1000px black;
    z-index: 1000;
    pointer-events: none;
}
</style>