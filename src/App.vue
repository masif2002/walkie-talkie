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
body, html {
  background-color: black;
  min-height: 100vh;
}

.w-full {
    width: 100%;
}

.h-full {
  height: 100%;
}

/* width */
::-webkit-scrollbar {
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: transparent
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: hsl(0, 0%, 86%);
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  opacity: 60%;
}

</style>
