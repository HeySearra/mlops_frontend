<template>
  <div class="container">
    <el-form>
      <el-row :gutter="20">
        <el-col :span="4"><el-form-item label="数据集">
          <el-select v-model="cur_dataset" placeholder="选择数据集" @change="getDatasetId($event)">
            <el-option v-for="item in datasetList" :value="item.dataset_id" :key="item.dataset_id"
                       :label="item.dataset_name"></el-option>
          </el-select>
        </el-form-item></el-col>
        <el-col :span="4"><el-form-item label="预处理">
          <el-select v-model="cur_process" placeholder="选择预处理流程" @change="getProcess($event)">
            <el-option v-for="item in processList" :value="item.process_id" :key="item.process_id"
                       :label="item.process_name"></el-option>
          </el-select>
        </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
        :data="staticInfo"
        :row-key="getRowKey"
        ref="staticTable"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          :selectable="selectable"
          :reserve-selection="true"
          width="55">
      </el-table-column>
      <el-table-column prop="feature_name" label="特征"></el-table-column>
      <el-table-column prop="min" label="最小值"></el-table-column>
      <el-table-column prop="max" label="最大值"></el-table-column>
      <el-table-column prop="mean" label="均值"></el-table-column>
      <el-table-column prop="std" label="标准差"></el-table-column>
      <el-table-column prop="p25" label="25%"></el-table-column>
      <el-table-column prop="p50" label="50%"></el-table-column>
      <el-table-column prop="p75" label="75%"></el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="multiFeatureTest()">多特征检验</el-button>
    </div>
    <el-dialog title="多特征检验"
               :visible.sync="MultiTestShow"
               width="40%">
      <el-table
          :data="MultiTestTable"
          stripe
          style="width: 100%">
        <el-table-column
            prop="method"
            label="检验方法">
        </el-table-column>
        <el-table-column
            prop="value"
            label="值">
        </el-table-column>
      </el-table>
    </el-dialog>

    <div style="margin-top: 40px">
    </div>

    <el-form>
      <el-form-item label="模型">
        <el-select v-model="cur_model" placeholder="选择模型" @change="getModelId($event)">
          <el-option v-for="item in modelList" :value="item.model_id" :key="item.model_id"
                     :label="item.model_name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-descriptions title="Metrics" v-if="result_all.type=='b-cls'?true:false" :column="3" style="width: 550px" border>
      <el-descriptions-item>
        <template slot="label">acc</template>{{result_all.metrics.acc}}</el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">auprc</template>{{result_all.metrics.auprc}}</el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">auroc</template>{{result_all.metrics.auroc}}</el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">f1_score</template>{{result_all.metrics.f1}}</el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">minpse</template>{{result_all.metrics.minpse}}</el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">pre0</template>{{result_all.metrics.pre0}}</el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">precision</template>{{result_all.metrics.precision}}</el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">recall</template>{{result_all.metrics.recall}}</el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">specificity</template>{{result_all.metrics.specificity}}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="Metrics" v-if="result_all.type=='reg'?true:false" :column="2" style="width: 550px" border>
      <el-descriptions-item>
        <template slot="label">mse</template>{{result_all.metrics.acc}}</el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">mae</template>{{result_all.metrics.auprc}}</el-descriptions-item>
    </el-descriptions>

    <div ref="chart" :style="{width: '1500px',height: '500px'}"></div>

    <el-row>
      <el-col :span="4"><el-input placeholder="搜索单条数据" v-model="curSingleData"></el-input></el-col>
      <el-col :span="6"><el-button type="info" @click="showSingleData()">查看源数据和预测结果</el-button></el-col>
    </el-row>
    <div ref="single_chart" :style="{width: '1500px',height: '500px'}"></div>
    <el-dialog title="源数据和预测结果"
               :visible.sync="dialogShow"
               width="40%">
      <json-viewer :value="singleData"
                   :expand-depth=5
                   copyable
                   boxed
                   sort></json-viewer>
    </el-dialog>

  </div>
