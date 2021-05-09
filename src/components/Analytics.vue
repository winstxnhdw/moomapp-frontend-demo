<template>
  <div id="analyticsBar">
    <b-nav tabs fill>
      <b-nav-item active>Active</b-nav-item>
      <b-nav-item>Link</b-nav-item>
      <b-nav-item>Link with a long name </b-nav-item>
      <b-nav-item disabled>Disabled</b-nav-item>
    </b-nav>
  </div>
</template>

<script>
export default {
  name: 'Analytics',
  data() {
    return {}
  },

  methods: {}
}
</script>

<style scoped>
.h1 {
  color: rgb(255, 255, 0);
  font-size: 100px;
  top: 100%;
  position: fixed;
  opacity: 1;
}
#analyticsBar {
  position: fixed;
  background-color: black;
  height: 100%;
  width: 20%;
}
</style>
