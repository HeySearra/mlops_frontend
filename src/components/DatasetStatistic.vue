<template>
  <div >
    <el-container id="table-frame">
      <el-header id="header">
        <div style="">
          <span style="font-size: 30px;color: #3c3c3c;font-family: Corbel,sans-serif;">{{tableBriefInfo.fileName}}</span>
          <span class="attr-label">文件大小</span><span class="attr-value">{{tableBriefInfo.fileSize}}</span>
          <el-button  @click="toVisual()" style="margin-left:10px;">可视化</el-button>
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
              v-for="(header,idx) in tableData.headers"
              :key="idx"
              :prop="header.label"
              :label="header.label"
              width=130
          >
<!-- Tip:这里宽度的设置是table-header中table-header-frame的width+cell的width*2  -->
            <template slot="header">
              <table-header :data_id="id" :col_id="idx"/>
            </template>
          </el-table-column>>
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
          { label:"一号列", type:"number"},
          { label:"二号列", type:"number"},
          { label:"三号列", type:"string"}
        ],
        data:[
          {"idx":1, "一号列":1,"二号列":2},
          {"idx":2, "一号列":1,"二号列":2},
          {"idx":3, "一号列":1,"二号列":2},
          {"idx":4, "一号列":1,"二号列":2},
          {"idx":5, "一号列":1,"二号列":2},
          {"idx":6, "一号列":1,"二号列":2},
          {"idx":7, "一号列":1,"二号列":2},
          {"idx":8, "一号列":1,"二号列":2},
          {"idx":9, "一号列":1,"二号列":2}
        ]
      },
      tableBriefInfo:{
        fileName:"Fine.csv",
        fileSize:"30MB",
        sliceStart:0,
        sliceEnd:500
      },
      targetSliceStart:0,
      targetSliceEnd:500,
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
    toVisual(){
      this.$router.push({
					name: 'Visualize',
					query: {param: 6}
				})
    }
  },
  props:{
    id:{
      type: Number,
      required: true
    }
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