<template>
  <div >
    <el-container id="table-frame">
      <el-header id="header">
        <div style="">
          <span style="font-size: 30px;color: #3c3c3c;font-family: Corbel,sans-serif;">{{tableBriefInfo.fileName}}</span>
          <!-- <span class="attr-label">文件大小</span><span class="attr-value">{{tableBriefInfo.fileSize}}</span> -->
        </div>
        <el-popover
            placement="left"
            width="250"
            trigger="click"
            ref="slice-popover"
            v-model="sliceDialogVisible"
        >
          <div>
            <span style="font-size:15px;font-weight: bold">修改Slice范围</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="SubmitSliceChange">
              提交修改
            </el-button>
          </div>
          <div class="slice-edit-line">
            <span>
            <el-input
                clearable
                :placeholder="String(tableBriefInfo.sliceStart)"
                v-model="targetSliceStart"
                type="number"
                size="mini"
                style="width: 100px"/>
            </span>
              <span style="font-style: italic"> to </span>
              <span>
            <el-input
                clearable
                :placeholder="String(tableBriefInfo.sliceEnd)"
                v-model="targetSliceEnd"
                type="number"
                size="mini"
                style="width: 100px"/>
            </span>
          </div>
          <div slot="reference">
            <span class="slice-label">展示范围:</span>
            <span class="slice" >
                {{tableBriefInfo.sliceStart}} - {{tableBriefInfo.sliceEnd}}
            </span>
          </div>
        </el-popover>
      </el-header>
      <el-main>
        <el-table
            :data="tableData.data"
            class="table"
            stripe
            border
            max-height=400
            :row-key="tableData.data.idx"
            :cell-style="cellStyle"
        >
          <!-- TODO:貌似设置max-height也可以使表头固定 -->
          <el-table-column prop="idx" label="序号" width=40 fixed="left" />
          <el-table-column
              v-for="(a,idx) in tableData.headers"
              :key="idx"
              :prop="a.label"
              :label="a.label"
              width=150
          >
<!-- Tip:这里宽度的设置是table-header中table-header-frame的width+cell的width*2  -->
            <template slot="header">
              <table-header :data_id="id" :col_id="idx" :stat="a"/>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import TableHeader from "./TableHeader"
/*
* TODO: 需要做的统计效果：
*  1.样本数统计，特征数量统计
*  2.数据展示： slice，默认三百条，然后可以调整；搜索指定数据
*  3.数值型：极值，方差，均值，分布直方图：支持调整步幅, （直方图）
*  4.类别型：类别个数，每类的个数  （饼图）
*  5.字符串：统计不同字符串个数
*  6.筛选，排序
*  7.多特征：假设检验，相关性。
* */
export default {
  components:{
    TableHeader
  },
  data(){
    return {
      defaultRowLimit:300,
      tableData:{
        headers:[
        ],
        data:[
        ]
      },
      tableBriefInfo:{
        fileName:"数据视图",
        fileSize:"30MB",
        sliceStart:0,
        sliceEnd:100
      },
      targetSliceStart:0,
      targetSliceEnd:100,
      sliceDialogVisible: false
    }
  },
  methods:{
    sc(col, prop, order){
      console.log(col, prop, order)
    },
    SubmitSliceChange(){
      this.sliceDialogVisible = false
      //todo
    },
    cellStyle({row, column, rowIndex, columnIndex}){
      return "font-size:10px;font-family:'Times New Roman',math,sans-serif"
    },
    getData(id, begin, end, sort, sort_field, filter_value, filter_field){
      var that = this;
      that.tableData.data = []
      this.$http_wang({
        url: "/predata/" + id + '/dataset_slice/',
        method: "get",
        params:{
          "begin":begin,
          "end":end,
          "sort":sort,
          "sort_field":sort_field,
          "filter_value":filter_value,
          "filter_field":filter_field
        }
      }).then((res) => {
        if(res.status == 200){
          console.log(res)
          let data = []
          for(let i = 0;i<res.data["nums"];i++){
            var row = {}
            res.data["headers"].forEach((col_name)=>{
              row[col_name] = res.data["values"][col_name][i]
            })
            row["idx"]=i
            data.push(row)
          }
          that.tableData.data = data
        }
        else{
          that.$notify.error({
            title: '服务器失败 :/predata/' + id + '/dataset_slice/',
            message: res.response,
            duration: 5000
          });
        }
      })
    },
    getAllStat(id){
      var that = this;
      that.tableData.headers = []
      this.$http_wang({
        url: "/predata/" + id + '/dataset_stat/',
        method: "get",
      }).then((res) => {
        // console.log(res)
        if(res.status == 200){
          that.tableData.headers = res.data['result']
        }
        else{
          that.$notify.error({
            title: '服务器失败 :/predata/' + id + '/dataset_stat/',
            message: res.response,
            duration: 5000
          });
        }
      })
    },
    monitoring() { // 监听事件
                this.$on('childMethod', (res) => {
                    console.log('方法1:触发监听事件监听成功')
                    console.log(res)
                })
            },
  },
  props:{
    id:{
      type: Number,
      required: true
    }
  },
  mounted(){
    this.tableData.data = []
    // this.monitoring() // 注册监听事件
    // this.$bus.$on("xxx", this.getData)
    // this.$bus.$on("method2", this.getAllStat)
    // this.getData(this.id, 0, 100)
    // this.getAllStat(this.id)
  }
}
</script>
<style>

#table-frame{
  width: 100%;
  border-radius: 5px;
  border: 1px solid lightgray;
}
#header{
  border-bottom: 1px solid lightgray;;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.slice,.slice-label{
  font-size: 15px;
  color: #acacac;
  font-weight: bold;
  font-style: italic;
}
.slice:hover{
  font-size: 15px;
  color: #3c3c3c;
  font-weight: bold;
  font-style: italic;
  cursor: pointer;
}

.slice-edit-line{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
}

.el-table__cell{
  padding: 3px 0 !important;
}
</style>