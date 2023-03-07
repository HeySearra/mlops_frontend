<template>
  <div id="app">
    <Header active-name="1"></Header>
    <div style="margin-top:52px">
      <router-view />
    </div>

  </div>
</template>

<script>
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  }
}
</script>

<style>
#app {
}
body {
  margin: 0;
  padding: 0;
  border: 0;
}
</style>
