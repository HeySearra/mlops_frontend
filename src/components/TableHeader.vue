<template>

  <div class="table-header-frame">
    <el-dialog>
      高清无码大图, 暂时不做
    </el-dialog>
    <div class="col_info">
      <span>{{col_name}}</span>
      <i class="el-icon-more"/>
    </div>
    <div id="col_chart"/>

  </div>
</template>
<script>
/*
* 实现两个图：饼图and直方图
* */
const Echarts = require('echarts');

let chart_set_option = (chart,data,type)=>{
  //todo: 数据更新策略是怎样的
  if (type === "NUMBER"){
    //数据的min max显示，可以考虑在坐标轴两端用html显示一下，不一定要用echarts的接口。
    chart.setOption({
      tooltip: {
        show:true,
        appendToBody:true,//这个接口Echarts文档说可能有未知Bad case...
        trigger:"axis",//数据轴触发
        triggerOn:"mousemove",
        transitionDuration: 0.4,
        borderColor:"#123",
        padding:[5,10],
        textStyle:{
          fontSize: 10
        },
        formatter(params){
          // var rangeName = params[0].name
          var rangeName = "ok了家人们"
          var count = params[0].value[1]
          return "<div>"+rangeName+"</div><div>"+params[0].marker+"Count:"+String(count)+"</div>"
        },
      },
      xAxis: {
        type: "category",// 由于后端不会传递所有的数据，所以在后端统计后，以分类的形式返回前端
        boundaryGap:true,
        splitNumber:8,
        minInterval:1,
        maxInterval:20,
        silent: true,
        data:data.categories
      },
      yAxis: {
        show:false,
        type: "value",
        min: 0,
      },
      series: [
        {
          type: 'bar',
          data: data.data,
          itemStyle:{
            color: "rgba(137, 207, 240,1)",
            opacity: 0.5
          },
          emphasis:{
            focus: "self",
            blurScope: "global"
          },
          barCategoryGap:'0%'
        }
      ],
    })
  }else if(type === "CATEGORIES"){
    chart.setOption({
      legend:{
        //TODO: 高清大图需要图例
        show:false
      },
      tooltip: {
        show:true,
        appendToBody:true,//这个接口Echarts文档说可能有未知Bad case...
        trigger:"axis",//数据轴触发
        triggerOn:"mousemove",
        transitionDuration: 0.4,
        borderColor:"#123",
        padding:[5,10],
        textStyle:{
          fontSize: 10
        },
        formatter(params){
          // var rangeName = params[0].name
          var rangeName = "ok了家人们"
          var count = params[0].value[1]
          return "<div>"+rangeName+"</div><div>"+params[0].marker+"Count:"+String(count)+"</div>"
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['70%','100%'],
          avoidLabelOverlap:false,
          data: data.categoryData.data,
          colorBy: 'data',
          left:'center',
          top: 'middle',
          width: 'auto',
          height: 'auto',
          label:{
            show: false,
            position: 'center'
          },
          labelLine:{
            show:false
          },
          emphasis: {
            scale:true,
            focus: 'self',
            label: {
              show: true,
              fontSize: '10',
              fontWeight: 'bold'
            }
          },
          itemStyle:{
            color: "rgba(137, 207, 240,1)",
            opacity: 0.5,
            borderColor: '#000',
            borderWidth: 1
          }
        }
      ],
    })
  }
}

export default {
  data(){
    return{
      col_name:"学号",
      type: "Number", // 还可以是String，datetime，或者类别型
      chartData:{
        categories:["ok!","ok!","ok!","ok!","ok!","ok!","ok!","ok!","ok!","ok!"],
        data:[1,2,3,4,5,6,4,3,2,1],
        categoryData:{
          data:[
            {value:200, name:"奥特曼"},
            {value:100, name:"赛亚人"},
            {value:400, name:"Apex猎杀者"},
            {value:50, name:"钢铁侠"}
          ]
        }
      },
      chartType: "NUMBER"
    }
  },
  props:{
    data_id:{
      type:Number,
      required:true
    },
    col_id:{
      type:Number,
      required:true
    }
  },
  created() {
    //TODO: 搞清楚获取col info的方式。
    this.chartType= "NUMBER"
  },
  mounted(){
    let chart = document.getElementById("col_chart")
    Object.defineProperty(chart,'clientWidth',{
      get(){return 150;}
    })
    Object.defineProperty(chart,'clientHeight',{
      get(){return 200;}
    })
    var myChart = Echarts.init(chart);

    this.chart = myChart
    window.onresize = function(){
      myChart.resize()
    }

    // 绘制图表
    chart_set_option(this.chart, this.chartData,"CATEGORIES")
  }
}
</script>

<style>
/* todo: 设置宽度 */
.table-header-frame{
  height: 150px;
}
.table-header-frame:hover{
  height: 150px;
  background-color: #fafafa;
}
.col_info{
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>