</template>

<script>
const echarts = require('echarts');
export default {

  components: {

  },

  data() {
    return {
      input: '',
      cur_dataset: '',
      cur_process: '',
      cur_model: '',
      datasetList: [
        {
          dataset_id: "dataset_12321",
          dataset_name: "hm"
        },
        {
          dataset_id: "dataset_12322",
          dataset_name: "tongji"
        },
        {
          dataset_id: "dataset_12323",
          dataset_name: "xianggang"
        }
      ],
      processList: [
        {
          process_id: "process_12321",
          process_name: "补全"
        },
        {
          process_id: "process_12322",
          process_name: "归一化"
        },
      ],
      staticInfo: [],
      staticMultipleSelection: [],
      limitNum: 2,
      MultiTestShow: false,
      MultiTestTable: [
        {
          method: '皮尔逊相关系数',
          value: '0.85'
        },
        {
          method: 'T-test',
          value: 't=1.1,p=0.75'
        }
      ],
      modelList: [
        {
          model_id: "model_12321njk",
          model_name: "model_name_adksjh1",
          model_task: "mortality"
        },
        {
          model_id: "model_12322njk",
          model_name: "model_name_adksjh2",
          model_task: "mortality"
        },
        {
          model_id: "model_12323njk",
          model_name: "model_name_adksjh3",
          model_task: "mortality"
        },
        {
          model_id: "model_12324njk",
          model_name: "model_name_adksjh4",
          model_task: "mortality"
        }
      ],
      result_all: {
        type: "b-cls",
        metrics: {
          auroc: 0.021,
          auprc: 0.51,
          minpse: 0.51,
          acc: 0.51,
          pre0: 0.51,
          precision: 0.51,
          specificity: 0.51,
          recall: 0.51,
          f1: 0.51
        },
        explanation: [
          {
            type: "att_visit",
            data: {
              feature1: [
                0.51,
                0.51,
                0.51
              ],
              feature2: [
                0.51,
                0.51,
                0.51
              ]
            }
          },
          {
            type: "att_feature",
            data: {
              feature1: [
                0.51,
                0.51,
                0.51
              ],
              feature2: [
                0.51,
                0.51,
                0.51
              ]
            }
          }
        ]
      },
      dialogShow: false,
      singleData: {
        sample_data: {
          feature1: [
            1,
            2,
            3
          ],
          feature2: [
            1,
            2,
            3
          ]
        },
        output: [
          0,
          51,
          0.51,
          0.51
        ],
        explanation: [
          {
            type: "att_visit",
            data: {
              "feature1": [
                0.51,
                0.51,
                0.51
              ],
              "feature2": [
                0.51,
                0.51,
                0.51
              ]
            }
          },
          {
            type: "att_feature",
            data: {
              "feature1": [
                0.51,
                0.51,
                0.51
              ],
              "feature2": [
                0.51,
                0.51,
                0.51
              ]
            }
          }
        ]
      },
      curSingleData:'',

    }
  },

  created() {

  },


  mounted() {

  },

  methods: {
    getDatasetId(val){
      console.log(val);
    },
    getProcess(val){
      console.log(val);
      this.staticInfo = [
        {
          feature_name: "K",
          mean:0.21,
          std:0.02,
          min:0.18,
          max:0.23,
          p25:0.21,
          p50:0.22,
          p75:0.225,
        },
        {
          feature_name: "Na",
          mean:0.21,
          std:0.02,
          min:0.18,
          max:0.23,
          p25:0.21,
          p50:0.22,
          p75:0.225,
        },
        {
          feature_name: "Ca",
          mean:0.21,
          std:0.02,
          min:0.18,
          max:0.23,
          p25:0.21,
          p50:0.22,
          p75:0.225,
        },
      ]
    },
    getRowKey(row){
      return row.id;
    },
    handleSelectionChange(val) {
      if (val.length > this.limitNum) {
        this.limitFn(val)
        return
      }
      this.staticMultipleSelection = [...val]
      // console.log(this.staticMultipleSelection);
    },
    // 限制数量方法
    limitFn (list) {
      this.$refs.staticTable.clearSelection();
      for (let i = 0; i < this.limitNum; i++) {
        this.$refs.staticTable.toggleRowSelection(list[i]);
      }
    },
    // 判断复选框是否可以选择
    selectable (row) {
      let index = this.staticMultipleSelection.findIndex(v => v.id === row.id)
      if (this.staticMultipleSelection.length >= this.limitNum) {
        if (index !== -1) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    multiFeatureTest() {
      var features = [];
      for (let item in this.staticMultipleSelection) {
        features.push(this.staticMultipleSelection[item].feature_name);
      }
      console.log(features);
      this.MultiTestShow = true;
    },
    getModelId(val){
      console.log(val);
      if (val=='model_12324njk') this.result_all.type = 'reg';
      if (val=='model_12321njk') this.result_all.type = 'b-cls';
      this.initCharts();
    },
    showSingleData() {
      this.dialogShow = true;
      this.initSingleCharts();
      console.log(this.curSingleData);
    },
    initCharts () {
      let myChart = echarts.init(this.$refs.chart);
      // 绘制图表
      myChart.setOption({
        title: {
          text: 'attention特征重要性'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['K', 'Ca', 'Na']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2022-1-2', '2022-2-4', '2022-3-1']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'K',
            type: 'line',
            data: [0.2, 0.1, 0.25]
          },
          {
            name: 'Ca',
            type: 'line',
            data: [0.4, 0.5, 0.25]
          },
          {
            name: 'Na',
            type: 'line',
            data: [0.4, 0.4, 0.5]
          },
        ]
      });
    },
    // 生成大小一样样色不同的圆点
    markDot(color) {
      let domHtml = '<span style="' +
          'display: inline-block;' +
          'margin-right: 8px;' +
          'margin-bottom: 2px;' +
          'border-radius: 6px;' +
          'width: 6px;' +
          'height: 6px;' +
          `background-color: ${color}` +
          '"></span>'
      return domHtml;
    },
    initSingleCharts () {
      let myChart = echarts.init(this.$refs.single_chart);
      // 绘制图表
      myChart.setOption({
        title: {
          text: '单条数据展示'
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let result = params[0].name + "</br>";
            for (var i=0; i<4; i++) {
              result += `${this.markDot(params[i].color)}${params[i].seriesName}：${params[i].data}</br>`
            }
            result += '动态特征重要性' + "</br>";
            for (i=4; i<params.length; i++) {
              result += `${this.markDot(params[i].color)}${params[i].seriesName}：${params[i].data}</br>`
            }
            return result;
          }
        },
        legend: {
          data: ['K', 'Ca', 'Na','Output']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2022-1-2', '2022-2-4', '2022-3-1']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'K',
            type: 'line',
            data: [10, 23, 35]
          },
          {
            name: 'Ca',
            type: 'line',
            data: [50, 45, 53]
          },
          {
            name: 'Na',
            type: 'line',
            data: [42, 30, 38]
          },
          {
            name: 'Output',
            type: 'line',
            areaStyle: {
              opacity: 0.2
            },
            data: [24, 25, 32]
          },
          {
            name: 'Na',
            type: 'line',
            data: ['33%', '30%', '25%'],
            show: false
          },
          {
            name: 'K',
            type: 'line',
            data: ['33%', '45%', '25%'],
            show: false
          },
          {
            name: 'Ca',
            type: 'line',
            data: ['33%', '25%', '50%'],
            show: false
          }
        ]
      });
    }
  }

}
</script>

<style  scoped>
.container {
  padding: 40px 80px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}

a {
  text-decoration: inherit;
}
</style>