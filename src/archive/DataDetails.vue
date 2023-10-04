<template>
  <div class="container">

    <div class="title">{{detail.name}}</div>
    <el-tag
      size="small"
      type="success"
    >{{detail.task }}</el-tag>
    <el-tag
      type="warning"
      size="small"
    >{{detail.area}}</el-tag>
    <div class="info">{{detail.short_description}}</div>

    <div class="tabs">

      <el-tabs v-model="activeName">
        <el-tab-pane
          label="数据集详情"
          name="first"
        >
          <mavon-editor
            class='md'
            v-model="detail.long_description"
            defaultOpen="preview"
            :subfield="false"
            :editable="false"
            :toolbarsFlag="false"
            :shortCut="false"
            :boxShadow="false"
          />

          <el-card shadow="never">
            <div
              slot="header"
              class="card-title"
            >
              <span>数据集预览</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                icon="el-icon-download"
                @click="Download"
              >下载数据集</el-button>
            </div>
            <json-viewer :value="JSON.parse(this.detail.sample)"></json-viewer>
          </el-card>

        </el-tab-pane>

        <el-tab-pane
          label="实验"
          name="second"
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
import JsonViewer from 'vue-json-viewer';
import exptable from '../../components/ExpTable.vue'

export default {

  components: {
    mavonEditor,
    JsonViewer,
    exptable
  },

  data() {
    return {
      id: undefined,
      detail: {
        owner: "zpn",
        "name": "bank",
        "task": "命名实体识别",
        "area": "新闻",
        "short_description": "",
        "long_description": "## 数据集描述\n",
        "sample": " ",
        data_source: "",
        "created": "2023-01-16T19:46:57.975103",
        "experiment_times": 0,
        "train_data": "",
        "train_data_path": "",
        "download_url": ""
      },
      exp_count: 0,
      exp_list: [],
      activeName: 'first',
    }
  },

  created() {
    const id = this.$route.params.id
    this.id = id
    this.get_datasets(id)
  },


  mounted() {
  },

  methods: {
    change(value, render) {
      this.html = render;
    },

    get_datasets(id) {
      this.$http({
        url: "/datasets/" + id + '/',
        method: "get",
      }).then((res) => {
        let data = res.data
        this.detail = data
      }),

        this.$http({
          url: "/datasets/" + id + '/experiments/',
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

    Download() {
      window.open("/api/datasets/" + this.id + '/download/')
    },
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
  margin-right: 200px;
  line-height: 24px;
  font-size: 15px;
  color: #555;
  letter-spacing: 0.5px;
  font-family: Arial, "Microsoft yehei";
  text-justify: inter-word;
  text-align: justify;
}

.tabs {
  margin-top: 30px;
}

.el-card {
  margin-top: 20px;
}

.v-note-wrapper {
  z-index: 1 !important;
}

.md {
  margin-bottom: 30px;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #555;
}

.el-tag {
  margin-right: 10px;
  margin-top: 8px;
}
</style>

<style>
/* .md .v-show-content {
  background-color: #fff !important;
} */
</style>