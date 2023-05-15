<template>
  <NavBar />

  <router-view></router-view>
</template>

<script>
import NavBar from './components/NavBar';

export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<style>
body {
  background-color: black;
  min-height: 100vh;
}


</style>
