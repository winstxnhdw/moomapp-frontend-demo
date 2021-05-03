<template>
  <div v-if="!begin" class="background">
    <p class="logo">MOOVITA</p>
    <button type="button" class="btn" id="startBtn" data-toggle="button" @click="begin=!begin">BEGIN</button>
  </div>
</template>

<script>
  import gsap from 'gsap'

  export default {
    name: "SplashScreen",

    data() {
      return {
        begin: false
      }
    },

    method: {
      begin() {
        this.begin = true;
      }
    },
    
    mounted: function() { 
      gsap.fromTo('.logo', {
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
      });

      gsap.fromTo('#startBtn', {
        opacity: 0
      },
      {
        opacity: 0.3,
        duration: 1.5,
        ease: 'Expo.easeIn'
      });
    }
  }
</script>

<style scoped>
  .logo {
    margin: 0;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: rgb(165, 165, 165);
    margin-top: -30px;
    font-family: 'Krona One', sans-serif;
    font-size: 80px;
    letter-spacing: -8px;
    font-kerning: auto;
  }

  .background {
    position: fixed;
    height: 100vh;
    width: 100vw;
    opacity: 0.80;
    background-color: black;
    margin: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  #startBtn {
    position: fixed;
    margin: 0;
    top: 50%;
    left: 50%;
    margin-top: 50px;
    color: white;
    transform: translate(-50%, -50%);
    font-family: 'Roboto Mono', monospace;
    font-size: 15px;
    border: 0px;
    border-radius: 10px;
    width: 8%;
  }
    
  #startBtn:hover {
    border: 1px solid #FFF;
    background-color: transparent;
  }
</style>