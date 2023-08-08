<template>
  <div class="container">
    <el-form class="dataset-list-form-container">
      <div class="form-row">
        <el-form-item label="选择数据集">
          <el-select v-model="cur_dataset_id" placeholder="选择数据集" @change="getDatasetId($event)">
            <el-option v-for="item in datasetList" :value="item.id" :key="item.id"
                        :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择子数据集">
          <el-select v-model="dataset_id" placeholder="选择子数据集" @change="getChildDatasetId($event)">
            <el-option v-for="item in childDatasetList" :value="item.children_name" :key="item.children_id"
                        :label="item.children_name"></el-option>
          </el-select>
        </el-form-item>
      </div>
      
    </el-form>
    <el-descriptions title="数据集基本信息" class="dataset-info">
      <el-descriptions-item label="数据集ID">{{ datasetInfo.id }}</el-descriptions-item>
      <el-descriptions-item label="数据集任务">{{ datasetInfo.task }}</el-descriptions-item>
      <el-descriptions-item label="数据集领域">{{ datasetInfo.area }}</el-descriptions-item>
      <el-descriptions-item label="数据集创建者">{{ datasetInfo.owner }}</el-descriptions-item>
      <el-descriptions-item label="数据集创建时间">{{ datasetInfo.created }}</el-descriptions-item>
      <el-descriptions-item label="描述信息">{{ datasetInfo.long_description }}</el-descriptions-item>
  </el-descriptions>

  <dataset-statistic ref="dataView" :id="dataset_id_num"></dataset-statistic>

    <el-table
        :data="staticInfo"
        :row-key="getRowKey"
        ref="staticTable"
        height="500"
        stripe
        class="static-info"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          :selectable="selectable"
          :reserve-selection="true"
          width="55">
      </el-table-column>
      <el-table-column prop="feature_name" label="特征" header-align="center"></el-table-column>
      <el-table-column prop="min" label="最小值" header-align="center"></el-table-column>
      <el-table-column prop="max" label="最大值" header-align="center"></el-table-column>
      <el-table-column prop="mean" label="均值" header-align="center"></el-table-column>
      <el-table-column prop="std" label="标准差" header-align="center"></el-table-column>
      <el-table-column prop="p25" label="25%" header-align="center"></el-table-column>
      <el-table-column prop="p50" label="50%" header-align="center"></el-table-column>
      <el-table-column prop="p75" label="75%" header-align="center"></el-table-column>
      <el-table-column label="正正态性检验态" header-align="center">
        <el-table-column prop="ntest_s" label="统计值" header-align="center"></el-table-column>
        <el-table-column prop="ntest_p" label="p值" header-align="center"></el-table-column>
      </el-table-column>
      <el-table-column prop="hist" label="频率分布直方图" header-align="center" >
        <template slot-scope="scope">
        <!-- <e-charts class="chart1" :option="getOption(scope.row.num)"></e-charts> -->
        <div class="chart3" :ref="scope.row.feature_name"></div>
        </template>
      </el-table-column>
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

    <el-form>
      <div style="margin-top: 40px;">
        <el-row>
          <el-col :span="6">
            <el-form-item label="数据可视化控件">
              <el-select v-model="figureClass" placeholder="图表类型" @change="getFigureClass">
                <el-option v-for="item in figureList" :value="item.id" :key="item.id"
                            :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="横轴">
              <el-select v-model="xFeature" placeholder="横轴" >
                <el-option v-for="item in featureList" :value="item" :key="item"
                            :label="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="纵轴">
              <el-select multiple v-model="yFeature" placeholder="纵轴" :disabled="yDisabled">
                <el-option v-for="item in featureList" :value="item" :key="item"
                            :label="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-button @click="filterVisible = true">过滤器</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-button @click="showFigure()">生成</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div ref="explore_chart" :style="{width: '100%',height: '500px'}"></div>

    <el-dialog
      title="过滤"
      :visible.sync="filterVisible"
      width="30%"
      :before-close="handleClose">
      <span>请输入过滤信息，格式为[字段名]==***，如pdid==98</span>
      <el-input v-model="filterString" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="filterVisible = false">取 消</el-button>
        <el-button type="primary" @click="figureFilter()">确 定</el-button>
      </span>
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

    <!-- <div ref="chart" :style="{width: '1500px',height: '500px'}"></div> -->
    <div ref="heatmap" :style="{width: '1500px',height: '300px'}"></div>
    单条数据解释性展示
    <el-row>
      <el-col :span="4"><el-input placeholder="搜索单条数据" v-model="curSingleData"></el-input></el-col>
      <el-col :span="6"><el-button type="info" @click="showSingleData()">查看源数据和预测结果</el-button></el-col>
    </el-row>
    <div ref="single_chart" :style="{width: '1000px',height: '500px'}"></div>
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
import { features } from 'process';
import DatasetStatistic from "../../components/DatasetStatistic";

