<template>
  <div class="header-container">
    <div class="header_nav">
      <div id="left">
        <div id="head-title">
          <span style="padding-left:8px">模型库</span>
        </div>
        <router-link to="/datasets" class="menu-item">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-data"></use>
          </svg>
          数据集
        </router-link>
        <router-link :to="{path: '/flow-experiments'}" class="menu-item">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-model"></use>
          </svg>
          模型
        </router-link>
        <router-link :to="{path: '/flow-model'}" class="menu-item">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-code"></use>
          </svg>
          实验
        </router-link>
        <router-link to='/visualize' class="menu-item">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-data1"></use>
          </svg>
          数据探查
        </router-link>
        <router-link to='/modelana' class="menu-item">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-data1"></use>
          </svg>
          模型分析
        </router-link>
        <!-- <span class="menu-item">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-file"></use>
          </svg>
          文档
        </span>
        <router-link to="/mapping" class="menu-item">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-data"></use>
          </svg>
          映射
        </router-link> -->
      </div>

      <div class="user">
        <li>
          <span class="el-dropdown-link" @click="to_login" v-if="!login_state && !username">
            <span>登录</span>
          </span>
          <span class="el-dropdown-link" @click="logout" v-if="login_state && username">
            <span>{{ username }}</span>
          </span>


        </li>
      </div>

    </div>

  </div>
</template>

<script>


export default {
  name: 'Home',
  data() {
    return {
      username: "",
      login_state: false,
      token: "",
    }
  },
  
  mounted() {
    this.get_user()
    if (this.login_manager.get()) {
      this.login_state = true
      this.username = this.login_manager.get_name()
      // this.token = this.login_manager.get_token()
    }
    else {
      var route_name = this.$router.history.current.name;
      if (route_name != 'Login' && route_name != 'Register') {
        this.$router.push({ name: 'Login' });
      }
    }
    var _that = this
    this.$bus.$on("usernameUpdate", (name) => {
      _that.login_state = true
      _that.username = name
    })
  },

  methods: {
    goto(index) {
      this.$router.push(index)
    },
    to_login() {
      this.$router.push({ path: '/login', query: { from: this.$route.path } });
    },
    logout() {
      var that = this;
      this.$http_wang({
        url: "/account/logout/",
        method: "post",
        headers: {
          "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      }).then(res => {
        if (res.status == 200) {
          // localStorage.setItem('token', res.data.access)
          that.login_manager.clear()
          that.login_state = false
          that.username = ""
          that.$notify.success({
            title: '成功',
            message: '登出成功'
          })
          that.$router.push('/login');
        }
        else if (res.response.status == 403) {
          that.$notify.error({
            title: '登出失败',
            duration: 5000
          });
        }
        else {
          that.$notify.error({
            title: '服务器失败 :/account/logout/ post',
            message: res.response,
            duration: 5000
          });
        }
      }).catch(err => {
        console.log(err)
        that.$notify.error({
          title: '服务器失败 :/account/logout/ post',
          message: res.response,
          duration: 5000
        });
      })
    },

    get_user(){
      var that = this;
      this.$http_wang({
        url: "/account/get_user/",
        method: "post",
        headers: {
          "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      }).then(res => {
        if (res.status == 200) {
          that.login_manager.set(true, "", res.data.username, "")
          that.login_state = true
          that.username = res.data.username
        }
        else {
          that.login_manager.clear()
          that.login_state = false
          that.username = ""
        }
      }).catch(err => {
        console.log(err)
        that.$notify.error({
          title: '服务器失败 :/account/get_user/ post',
          message: res.response,
          duration: 5000
        });
      })
    }
  }
}
</script>


<style scoped>
.menu-item {
  text-decoration: inherit;
  cursor: pointer;
}

.el-dropdown-link {
  cursor: pointer;
  /* color: hsl(1, 69%, 78%); */
  display: inline-block;
  width: 50px;
}

.user {
  float: right;
  margin: 10px 35px 10px 20px;
  overflow: hidden;
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

.header_nav>ul {
  margin: 0;
  list-style: none;
  display: flex;
  align-items: center;
}

.header_nav>ul>li * {
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
