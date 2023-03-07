<template>
  <div class="header-container">
    <div class="header_nav">
      <div id="left">
        <div id="head-title">
          <span style="padding-left:8px">模型库</span>
        </div>
        <router-link
          to="/datasets"
          class="menu-item"
        >
          <svg
            class="icon"
            aria-hidden="true"
          >
            <use xlink:href="#icon-data"></use>
          </svg>
          数据集
        </router-link>
        <router-link
          to='/model'
          class="menu-item"
        >
          <svg
            class="icon"
            aria-hidden="true"
          >
            <use xlink:href="#icon-model"></use>
          </svg>
          模型
        </router-link>
        <router-link
          to='/experiment'
          class="menu-item"
        >
          <svg
            class="icon"
            aria-hidden="true"
          >
            <use xlink:href="#icon-code"></use>
          </svg>
          实验
        </router-link>
        <span class="menu-item">
          <svg
            class="icon"
            aria-hidden="true"
          >
            <use xlink:href="#icon-data1"></use>
          </svg>
          数据监测
        </span>
        <span class="menu-item">
          <svg
            class="icon"
            aria-hidden="true"
          >
            <use xlink:href="#icon-file"></use>
          </svg>
          文档
        </span>
      </div>

      <ul>
        <li>
          <router-link to="/login"> 登录</router-link>
        </li>
      </ul>

    </div>

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
.menu-item {
  text-decoration: inherit;
  cursor: pointer;
}

.icon {
  width: 15px;
  height: 15px;
  fill: currentColor;
  margin-bottom: -2px;
}

.header_nav {
  position: fixed;
  z-index: 1500;
  width: 100%;
  height: 52px;
  padding-right: 45px;
  background: rgb(255, 255, 255);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  top: 0;
}

#head-title {
  margin-left: 3vw;
  margin-right: 2vw;
  font-size: 20px;
  font-family: YouYuan;
  font-weight: bold;
  color: #094299;
}
.header_nav > ul {
  margin: 0;
  list-style: none;
  display: flex;
  align-items: center;
}
.header_nav > ul > li * {
  display: inline-block;
  font-size: 1em;
  color: #333333;
  text-decoration: none;
  cursor: pointer;
  padding-right: 20px;
}

#h-home:hover,
.menu-item:hover,
li :hover {
  color: #008fff;
}
.menu-item {
  font-size: 1em;
  color: #333333;
  padding-left: 30px;
}
.dropdown {
  padding-right: 30px;
}

#left {
  display: inline-flex;
  justify-items: stretch;
  align-items: center;
}
</style>
