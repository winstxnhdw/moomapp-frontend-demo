<template>
  <svg id="zoomBar" viewBox="0 0 300 300">
    <circle id="outerCircle" cx="150" cy="150" r="10" />
    <circle id="innerCircle" cx="150" cy="150" r="9" />
    <circle id="innerCircleShadow" cx="150" cy="150" r="9" />
    <text id="zoomText" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">
      ZOOM
    </text>
  </svg>
</template>

<script>
import gsap from 'gsap'

export default {
  name: 'ZoomBar',

  props: {
    minZoom: {
      type: Number,
      required: true
    },
    maxZoom: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      currentZoom: 0
    }
  },

  methods: {
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
    }
  }
}
</script>

<style scoped>
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
</style>
