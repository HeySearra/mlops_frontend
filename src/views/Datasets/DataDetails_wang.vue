<template>
  <div class="container">

    <div class="title">{{ detail.name }}</div>
    <el-tag size="small" type="success">{{ detail.task }}</el-tag>
    <el-tag type="warning" size="small">{{ detail.area }}</el-tag>
    <div class="info">{{ detail.short_description }}</div>

    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="数据集详情" name="first">
          <mavon-editor class='md' v-model="detail.long_description" defaultOpen="preview" :subfield="false"
            :editable="false" :toolbarsFlag="false" :shortCut="false" :boxShadow="false" />
          <el-card shadow="never">
            <div slot="header" class="card-title">
              <span>数据集预览</span>
              <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-download"
                @click="Download">下载数据集</el-button>
            </div>
<!--            <json-viewer :value="JSON.parse(this.detail.sample)"></json-viewer>-->
          </el-card>
          <dataset-intro> </dataset-intro>
        </el-tab-pane>

        <el-tab-pane label="实验" name="second">
          <div class="tabel">
            <el-table border tooltip-effect="dark" style="width: 100%" max-height="210" :data="resultList"
              :row-style="{height: '10px'}"
              :cell-style="{padding: '0'}"
               :header-cell-style="{
                'font-size': '14px',
                color: '#778192',
                'font-weight': 'normal',
                'text-align': 'center',
                'background-color': '#fafafa',
              }">
              <!-- @expand-change="expandChange" -->
              <!-- <el-table-column type="selection" align="center" width="55">
              </el-table-column> -->
              <el-table-column prop="task" label="任务名" width="160" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="开始时间" width="160" align="center">
                <template slot-scope="scope">{{ scope.row.created.substr(0, 10) }}
                  <span style=" margin-right: 5px;"></span>
                  {{ scope.row.created.substr(11, 8) }}</template>
              </el-table-column>
              <el-table-column label="状态" width="100" align="center">
                <template slot-scope="scope">
                  <el-tag align="center" :type="scope.row.run_status == 'running' ? 'warning' : 'success'"
                    disable-transitions>{{
                      scope.row.run_status }} </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="description" label="描述" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="owner" label="创建用户" width="80" align="center" show-overflow-tooltip>
              </el-table-column>

              <el-table-column type="expand">
                <template slot-scope="props">
                  <div class="expand">
                    <el-row :gutter="30">
                      <el-col :span="10">
                        <p>实验参数</p>
                        <el-descriptions :column="1" border>
                          <template v-for="(value, key) in props.row.metric">
                            <el-descriptions-item :label="key">{{ value }}</el-descriptions-item>
                          </template>
                        </el-descriptions>
                      </el-col>

                      <el-col :span="10">
                        <p>实验指标</p>
                        <el-descriptions :column="1" border>
                          <template v-for="(value, key) in props.row.metric">
                            <el-descriptions-item :label="key">{{ value }}</el-descriptions-item>
                          </template>
                        </el-descriptions>
                      </el-col>
                    </el-row>
                  </div>
                </template>
              </el-table-column>

            </el-table>
          </div>
          <pre-process-flow :dataset_id="id"></pre-process-flow>
        </el-tab-pane>

        <el-tab-pane label="视图" name="third">
          <dataset-statistic></dataset-statistic>
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
import PreProcessFlow from "../../components/PreProcessFlow";
import DatasetIntro from "../../components/DatasetIntro";
import DatasetStatistic from "../../components/DatasetStatistic";

export default {

  components: {
    PreProcessFlow,
    mavonEditor,
    JsonViewer,
    exptable,
    DatasetIntro,
    DatasetStatistic
  },

  data() {
    return {
      id: 1,
      detail: {
        "owner": "zpn",
        "name": "bank",
        "task": "命名实体识别",
        "area": "新闻",
        "short_description": "",
        "long_description": "## 数据集描述\n",
        "sample": " ",
        "data_source": "",
        "created": "2023-01-16T19:46:57.975103",
        "experiment_times": 0,
        "train_data": "",
        "train_data_path": "",
        "download_url": ""
      },
      exp_count: 2,
      exp_list: [{
        'created': '1',
        'run_status': '1',
        'model_name': '1',
        'dataset_name': '1',
      }],
      activeName: 'first',
      version_choose: '版本1',
      resultList: [{
        'id': 1,
        'task': '任务',
        'created': '2023-01-23',
        'run_status': 'success',
        'description': '1232432543657658787876',
        'owner': 'wlt',
        'model_config': {
          "1": "1",
          "2": "2",
        },
        'metric': {
          "1": "1",
          "2": "2",
        },
      },
      {
        'id': 1,
        'task': '任务',
        'created': '2023-01-23',
        'run_status': 'success',
        'description': '1232432543657658787876',
        'owner': 'wlt',
        'model_config': {
          "1": "1",
          "2": "2",
        },
        'metric': {
          "1": "1",
          "2": "2",
        },
      }, {
        'id': 1,
        'task': '任务',
        'created': '2023-01-23',
        'run_status': 'success',
        'description': '1232432543657658787876',
        'owner': 'wlt',
        'model_config': {
          "1": "1",
          "2": "2",
        },
        'metric': {
          "1": "1",
          "2": "2",
        },
      }, {
        'id': 1,
        'task': '任务',
        'created': '2023-01-23',
        'run_status': 'success',
        'description': '1232432543657658787876',
        'owner': 'wlt',
        'model_config': {
          "1": "1",
          "2": "2",
        },
        'metric': {
          "1": "1",
          "2": "2",
        },
      }, {
        'id': 1,
        'task': '任务',
        'created': '2023-01-23',
        'run_status': 'success',
        'description': '1232432543657658787876',
        'owner': 'wlt',
        'model_config': {
          '1': '1',
          '2': '2'
        },
        'metric': {
          '1': '1',
          '2': '2'
        },
      },
      ],
      form: {
        'name': 'name',
        'region': 'region',
        'date1': '2023.01',
        'date2': '2023.02',
        'delivery': true,
        'type': 'type',
        'resource': 'resource',
        'desc': 'desc',
      }
    }
  },

  created() {
    const id = this.$route.params.id
    this.id = parseInt(id)
    this.get_datasets(id)
  },


  mounted() {
  },

  methods: {
    change(value, render) {
      this.html = render;
    },

    get_datasets(id) {
      this.$http_wang({
        url: "/predata/" + id + '/',
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

    // expandChange(row, expandedRows) {
    //   if (expandedRows.length > 0) {
    //     let id = row.id
    //     this.$http({
    //       url: "/experiments/" + id + '/',
    //       method: "get",
    //     }).then((res) => {
    //       let data = res.data
    //       row.model_config = data.model_config
    //       row.metric = data.metric
    //     })
    //   }
    // },
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

.tabs1 {
  margin-top: 30px;
}

.el-card {
  margin-top: 10px;
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

.tabel {
  height: 220px;
}

.experiment {
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: row;
}

.experiment>div {
  height: 22px;
  flex: 1;
}
.todo{
  width: 400px;
  margin-right: 0px;
}

.graph{
  width: 100%;
  float: left;
  margin-left: 15px;
}
</style>
  
<style>/* .md .v-show-content {
    background-color: #fff !important;
  } */</style>