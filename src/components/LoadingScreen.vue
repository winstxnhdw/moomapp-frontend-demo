<template>
  <div id="loading-wrapper" :class="{loader: true, fadeout: !isLoading}">
    <div id="loading-text">MOOVITA</div>
    <div id="loading-content"></div>
  </div>
</template>

<script>
  export default {
    name: "LoadingScreen",
    props: ["isLoading"]
  };
</script>

<style scoped>
#loading-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgb(0, 0, 0);
}

#loading-text {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  color: rgb(110, 109, 109);
  font-family: 'PT Sans Narrow', sans-serif;
  font-size: 20px;
}

#loading-content {
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  width: 170px;
  height: 170px;
  margin: -85px 0 0 -85px;
  border: 3px solid;
}

#loading-content:after {
  content: "";
  position: absolute;
  border: 3px solid;
  left: 15px;
  right: 15px;
  top: 15px;
  bottom: 15px;
}

#loading-content:before {
  content: "";
  position: absolute;
  border: 3px solid;
  left: 5px;
  right: 5px;
  top: 5px;
  bottom: 5px;
}

#loading-content {
  border: 3px solid transparent;
  border-top-color: #C82129;
  border-bottom-color: #C82129;
  border-radius: 50%;
  -webkit-animation: loader 2s linear infinite;
  -moz-animation: loader 2s linear infinite;
  -o-animation: loader 2s linear infinite;
  animation: loader 2s linear infinite;
}

#loading-content:before {
  border: 3px solid transparent;
  border-top-color: #FFF;
  border-bottom-color: #FFF;
  border-radius: 50%;
  -webkit-animation: loader 3s linear infinite;
  -moz-animation: loader 2s linear infinite;
  -o-animation: loader 2s linear infinite;
  animation: loader 3s linear infinite;
}

#loading-content:after {
  border: 3px solid transparent;
  border-top-color: #FFF;
  border-bottom-color: #FFF;
  border-radius: 50%;
  -webkit-animation: loader 1.5s linear infinite;
  animation: loader 1.5s linear infinite;
  -moz-animation: loader 2s linear infinite;
  -o-animation: loader 2s linear infinite;
}

@-webkit-keyframes loader {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes loader {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

#content-wrapper {
  color: #FFF;
  position: fixed;
  left: 0;
  top: 20px;
  width: 100%;
  height: 100%;
}

#header
{
  width: 800px;
  margin: 0 auto;
  text-align: center;
  height: 100px;
  background-color: #666;
}

#content
{
  width: 800px;
  height: 1000px;
  margin: 0 auto;
  text-align: center;
  background-color: #888;
}
</style>