const echarts = require('echarts');
export default {

  components: {
    DatasetStatistic
  },

  data() {
    return {
      input: '',
      cur_dataset_id: this.$route.query.param,
      cur_dataset_name: "",
      cur_model: '',
      datasetList: '',
      dataset_id: '',
      dataset_id_num: '',
      datasetInfo: '',
      childDatasetList: [],
      staticInfo: [],
      staticMultipleSelection: [],
      limitNum: 2,
      MultiTestShow: false,
      MultiTestTable: [],
      figureList: [
        {
          name: "折线图",
          id: "line",
        },
        {
          name: "频次分布直方图",
          id: "bar",
        }
      ],
      figureClass: "",
      featureList: ["pdid", "尿素", "血蛋白", "日期"],
      xFeature: "",
      yFeature: [],
      yDisabled: false,
      figureData: {
      },
      filterVisible: false,
      filterString: "pdid==98",
      modelList: [
        
      ],
      model_id: 'd1_model1',
      result_all: '',
      globalXaxis: '',
      globalData:'',
      dialogShow: false,
      singleData: '',
      singleTimestep: '',
      singleLegends: '',
      singleSeries: '',
      singleSelected: {},
      curSingleData:'1231',

    }
  },

  created() {
    this.getDatasetList();
    this.getModelList();
  },


  mounted() {

  },

  methods: {
    getDatasetList() {
      // console.log(this.cur_dataset);
      this.$http_vis({
        url: "/predata/?list=1",
        method: "get",
      }).then((res) => {
          let data = res.data.results
          this.datasetList = data
          // console.log(this.datasetList);
      })
    },
    getModelList() {
      this.$http_vis({
          url: "/interpretability/model/ids/",
          method: "post",
          data: {
            dataset_id: this.dataset_id
          }
        }).then((res) => {
          let data = res.data.data
          this.modelList = data
        })
    },
    getDatasetId(val){
      let url = "/predata/" + this.cur_dataset_id + "/";
      this.$http_vis({
        url: url,
        method: "get",
        // params: {
        //   id: this.cur_dataset
        // }
      }).then((res) => {
        this.datasetInfo = res.data;
        let data = res.data;
        this.childDatasetList = [];
        this.childDatasetList.push({
          children_id: this.cur_dataset_id,
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
        this.dataset_id = data.name;
        this.dataset_id_num = this.cur_dataset_id;
        this.getDataView();
        this.getProcess();
        // console.log(this.childDatasetList);
      })
      // console.log(val);
      // this.dataset_id = val;
      // this.getProcess(val);
    },
    getChildDatasetId(val) {
      console.log(val);
      for (let i in this.childDatasetList) {
        if (this.childDatasetList[i].children_name == val) {
          this.dataset_id_num = this.childDatasetList[i].children_id;
          break;
        } 
      }
      this.getDataView();
      this.getProcess();
    },
    getProcess(){
      let url = "/predata/" + this.dataset_id_num + "/";
      this.$http_vis({
        url: url,
        method: "get",
        }).then((res) => {
          // console.log(res.data);
          this.datasetInfo = res.data;
          let fList = res.data.sample.head;
          this.featureList = fList;
      });
      this.$http_vis({
          url: "/ana/sa/",
          method: "post",
          data: {
            dataset_id: this.dataset_id
          }
        }).then((res) => {
          let data = res.data.data;
          console.log(data);
          this.staticInfo = [];
          for (var i=0; i<data.feature_name.length; i++) {
            let item = {feature_name: data.feature_name[i], min: data.metric.min[i], max:data.metric.max[i], mean:data.metric.mean[i], std:data.metric.std[i],
                        p25:data.metric.quantile_25[i], p50:data.metric.quantitle_50[i], p75:data.metric.quantitle_75[i], ntest_s:data.metric.normaltest[i][0], 
                      ntest_p:data.metric.normaltest[i][1], hist:data.metric.histogram[i]};
            this.staticInfo.push(item);
          }
          this.tableCharts();
        })
    },
    getDataView() {
      this.$refs.dataView.getData(this.dataset_id_num, 0, 100);
      this.$refs.dataView.getAllStat(this.dataset_id_num);
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
    getFigureClass(val) {
      console.log(val);
      if (val=="bar") {
        this.yDisabled = true;
      }else {
        this.yDisabled = false;
      }
    },
    showFigure() {
      // console.log(this.dataset_id, this.xFeature, this.yFeature, this.figureClass, this.filterString);
      let requestData = {};
      if (this.figureClass=="line") {
        requestData = {
          dataset_id: this.dataset_id,
            x_feature: this.xFeature,
            y_features: this.yFeature,
            pic_type: this.figureClass,
            filter_str: this.filterString
        };
      }else {
        requestData = {
          dataset_id: this.dataset_id,
            x_feature: this.xFeature,
            pic_type: "hist",
            other_args:  {
              bins_num: 10
            }
        }
      }
      this.$http_vis({
          url: "/visualcomp/comp/data/",
          method: "post",
          data: requestData
        }).then((res) => {
          // console.log(res.data.data.figureData);
          let resdata = res.data.data.figureData;
          this.figureData = resdata;
          console.log(this.figureData);
          let myChart = echarts.init(this.$refs.explore_chart);
          myChart.clear();
          let xAxis = {
            type: "category",
            data: this.figureData.xFeature.data
          };
          let yAxis = [];
          for (let i in this.figureData.yFeature) {
            yAxis.push({
              type: 'value',
              name: this.figureData.yFeature[i].name,
              position: 'right',
              offset: i*90,
              nameLocation: 'end',
              scale: true,
              axisTick: {
                show: true
              },
              splitLine: {
                show: false
              },
              axisLine: {
                show: true,
                onZero: false
              },
              axisLabel: {
                show: true,
                formatter(params){
                  return (params).toFixed(0)
                }
              }
            })
          }
          let legend = {
            data:[]
          }
          let series = [];
          for (let i in this.figureData.yFeature) {
            legend.data.push(this.figureData.yFeature[i].name);
            series.push({
              data: this.figureData.yFeature[i].data,
              name: this.figureData.yFeature[i].name,
              type: this.figureClass,
              yAxisIndex: i
            });
          }
          let grid = {
            top: '15%',
            right: (this.figureData.yFeature.length-1) * 90,
            containLabel: true
          };
          myChart.setOption({
            xAxis:xAxis, yAxis:yAxis, series:series, legend:legend, grid:grid,
            tooltip: {
              trigger: 'axis'
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            }
          });
        });
    },
    figureFilter() {
      this.filterVisible = false;
      // console.log(this.filterString);
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    tableCharts() {
      setTimeout(_ => {
        this.staticInfo.forEach(e => {
          let f_name = e.feature_name;
          let myChart3 = echarts.init(this.$refs[f_name]);
          myChart3.setOption({
            xAxis: {
              type: "category",
              show: false
            },
            yAxis: {
              type: "value",
              show: false
            },
            series: [
              {
                data: e.hist,
                type: "bar",
              }
            ]
          });
          window.addEventListener("resize", () => {
            myChart3.resize();
          });
        });
        
      }, 1000);
    },
    multiFeatureTest() {
      var features = [];
      for (let item in this.staticMultipleSelection) {
        features.push(this.staticMultipleSelection[item].feature_name);
      }
      this.$http_vis({
          url: "/ana/fc/",
          method: "post",
          data: {
            dataset_id: this.dataset_id,
            columns: features
          }
        }).then((res) => {
          let data = res.data.data;
          this.MultiTestTable = [];
          this.MultiTestTable.push({method:"pearsonr", value:data.pearsonr});
          var t_test_string = "t="+ data.ttest[0] + ",p=" + data.ttest[1];
          this.MultiTestTable.push({method:"t-test", value:t_test_string});    
          this.MultiTestShow = true;
        })
    },
    getModelId(val){
      this.$http_vis({
          url: "/interpretability/result/all/",
          method: "post",
          data: {
            model_id: val
          }
        }).then((res) => {
          let data = res.data.data;
          this.result_all = data;
          let features = this.result_all.explanation[0].data;
          this.globalXaxis = [];
          this.globalData = [];
          var index = 0;
          for (var key in features) {
            this.globalXaxis.push(key);
            this.globalData.push([index,0,features[key]]);
            index += 1;
          }
          console.log(this.globalXaxis);
          console.log(this.globalData);
          // this.initCharts();
          this.initHeatmap();
        })
    },
    showSingleData() {
      this.$http_vis({
          url: "/interpretability/result/single/",
          method: "post",
          data: {
            dataset_id: this.dataset_id,
            operations: this.operations,
            model_id: this.model_id,
            sample_id: this.curSingleData,
          }
        }).then((res) => {
          let data = res.data.data
          this.singleData = data
          this.dialogShow = true;
          this.singleLegends = Object.keys(this.singleData.sample_data);
          this.singleTimestep = this.singleData.sample_data.timestep;
          this.singleSeries = [];
          for (var i=0; i<this.singleLegends.length; i++) {
            if (this.singleLegends[i]=="timestep") {
              this.singleLegends.splice(i, 1);
            }
          }
          for (var key in this.singleData.sample_data) {
            if (key!="timestep"){
              let item = {name:key, type:"line", data:this.singleData.sample_data[key]};
              this.singleSeries.push(item);
            }
          }
          let outputItem = {name:"output", type: 'line',areaStyle: {opacity: 0.2},data: this.singleData.output};
          this.singleSeries.push(outputItem);
          var att_visit = this.singleData.explanation[0].data;
          for (var key in att_visit) {
            let item = {name:key, type:"line", data:att_visit[key], symbolSize: 0, showSymbol: false, lineStyle: {width: 0, color: 'rgba(0, 0, 0, 0)'}};
            this.singleSeries.push(item);
          }
          this.singleLegends.push("output");
          this.initSingleCharts();
        })
    },
    // initCharts () {
    //   let myChart = echarts.init(this.$refs.chart);
    //   // 绘制图表
    //   myChart.setOption({
    //     title: {
    //       text: 'attention特征重要性'
    //     },
    //     tooltip: {
    //       trigger: 'axis'
    //     },
    //     legend: {
    //       data: ['K', 'Ca', 'Na']
    //     },
    //     grid: {
    //       left: '3%',
    //       right: '4%',
    //       bottom: '3%',
    //       containLabel: true
    //     },
    //     toolbox: {
    //       feature: {
    //         saveAsImage: {}
    //       }
    //     },
    //     xAxis: {
    //       type: 'category',
    //       boundaryGap: false,
    //       data: this.singleTimestep
    //     },
    //     yAxis: {
    //       type: 'value'
    //     },
    //     series: this.singleSeries
    //   });
    // },
    initHeatmap() {
      let myHeatmap = echarts.init(this.$refs.heatmap);
      myHeatmap.setOption(
        {
          title: {
          text: '全局特征重要性'
          },
          tooltip: {
            position: 'top'
          },
          grid: {
            height: '50%',
            top: '10%'
          },
          xAxis: {
            type: 'category',
            data: this.globalXaxis,
            splitArea: {
              show: true
            }
          },
          yAxis: {
            type: 'category',
            data: ['重要性权重'],
            splitArea: {
              show: true
            }
          },
          visualMap: {
            min: 0,
            max: 1,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%',
            inRange: {
              color: ['#ffffff','#0000cd']
            }
          },
          series: [
            {
              name: '特征重要性',
              type: 'heatmap',
              data: this.globalData,
              label: {
                show: true
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      );
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
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let result = params[0].name + "</br>";
            var len = 0
            for (var i=0; i<params.length; i++) {
              result += `${this.markDot(params[i].color)}${params[i].seriesName}：${params[i].data}</br>`
              if (params[i].seriesName=="output") {
                len = i;
                break;
              }
            }
            result += '动态特征重要性' + "</br>";
            for (i=len+1; i<params.length; i++) {
              if (this.singleSelected[params[i].seriesName]==false) continue;
              result += `${this.markDot(params[i].color)}${params[i].seriesName}：${params[i].data}</br>`
            }
            return result;
          }
        },
        legend: {
          data: this.singleLegends
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
          data: this.singleTimestep
        },
        yAxis: {
          type: 'value'
        },
        series: this.singleSeries,
      });
      var selectArr = myChart.getOption().legend[0].data;
      let count = 0;
      for (var key in selectArr) {
          if (count >= 3) this.singleSelected[selectArr[key]] = false; 
            else this.singleSelected[selectArr[key]] = true;
            count = count + 1;
      }
      this.singleSelected.output = true;
      console.log(this.singleSelected);
      myChart.setOption({legend: {
        selected: this.singleSelected
      }});
      let that = this;
      myChart.on('legendselectchanged', function(obj) {
        var selected = obj.selected;
        var name = obj.name;
        for (var key in selectArr) {
          if (myChart.getOption().legend[0].selected[[selectArr[key]]]!=null) {
            that.singleSelected[selectArr[key]] = myChart.getOption().legend[0].selected[[selectArr[key]]];
          }
        }
      });
    }
  }

}
</script>

<style  scoped>
.container {
  padding: 40px 80px;
}
.dataset-info {
  margin-top: 40px;
  margin-bottom: 40px;
}
.static-info {
  width: 100%;
  margin-top: 40px;
}
.form-container {
  display: flex;
  flex-wrap: wrap;
}
.form-row {
  flex: 1;
  display: flex;
  align-items: center;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.chart3 {
  width: 100px;
  height: 100px;
}

a {
  text-decoration: inherit;
}
</style>