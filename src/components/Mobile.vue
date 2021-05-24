<template>
  <div class="background">
    <p id="notice">
      Sorry! There is no mobile support for this website. This website demo features certain functionality, intended for
      desktop use. Please switch to a desktop for a better user experience.
    </p>
  </div>
</template>

<script>
import gsap from 'gsap'

export default {
  name: 'Mobile',

  mounted() {
    gsap.fromTo(
      '#notice',
      {
        autoAlpha: 0,
        filter: 'blur(10px)',
        y: 30
      },
      {
        autoAlpha: 1,
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
.background {
  position: fixed;
  height: 100vh;
  width: 100vw;
  opacity: 1;
  background-color: black;
  margin: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

#notice {
  margin: 0;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgb(165, 165, 165);
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;
  font-kerning: auto;
}
</style>
