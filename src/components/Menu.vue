<template>
  <div>
    <el-container>
      <el-aside>
        <p class="title">模型库</p>
        <el-menu
          active-text-color="#80b4f7"
          style="height:100vh"
        >
          <el-menu-item
            index="1"
            @click="goto(
            'datasets')"
          >
            <div class="item-content">
              <div class="circle"><svg
                  class="icon"
                  aria-hidden="true"
                >
                  <use xlink:href="#icon-data"></use>
                </svg></div>

              <p class="s-text">数据集</p>
            </div>
          </el-menu-item>

          <el-menu-item
            index="2"
            @click="goto('model')"
          >
            <div class="item-content">
              <div class="circle">
                <svg
                  class="icon"
                  aria-hidden="true"
                >
                  <use xlink:href="#icon-model"></use>
                </svg>
              </div>
              <p class="s-text">模型</p>
            </div>
          </el-menu-item>

          <el-menu-item
            index="3"
            @click="goto('experiment')"
          >
            <div class="item-content">
              <div class="circle">
                <svg
                  class="icon"
                  aria-hidden="true"
                >
                  <use xlink:href="#icon-code"></use>
                </svg>
              </div>
              <p class="s-text">实验</p>
            </div>
          </el-menu-item>

          <el-menu-item
            index="4"
            @click="goto(4)"
          >
            <div class="item-content">
              <div class="circle">
                <svg
                  class="icon"
                  aria-hidden="true"
                >
                  <use xlink:href="#icon-data1"></use>
                </svg>
              </div>
              <p class="s-text">数据监测</p>
            </div>
          </el-menu-item>

          <el-menu-item
            index="5"
            @click="goto(5)"
          >
            <div class="item-content">
              <div class="circle">
                <svg
                  class="icon"
                  aria-hidden="true"
                >
                  <use xlink:href="#icon-file"></use>
                </svg>
              </div>
              <p class="s-text">文档</p>
            </div>
          </el-menu-item>
        </el-menu>
      </el-aside>

    </el-container>

  </div>
</template>

<script>


export default {
  name: 'Home',
  data() {
    return {
    }
  },
  methods:
  {
    goto(index) {
      this.$router.push(index)
    }
  },

}
</script>


<style scoped>
.title {
  color: #fff;
  text-align: center;
  font-size: 20px;
}

.el-menu {
  background-color: #3c3c3c;
}

.el-menu-item:focus,
.el-menu-item:hover {
  background-color: #3c3c3c;
}

.el-menu-item {
  position: relative;
  display: block;
  height: 120px;
  width: 120px;
  color: #fff;
  text-align: center;
  text-decoration: none;
}
.item-content {
  flex-direction: column;
  display: flex;
  white-space: nowrap;
  padding-top: 25px;
}

.el-aside {
  position: fixed;
  width: 140px !important;
  background: #3c3c3c;
  border: 1px solid #797979;
}

.icon {
  width: 25px;
  height: 25px;
  fill: currentColor;
  overflow: hidden;
}

ul {
  padding-inline-start: 0px;
}

.circle {
  width: 55px;
  height: 55px;
  border: 1px solid;
  border-radius: 50%;
  margin: auto;
}

.s-text {
  margin-top: -5px;
}
</style>
