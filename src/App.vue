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

<style type="text/css">
body {
  margin: 0;
  padding: 0;
  border: 0;
}

.icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}

.mid-child-container{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
