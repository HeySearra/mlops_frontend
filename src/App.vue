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

.attr-label{
  font-size: 10px;
  color: #a3a3a3;
  margin-right: 10px;
  margin-left: 20px;
}

.attr-value{
  font-size: 10px;
  color: #a3a3a3;
}
.super-flow-form-item .el-form-item__label {
  font-style: italic;
  font-weight: bold;
}

.mid-child-container{
  display: flex;
  justify-content: center;
  align-items: center;
}
/*设置全局滚动条样式*/
*::-webkit-scrollbar{
  width: 10px;
  height: 8px;
}

*::-webkit-scrollbar-thumb{
  background: #c3c3c3;
  border-radius: 5px;
}
*::-webkit-scrollbar-thumb:hover{
  background: darkgray;
}
*::-webkit-scrollbar-track{
  border: none;
  background-color: white;
}

</style>
