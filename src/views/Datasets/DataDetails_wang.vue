<template>
  <div class="container">

    <div class="title">{{ detail.name }}</div>
    <el-tag size="small" type="success">{{ detail.task }}</el-tag>
    <el-tag type="warning" size="small">{{ detail.area }}</el-tag>
    <div class="info">{{ detail.short_description }}</div>

    <div class="version">
      <el-tabs v-model="version_choose">
        <el-tab-pane v-for="(version, index) in versions" :label="version.name" :name="version.name" :key="index">
        </el-tab-pane>
      </el-tabs>
    </div>

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
            <json-viewer :value="JSON.parse(this.detail.sample)"></json-viewer>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="实验" name="second">
          <!-- <exptable :resultList="exp_list"></exptable> -->
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
              <!-- <el-table-column label="模型">
                <template slot-scope="scope">
                  <span @click="toModel(scope.row)" class="name">{{ scope.row.model_name }}</span> </template>
              </el-table-column> -->
              <!-- <el-table-column prop="model_version" label="版本" width="55" align="center">
              </el-table-column>
              <el-table-column label="数据集">
                <template slot-scope="scope">
                  <span @click="toDataset(scope.row)" class="name">{{ scope.row.dataset_name }}</span> </template>
              </el-table-column> -->

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
<!--          <div class="experiment">-->
<!--            <div title="左" style="">-->
<!--              <el-card shadow="never" class="todo">-->
<!--                <div slot="header" class="card-title">-->
<!--                  <span>待进行步骤</span>-->
<!--                </div>-->
<!--                <el-form :model="form" label-width="120px">-->
<!--                  <el-form-item label="Activity name">-->
<!--                    <el-input v-model="form.name" />-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="Activity zone">-->
<!--                    <el-select v-model="form.region" placeholder="please select your zone">-->
<!--                      <el-option label="Zone one" value="shanghai" />-->
<!--                      <el-option label="Zone two" value="beijing" />-->
<!--                    </el-select>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="Activity time">-->
<!--                    <el-col :span="11">-->
<!--                      <el-date-picker-->
<!--                        v-model="form.date1"-->
<!--                        type="date"-->
<!--                        placeholder="Pick a date"-->
<!--                        style="width: 100%"-->
<!--                      />-->
<!--                    </el-col>-->
<!--                    <el-col :span="2" class="text-center">-->
<!--                      <span class="text-gray-500">-</span>-->
<!--                    </el-col>-->
<!--                    <el-col :span="11">-->
<!--                      <el-time-picker-->
<!--                        v-model="form.date2"-->
<!--                        placeholder="Pick a time"-->
<!--                        style="width: 100%"-->
<!--                      />-->
<!--                    </el-col>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="Instant delivery">-->
<!--                    <el-switch v-model="form.delivery" />-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="Activity type">-->
<!--                    <el-checkbox-group v-model="form.type">-->
<!--                      <el-checkbox label="Online" name="type" />-->
<!--                      <el-checkbox label="Promotion" name="type" />-->
<!--                      <el-checkbox label="Offline" name="type" />-->
<!--                      <el-checkbox label="Simple" name="type" />-->
<!--                    </el-checkbox-group>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="Resources">-->
<!--                    <el-radio-group v-model="form.resource">-->
<!--                      <el-radio label="Sponsor" />-->
<!--                      <el-radio label="Venue" />-->
<!--                    </el-radio-group>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="Activity form">-->
<!--                    <el-input v-model="form.desc" type="textarea" />-->
<!--                  </el-form-item>-->
<!--                  <el-form-item>-->
<!--                    <el-button type="primary" @click="onSubmit">Create</el-button>-->
<!--                    <el-button>Cancel</el-button>-->
<!--                  </el-form-item>-->
<!--                </el-form>-->
<!--              </el-card>-->

<!--            </div>-->
<!--            <div title="右" style="">-->
<!--              <el-card class="graph" shadow="never"></el-card>-->
<!--            </div>-->
<!--          </div>-->
          <pre-process-flow :dataset_id="id"></pre-process-flow>
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

export default {

  components: {
    PreProcessFlow,
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
      exp_count: 2,
      exp_list: [{
        'created': '1',
        'run_status': '1',
        'model_name': '1',
        'dataset_name': '1',
      }],
      activeName: 'first',
      version_choose: '版本1',
      versions: [
        { 'name': '版本1' },
        { 'name': '版本2' },
        { 'name': '版本3' },
        { 'name': '版本4' },
        { 'name': '版本5' },
      ],
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