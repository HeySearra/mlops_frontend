<template>
  <div>
    <div
      class="table"
      v-show="this.outputVisible"
    >
      <el-card shadow="never">
        <div
          slot="header"
          class="card-title"
        >
          <span>自定义预处理结果</span>
        </div>
        <el-table
          :data="output.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          :header-cell-style="{
        'font-size': '14px',
        color: '#778192',
        'font-weight': 'normal',
        'text-align': 'center',
        'background-color': '#fafafa',
        padding: '0',
        height: '2.5vw',
      }"
          v-loading="loading"
          element-loading-text="结果加载中"
          element-loading-spinner="el-icon-loading"
        >
          <el-table-column
            v-for="(th, index) in header_name"
            :key="index"
            :prop="th"
            :label="th"
            align="center"
            :fixed="index==0? true:false"
          >
          </el-table-column>

        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 20]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total='output.length'
          style="margin:20px"
        >
        </el-pagination>
      </el-card>
    </div>

    <div
      class="table"
      style="margin-top:20px"
    >
      <el-card shadow="never">
        <div
          slot="header"
          class="card-title"
        >
          <span>自定义预处理方法</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            icon="el-icon-circle-plus-outline"
            @click="dialogFormVisible=true"
          >新建实验</el-button>
        </div>

        <el-table
          border
          tooltip-effect="dark"
          style="width: 100%"
          :data="historyList"
          :header-cell-style="{
        'font-size': '14px',
        color: '#778192',
        'font-weight': 'normal',
        'text-align': 'center',
        'background-color': '#fafafa',
        padding: '0',
        height: '2.5vw',
      }"
        >
          <el-table-column
            prop="name"
            label="名称"
            width="400"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="description"
            label="描述"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                @click="histroy_delete(scope.row)"
                type="text"
              >删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-card>
    </div>

    <div style="margin-top: 20px">
      <el-card
        shadow="never"
        class="gpt-card"
      >
        <div
          slot="header"
          class="card-title"
        >
          <span>AI模型生成代码</span>
        </div>

        <div class="chat-container">
          <div class="chat">
            <div
              v-for="(message, index) in chatMessages"
              :key="index"
              :class="['message', message.isUser ? 'user' : 'chatgpt']"
            >
              <div class="avatar-container">
                <el-avatar
                  v-if="message.isUser"
                  icon="el-icon-user-solid"
                  size="small"
                  shape="square"
                ></el-avatar>
                <el-avatar
                  v-else
                  :src="avatarURL"
                  size="small"
                  shape="square"
                ></el-avatar>
              </div>

              <pre v-highlight><code :class="{'code-area':!message.isUser}">{{ message.content }}</code></pre>
              <div style="margin-left: auto;">
                <el-button
                  v-clipboard:copy="message.content"
                  v-clipboard:success="onCopySuccess"
                  v-if="!message.isUser"
                  icon="el-icon-copy-document"
                  size="small"
                  style="margin-left: 4px;"
                >复制</el-button>
              </div>
            </div>
          </div>
          <div class="user-input">
            <textarea
              class="user-input-field"
              v-model="userMessage"
              placeholder="请输入预处理需求描述..."
            />
            <el-button
              class="user-input-button"
              icon="el-icon-s-promotion"
              type="primary"
              circle
              @click="sendMessage"
            ></el-button>
          </div>
        </div>

      </el-card>
    </div>

    <el-dialog
      title="新建预处理实验"
      :visible.sync="dialogFormVisible"
      width="650px"
      class="new-dia"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item
          label="实验名称"
          prop="name"
        >
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="多数据集预处理">
          <el-radio
            v-model="form.multi"
            :label="0"
          >否</el-radio>
          <el-radio
            v-model="form.multi"
            :label="1"
          >是</el-radio>
        </el-form-item>

        <el-form-item
          label="根数据集"
          v-show="form.multi"
        >
          <el-select
            v-model="form.multi_dataset_id"
            placeholder="选择数据集"
            @change="getDatasetId"
          >
            <el-option
              v-for="item in datasetList"
              :value="item.id"
              :key="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="子数据集"
          v-show="form.multi"
        >
          <el-select
            v-model="form.multi_name"
            placeholder="选择子数据集"
          >
            <el-option
              v-for="item in childDatasetList"
              :value="item.children_name"
              :key="item.children_id"
              :label="item.children_name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="实验描述">
          <el-input
            type="textarea"
            v-model="form.description"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="上传代码"
          prop="file"
        >
          <el-upload
            class="upload-new-pre"
            action="#"
            accept=".py"
            ref="pre_upload"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :auto-upload="false"
            :on-exceed="uploadExceed"
            :limit="1"
          >
            <el-button
              size="small"
              slot="trigger"
              type="primary"
              plain
            >点击上传</el-button>
            <el-button
              icon="el-icon-download"
              size="small"
              style="margin-left: 10px;"
              type="success"
              plain
              @click="download"
            >下载模板文件</el-button>
            <div
              class="el-upload__tip"
              slot="tip"
            >仅支持 .py 文件
            </div>
          </el-upload>

        </el-form-item>

        <el-form-item
          label="样例参数"
          prop="arguments"
        >
          <el-input
            type="textarea"
            v-model="form.arguments"
            placeholder='json格式，示例：{"subset":"日期"},没有参数请填{}'
          ></el-input>
        </el-form-item>
        <el-form-item label="保存预处理方法">
          <el-radio
            v-model="form.save_method"
            :label="0"
          >否</el-radio>
          <el-radio
            v-model="form.save_method"
            :label="1"
          >是</el-radio>
        </el-form-item>

        <el-form-item label="保存处理后的数据集">
          <el-radio
            v-model="form.save_data"
            :label="0"
          >否</el-radio>
          <el-radio
            v-model="form.save_data"
            :label="1"
          >是</el-radio>
        </el-form-item>

        <div v-show="form.save_data == 1">
          <el-form-item label="处理后的数据集名称">
            <el-input v-model="form.save_data_name"></el-input>
          </el-form-item>
          <el-form-item label="数据集简介">
            <el-input
              type="textarea"
              v-model="form.short_description"
            ></el-input>
          </el-form-item>
          <el-form-item label="数据集详细描述">
            <el-input
              type="textarea"
              v-model="form.long_description"
            ></el-input>
          </el-form-item>
        </div>

        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('form')"
          >立即创建</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>

