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
        <el-form-item label="模型">
          <el-select v-model="cur_model" placeholder="选择模型" @change="getModelId($event)">
            <el-option v-for="item in modelList" :value="item.model_id" :key="item.model_id"
                       :label="item.model_name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      
      <div ref="heatmap" :style="{width: '1200px',height: '300px'}"></div>
      数据可解释性展示
      <el-row>
        <el-col :span="4"><el-input placeholder="搜索单条数据" v-model="curSingleData"></el-input></el-col>
        <el-col :span="4"><el-select multiple v-model="yFeature" placeholder="请选择特征" >
          <el-option v-for="item in featureList" :value="item" :key="item"
                        :label="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6"><el-button type="info" @click="showSingleData()">查看源数据和预测结果</el-button></el-col>
      </el-row>
      <div ref="single_chart" :style="{width: '1200px',height: '500px'}"></div>
      <el-dialog title="源数据和预测结果"
                 :visible.sync="dialogShow"
                 width="50%">
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
        cur_dataset_id: this.$route.query.param,
        cur_dataset_name: "",
        cur_model: '',
        datasetList: '',
        dataset_id: '',
        dataset_id_num: '',
        datasetInfo: '',
        childDatasetList: [],
        featureList: "",
        yFeature: [],
        modelList: [
        ],
        model_id: 'd1_model1',
        dialogShow: false,
        globalXaxis: '',
        globalData:'',
        singleData: '',
        singleTimestep: '',
        singleLegends: '',
        singleSeries: {
          smapleSeries: '',
          outputSeries: '',
          attnSeries: ''
        },
        singleSelected: {},
        curSingleData:'98',
        singleChart: '',
      }
    },
  
    created() {
      this.getDatasetList();
      this.getModelList();
    },
  
  
    mounted() {
      this.singleChart = echarts.init(this.$refs.single_chart);
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
        }).then((res) => {
          this.datasetInfo = res.data; 
          let data = res.data;
          this.childDatasetList = [];
          this.childDatasetList.push({
            children_id: this.cur_dataset_id,
            children_name: data.name
          })
          for (let i in data.children) {
            let childItem = {
              children_id: data.children[i].children_id[0],
              children_name: data.children[i].children_name[0]
            }
            this.childDatasetList.push(childItem);
          }
          this.dataset_id = data.name;
          this.dataset_id_num = this.cur_dataset_id;
          this.featureList = res.data.sample.head;
        })
      },
      getChildDatasetId(val) {
        for (let i in this.childDatasetList) {
          if (this.childDatasetList[i].children_name == val) {
            this.dataset_id_num = this.childDatasetList[i].children_id;
            break;
          } 
        }
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      getModelId(val){
        this.$http_vis({
            url: "/interpretability/result/all/",
            method: "post",
            data: {
              model_id: val
            }
          }).then((res) => {
            let features = res.data.data.explanation[0].data;
            this.globalXaxis = [];
            this.globalData = [];
            var index = 0;
            for (var key in features) {
              this.globalXaxis.push(key);
              this.globalData.push([index,0,features[key]]);
              index += 1;
            }
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
            let data = res.data.data;
            this.singleData = data;
            this.dialogShow = true;
            this.singleLegends = JSON.parse(JSON.stringify(this.yFeature));
            this.singleTimestep = this.singleData.sample_data.日期;
            let smapleSeries = [];
            for (var key in this.singleData.sample_data) {
              if (this.singleLegends.includes(key)){
                let item = {name:key, type:"line", data:this.singleData.sample_data[key]};
                smapleSeries.push(item);
              }
            }
            this.singleSeries.smapleSeries = smapleSeries;
            let outputItem = {name:"output", type: 'line',areaStyle: {opacity: 0.2},data: this.singleData.output};
            this.singleSeries.outputSeries = outputItem;
            let attnSeries = []
            var att_visit = this.singleData.explanation[0].data;
            for (key in att_visit) {
              if (this.singleLegends.includes(key)) {
                let item = {name:key, type:"line", data:att_visit[key], symbolSize: 0, showSymbol: false, lineStyle: {width: 0, color: 'rgba(0, 0, 0, 0)'}};
              attnSeries.push(item);
              }
            }
            this.singleSeries.attnSeries = attnSeries;
            this.showSingleCharts();
          })
      },
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
      showSingleCharts () {
        let myChart = this.singleChart;
        // 绘制图表
        let xAxis = {
          type: "category",
          boundaryGap: false,
          data: this.singleTimestep
        };
        let yAxis = [];
        for (let i in this.singleLegends) {
          yAxis.push({
            type: 'value',
            name: this.singleLegends[i],
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
        yAxis.push({
          type: 'value',
          name: 'output',
          position: 'left',
          offset: 90,
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
              return (params).toFixed(1)
            }
          }
        })
        let legendlist = this.singleLegends;
        legendlist.push('output');
        let legend = {
          data:legendlist
        }
        let series = [];
        for (let i in this.singleSeries.smapleSeries) {
          series.push({
            data: this.singleSeries.smapleSeries[i].data,
            name: this.singleSeries.smapleSeries[i].name,
            type: 'line',
            yAxisIndex: i
          });
        }
        series.push({
          data: this.singleSeries.outputSeries.data,
          name: this.singleSeries.outputSeries.name,
          type: 'line',
          yAxisIndex: this.singleSeries.smapleSeries.length
        })
        for (let i in this.singleSeries.attnSeries) series.push(this.singleSeries.attnSeries[i]);
        let grid = {
          top: '15%',
          right: (this.singleLegends.length) * 90,
          containLabel: true
        };
        myChart.setOption({
          xAxis:xAxis, yAxis:yAxis, series:series, legend:legend, grid:grid,
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
          toolbox: {
            feature: {
              saveAsImage: {}
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

  .form-row {
    flex: 1;
    display: flex;
    align-items: center;
  }
  a {
    text-decoration: inherit;
  }
  </style>