<template>
  <el-card class="card">
    <div>
      <el-form :model="form" status-icon :rules="rules" ref="form" label-width="0" class="demo-form">
        <el-form-item prop="user">
          <el-input type="text" v-model="form.user" placeholder="请输入用户名" clearable>
            <i slot="prefix" class="el-input__icon iconfont el-icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input type="password" v-model="form.pass" placeholder="请输入密码" clearable>
            <i slot="prefix" class="el-input__icon iconfont el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input type="password" v-model="form.checkPass" placeholder="请再次输入密码">
            <i slot="prefix" class="el-input__icon iconfont el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm('form')">注册</el-button>
      </el-form>
    </div>
    <div class="msg">
      已有账号？<a @click="$router.push({path: '/login'})">立即登录></a>
    </div>
  </el-card>
</template>

<script>
import QS from "qs";

export default {
  name: 'RegisterBlock',
  data () {
    var validateUser = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('你的用户名呢'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('你的密码呢'))
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('再输一次密码呗'))
      } else if (value !== this.form.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        user: '',
        pass: '',
        checkPass: ''
      },
      Response: null,
      rules: {
        user: [
          { validator: validateUser, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.signup()
        } else {
          this.$alert('再仔细看一哈', '存在错误', {
            confirmButtonText: '我错了'
          }).then(() => {
            this.$message({
              type: 'info',
              message: '再给你一次机会'
            })
          })
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    signup () {
      const that = this
      this.$http_wang({
              url: "/account/register/",
              method: "post",
              headers: {
                "Content-Type":'application/x-www-form-urlencoded;charset=UTF-8',
              },
              data: QS.stringify(that.form)
          })
          .then(function (response) {
            that.Response = response.data
            that.$notify.success('用户注册成功，快去登录吧！')
            that.$router.replace({ path: '/login' })
          })
          .catch(function (error) {
            console.log(error)
            that.$notify.error({
              title: '服务器失败 :/account/register/ post',
              message: res.response,
              duration: 5000
            });
          })
    }
  }
}
</script>

<style scoped>
h2{
  text-align: center;
  margin: 0 auto 10px;
}

h2>figure:hover{
  background-size: 230px;
}
.card{
  position: absolute;
  height: auto;
  width: 400px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 15px;
}

.demo-form{
  width:280px;
  margin:0 auto;
}

.iconfont{
  margin-left:2px;
}

.el-button{
  width: 100%;
  color: white;
  background-image: linear-gradient(to right, #0250c5, #3F87DA);
  text-align: center;
  margin: 10px auto;
  height: 40px;
  letter-spacing: 3em;
  text-indent: 2em;
}

.el-button:hover{
  background-color: #3F87DA;
}

.msg{
  display: block;
  cursor: pointer;
  text-align: center;
  width:auto;
  font-size: 14px;
  margin: 15px auto 0;
}

.msg a:hover{
  text-decoration: underline;
  color: #3F87DA;
}

</style>
