<template>
  <div class="container">

    <div class="title">{{model.model_name}}</div>
    <div class="info">{{model.short_description}}</div>

    <div class="tabs">

      <el-tabs v-model="activeName">
        <el-tab-pane
          label="模型详情"
          name="first"
        >

          <mavon-editor
            class='md'
            v-model="model.long_description"
            defaultOpen="preview"
            :subfield="false"
            :editable="false"
            :toolbarsFlag="false"
            :shortCut="false"
            :boxShadow="false"
          />

          <el-row :gutter="25">
            <el-col :span="10">
              <p>模型依赖</p>
              <el-descriptions
                :column="2"
                border
              >
                <template v-for="(value,key) in model.dependency">
                  <el-descriptions-item :label="key">{{value}}</el-descriptions-item>
                </template>
              </el-descriptions>
            </el-col>

            <el-col :span="14">
              <div>
                <p>模型参数</p>

                <el-table
                  border
                  :header-cell-style="{background:'#fafafa'}"
                  :data="Object.entries(model.parameter)"
                  max-height="300"
                >
                  <el-table-column label="名称">
                    <template slot-scope="scope">
                      <span> {{ scope.row[0] }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="默认值">
                    <template slot-scope="scope">
                      <span> {{ scope.row[1] }}</span>
                    </template>
                  </el-table-column>

                </el-table>
              </div>
            </el-col>
          </el-row>

        </el-tab-pane>

        <el-tab-pane
          label="模型文件"
          name="second"
        >
          <div class="code">

            <div class="file_action">
              <el-select
                v-model="model.currrent_branch"
                placeholder="请选择分支"
                size="small"
                style="width:120px"
                @change="change_branch"
              >
                <el-option
                  v-for="item in model.branch_list"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
              <div style=" float:right">
                <el-button
                  type="primary"
                  v-if="this.reading"
                  style="margin-right:15px;"
                  size="medium"
                  @click="reading = false"
                >返回</el-button>

                <el-button
                  v-else
                  style="margin-right:15px;"
                  type="success"
                  icon="el-icon-download"
                  size="medium"
                  plain
                  @click="download"
                >下载</el-button>
                <el-popover
                  trigger="click"
                  placement="bottom-end"
                >
                  <el-input
                    :value=model.clone_path
                    disabled
                    style="width: 340px"
                  >
                    <el-button
                      slot="append"
                      v-clipboard:copy=model.clone_path
                      v-clipboard:success="firstCopySuccess"
                      v-clipboard:error="firstCopyError"
                    >复制
                    </el-button>
                  </el-input>
                  <el-button
                    type="primary"
                    plain
                    size="medium"
                    slot="reference"
                  >克隆</el-button>

                </el-popover>
              </div>
            </div>

            <div
              class="file_holder"
              v-if="this.reading"
            >
              <div class='file_title'> <i class="el-icon-tickets"></i> {{ this.file_name}}</div>

              <div
                v-html="this.file_content"
                style="padding-left: 15px;"
              ></div>

            </div>

            <el-table
              v-else
              border
              :data="model.file_list"
              :header-cell-style="{
              background:'#fafafa',
              padding: '10px'}"
            >
              <el-table-column label="文件列表">
                <template slot-scope="scope">
                  <span
                    class="file-name"
                    @click="read_file(scope.row)"
                  > <i class="el-icon-tickets"></i> {{ scope.row }}</span>
                </template>
              </el-table-column>

            </el-table>

          </div>
        </el-tab-pane>

        <el-tab-pane
          label="实验"
          name="third"
        >
          <div v-if="exp_count==0"> 暂无相关实验 </div>
          <div v-else>
            <exptable :resultList="exp_list"></exptable>
          </div>

        </el-tab-pane>
      </el-tabs>

    </div>
  </div>

</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import exptable from '../../components/ExpTable.vue'


export default {

  components: {
    mavonEditor,
    exptable
  },

  data() {
    return {
      input: '',
      id: undefined,
      reading: false,
      model: {
        "id": 1,
        "owner": "",
        "model_name": "",
        "short_description": "",
        "long_description": "## 模型描述",
        "created": "",
        "task": "",
        "currrent_branch": "dev",
        "branch_list": [],
        "file_list": [],
        "clone_path": "",
        "dependency": {},
        "parameter": {}
      },
      file_content: '',
      file_name: '',
      params: [],
      activeName: 'first',
      textarea: '',
      exp_count: 0,
      exp_list: [],
    }
  },

  created() {
    const id = this.$route.params.id
    this.id = id
    this.get_model(id)
  },


  mounted() {
  },

  methods: {
    get_model(id) {
      this.$http({
        url: "/modelrepos/" + id + '/',
        method: "get",
      }).then((res) => {
        let data = res.data
        this.model = data
      })

      this.$http({
        url: "/modelrepos/" + id + '/experiments/',
        method: "get",
      }).then((res) => {
        let data = res.data
        data.results.map(item => {
          item.model_config = '';
          item.metric = '';
        });
        this.exp_count = data.count
        this.exp_list = data.results
      })
    },

    get_file(name) {
      this.$http({
        url: "/modelrepos/" + this.id + '/file/',
        method: "get",
        params: {
          file_name: name
        }
      }).then((res) => {
        this.file_content = res.data
      })
    },

    read_file(arg) {
      let name = arg
      this.get_file(name)
      this.reading = true
      this.file_name = name
    },

    download() {
      window.open("/api/modelrepos/" + this.id + '/download/')
    },

    firstCopySuccess(e) {
      console.log("copy arguments e:", e);
      this.$message({
        message: '复制成功！',
        type: 'success'
      });
    },
    firstCopyError(e) {
      console.log("copy arguments e:", e);
      this.$message.error('复制失败');
    },

    change_branch() {
      console.log('11')
      this.$http({
        url: "/modelrepos/check_out/",
        method: "get",
        params: {
          model_id: this.id,
          branch_name: this.model.currrent_branch
        }
      }).then((res) => {
        this.get_model(this.id)
      })
    }

  }
}
</script>

<style  scoped>
.container {
  padding: 40px 180px;
}

.title {
  cursor: pointer;
  font-size: 24px;
  font-family: SimHei-Normal;
  font-weight: normal;
  text-align: LEFT;
  color: #5194e9;
  line-height: 30px;
}

.info {
  margin-top: 9px;
  line-height: 24px;
  font-size: 15px;
  color: #555;
  letter-spacing: 0.5px;
  font-family: Arial, "Microsoft yehei";
  text-justify: inter-word;
  text-align: justify;
}

.num {
  font-weight: bold;
  margin-top: 9px;
  line-height: 20px;
  font-size: 14px;
  color: #777;
}

.tabs {
  margin-top: 30px;
}
.el-card {
  margin-top: 20px;
  border: 1px solid #c0c4cc;
  margin-left: 250px;
}

.code >>> .el-table__cell {
  padding: 5px 0px;
}

.v-note-wrapper {
  z-index: 1 !important;
  min-height: 100px;
}
.file-name {
  cursor: pointer;
  color: #1283ba;
  font-family: "Segoe UI";
}

.file_action {
  overflow: hidden;
  margin-bottom: 10px;
}

.file_title {
  color: #333;
  font-size: 15px;
  line-height: 27px;
  padding: 7px 10px 5px 20px;
  background: #fcfcfc;
  border-bottom: 1px solid #dce3e8;
}

.md {
  margin: 10px 0 25px 0;
}
</style>