<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" width="25%">
    <HelloWorld msg="Hello Vue in CodeSandbox!"/>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  components: {
    HelloWorld
  }
};
</script>

<style>
@import "assets/theme-builder.css";
</style>
