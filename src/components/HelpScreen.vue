<template>
  <div id="helpScreen">
    Welcome to MooVita's path optimization and management web application.
    <br />You may begin by toggling the analytics bar by clicking on the button located at the bottom-left corner.
    <br />
    You can create waypoints by clicking on the map or through CSV imports.
    <br />
    You may use the draw tools located at the top-left corner to select waypoints and enable various group actions.
    <br />
    Press the 'Z' key to undo created waypoints, 'X' key to delete all waypoints and 'C' key to toggle between the
    create and delete modes.<br />
    You can hide me by toggling the 'HELP' button.
  </div>
</template>

<script>
import gsap from 'gsap'

export default {
  name: 'HelpScreen',

  mounted() {
    gsap.fromTo(
      '#helpScreen',
      {
        filter: 'blur(10px)',
        y: 1000
      },
      {
        filter: 'blur(0px)',
        y: 0,
        ease: 'Expo.easeOut',
        duration: 1.5
      }
    )
  }
}
</script>

<style scoped>
#helpScreen {
  background-color: black;
  height: 100%;
  position: absolute;
  pointer-events: none;
  width: 100%;
  opacity: 0.8;
  z-index: 1002;
  color: rgb(165, 165, 165);
  display: flex;
  text-align: center;
  justify-content: center;
  flex-direction: column;
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;
}
</style>