</template>

<script>
import avatarURL from '../assets/gpt.jpg'

export default {
  components: {
  },

  props: ['id', 'detail'],
  watch: {
    detail: function (newVal, oldVal) {
      this.output = []
      this.outputVisible = false
    }
  },

  data() {
    const fileMustUpload = (rule, value, callback) => {
      if (this.form.file == null) {
        callback("请上传文件");
      }
      else callback();
    }

    return {
      dialogFormVisible: false,
      avatarURL: avatarURL,
      historyList: [],
      datasetList: '',
      childDatasetList: [],
      form: {
        name: '',
        multi_dataset_id: '',
        multi_name: '',
        file: null,
        arguments: '',
        save_method: 0,
        save_data: 0,
        save_data_name: '',
        multi: 0,
        description: ' ',
        short_description: ' ',
        long_description: ' '
      },
      rules: {
        name: [
          { required: true, message: '请输入实验名称', trigger: 'blur' },
        ],
        file: [{ required: true, validator: fileMustUpload, trigger: 'change' }],
        arguments: [
          { required: true, message: '请输入样例参数', trigger: 'blur' },
        ],
      },
      chatMessages: [
        { content: "您好！请告诉我您的预处理需求。", isUser: false },
      ],
      userMessage: "",
      output: [],
      header_name: [],
      currentPage: 1,
      pagesize: 10,
      total: 25,
      outputVisible: false,
      loading: true,
    }
  },

  created() {
  },


  mounted() {
    if(!this.login_manager.get()){
        return
      }
    this.get_prelist()
    this.getDatasetList()
  },

  methods: {
    get_prelist() {
      var that = this;
      this.$http_wang({
        url: '/processfile/',
        method: "get",
      }).then((res) => {
        if (res.status == 200) {
          let data = res.data
          that.historyList = data.results
        } 
        else if(res.status == 403 || res.response.status == 403){
          that.$notify.error({
            title: '未登录',
            duration: 5000
          });
        }
        else {
          that.$notify.error({
            title: '服务器失败 /processfile/',
            message: res.response,
            duration: 5000
          });
        }
      });
    },

    new_pre(formName) {
      let that = this
      var params = new FormData()
      params.append('file', this.form.file.raw)
      params.append('name', this.form.name)
      params.append('description', this.form.description)
      params.append('dataset_name', this.detail.name)
      params.append('arguments', this.form.arguments)
      params.append('save_method', this.form.save_method)
      params.append('save_output', this.form.save_data)
      params.append('multi', this.form.multi)

      if (this.form.save_data == 1) {
        params.append('output_name', this.form.save_data_name)
        params.append('long_description', this.form.long_description)
        params.append('short_description', this.form.short_description)
      }
      if (this.form.multi == 1) {
        params.append('multi_name', this.form.multi_name)
      }
      this.$http_wang({
        url: "/processfile/",
        method: "post",
        data: params,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
        console.log("new", res)
        if (res.status == 200) {
          that.$notify({
            title: '创建成功',
            duration: 5000
          });
          this.output = JSON.parse(res.data.df)
          this.resetForm(formName)
          this.header_name = Object.keys(this.output[0])
          this.loading = false
          this.get_prelist()
        } else {
          this.loading = false
          that.$notify.error({
            title: '服务器失败 /processfile/ post',
            message: res.response,
            duration: 5000
          });
        }
      })

    },

    download() {
      window.open("http://162.105.88.214:4499/processfile/download_sample")
    },

    handleChange(file, fileList) {
      this.form.file = file
    },
    handleRemove(file, fileList) {
      this.form.file = null
    },
    uploadExceed() {
      this.$notify.warning({
        title: '提示',
        message: '您已添加了一个文件，如需替换，请先删除已添加的文件！',
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.new_pre(formName)
          this.dialogFormVisible = false
          this.outputVisible = true
          this.loading = true
          this.output = []
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    clearFiles() {
      this.$refs['pre_upload'].clearFiles()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.clearFiles();
      this.form.file = null
      this.form.multi_dataset_id = ''
      this.form.description = ''
      this.childDatasetList = []
      this.form.multi_name = ''
      this.form.short_description = ''
      this.form.long_description = ''
    },

    sendMessage() {
      if (this.userMessage.trim() !== "") {
        this.chatMessages.push({ content: this.userMessage, isUser: true });
        this.getChatGptResponse(this.userMessage);
        this.userMessage = "";
      }
    },
    getChatGptResponse(message) {
      // const chatGptResponse = "import pandas as pd\n\ndef process_require(df, **kwargs):\n    # 填补缺失值\n    df.fillna('Null', inplace=True)\n    \n    return df";
      console.log(message)
      let that = this
      let chatGptResponse = ''
      this.$http_wang({
        url: "/processfile/get_llm_code/",
        method: "post",
        data: {
          dataset_name: this.detail.name,
          require: message
        }
      }).then((res) => {
        if (res.status == 200) {
          chatGptResponse = res.data.result
          this.chatMessages.push({ content: chatGptResponse, isUser: false });
        } else {
          that.$notify.error({
            title: '服务器失败 :/processfile/get_llm_code/ post',
            message: res.response,
            duration: 5000
          });
        }
      })

    },

    //    分页
    handleSizeChange: function (size) {
      this.pagesize = size;
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
    },

    histroy_delete(row) {
      var that = this;
      this.$http_wang({
        url: "/processfile/" + row.id + '/',
        method: "delete",
      })
      that.$notify({
        title: '删除成功',
        duration: 5000
      });
      this.get_prelist()

    },

    onCopySuccess() {
      this.$message({
        message: '复制成功',
        type: 'success'
      });
    },

    getDatasetList() {
      this.$http_vis({
        url: "/predata/",
        method: "get",
      }).then((res) => {
        let data = res.data.results
        this.datasetList = data
      })
    },

    getDatasetId() {
      let url = "/predata/" + this.form.multi_dataset_id + "/";
      this.$http_vis({
        url: url,
        method: "get",
      }).then((res) => {
        this.datasetInfo = res.data;
        let data = res.data;
        this.childDatasetList = [];
        this.childDatasetList.push({
          children_id: this.form.multi_dataset_id,
          children_name: data.name
        })
        // console.log(data);
        // this.childDatasetList = data.children;
        for (let i in data.children) {
          let childItem = {
            children_id: data.children[i].children_id[0],
            children_name: data.children[i].children_name[0]
          }
          this.childDatasetList.push(childItem);
        }
        this.form.multi_name = data.name;
      })

    },


  }

}
</script>

<style>
.upload-new-pre .el-upload {
  width: auto !important;
}
</style>

<style  scoped>
.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #555;
}
.code-area {
  background-color: #f7f7f7;
}

.new-dia >>> .el-dialog__body {
  padding-right: 60px;
}
.el-upload__tip {
  line-height: 10px;
}

.chat-container {
}

.chat {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
}

.message {
  display: flex;
  /* align-items: center; */
  padding: 25px 150px;
  font-size: 15px;
  line-height: 1.75;
}

.avatar-container {
  margin-right: 25px;
  margin-top: 25px;
}

.user {
  color: #000;
}

.chatgpt {
  color: #000;
  background-color: #f7f7f7;
}

.user-input {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
}

.user-input-field {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  font-family: "Microsoft Yahei";
  font-size: 14px;
}

.user-input-button {
  margin-left: 15px;
}
.user-input-button:hover {
  background-color: #0056b3;
}

.gpt-card >>> .el-card__body {
  padding: 0;
}
</style>