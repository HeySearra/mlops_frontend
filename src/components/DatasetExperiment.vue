<template>
  <div>
    <div class="table" style="margin-bottom: 50px">
      <el-card shadow="never">
        <div slot="header" class="card-title">
          <span>数据历史处理记录</span>
        </div>
        <el-table border tooltip-effect="dark" style="width: 100%" max-height="210" :data="history"
                :row-style="{height: '10px'}"
                :cell-style="{padding: '0'}"
                :header-cell-style="{
                'font-size': '14px',
                color: '#778192',
                'font-weight': 'normal',
                'text-align': 'center',
                'background-color': '#fafafa',
              }">
        <el-table-column prop="task" label="任务名" width="160" align="center" show-overflow-tooltip/>
        <el-table-column label="开始时间" prop="created" width="160" align="center" show-overflow-tooltip/>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag align="center" :type="scope.row.run_status == 'running' ? 'warning' : 'success'" disable-transitions>
              {{scope.row.run_status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip/>
        <el-table-column prop="owner" label="创建用户" width="80" align="center" show-overflow-tooltip />

        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="expand" >
                <p><i class="el-icon-s-operation"/>预处理参数</p>
                <el-descriptions :column="2" border size="small" labelClassName="d-label" contentClassName="d-content">
                  <template v-for="(value, key) in props.row.model_config">
                    <el-descriptions-item :key="key" :label="key">{{ value }}</el-descriptions-item>
                  </template>
                </el-descriptions>
            </div>
          </template>
        </el-table-column>

      </el-table>
      </el-card>
    </div>
    <el-card shadow="never">
      <div slot="header" class="card-title">
        <span>创建新流程</span><span class="tips">拖动左侧方块来编辑流程</span>
        <el-popover
            placement="left"
            width="330"
            trigger="click"
            v-model="newNameDialogVisible"
        >
          <div>
            <span style="margin-right: 10px">新文件名</span>
            <el-input v-model="newFileName" placeholder="请输入文件名" size="mini"/>
            <el-button style="float: right; padding: 3px 0" type="text" @click="Submit">
              提交修改
            </el-button>
          </div>
          <el-button slot="reference" style="float: right; padding: 3px 0" type="text" icon="el-icon-caret-right">
            提交流程
          </el-button>
        </el-popover>
      </div>
      <pre-process-flow :dataset_name="detail.name" :all_cols="detail.sample.head" :dataset_id="id" ref="preProcessFlow"></pre-process-flow>
    </el-card>
  </div>
</template>

<script>
import PreProcessFlow from "./PreProcessFlow";

export default {
  components:{
    PreProcessFlow
  },
  data() {
      return {
        newNameDialogVisible:false,
        newFileName:"",
        resultList:[]
      }
  },
  created() {

  },
  mounted(){

  },
  props:{
    id:{
      type: Number,
      required: true
    },
    detail:{
      type:Object,
      required: true
    },
    history:{
      type:Array,
      require:false
    }
  },
  methods:{
    Submit(){
      this.newNameDialogVisible = false
      this.$refs.preProcessFlow.submitPreprocess(this.newFileName)
      this.newFileName = ""
    },
  }
}

</script>

<style scoped>
.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #555;
}
.tips{
  font-size: 10px;
  color: #a3a3a3;
  margin-left: 20px;
}

.el-input{
  width: 200px;
}

.d-label{
  width: 100px;
  font-size: 12px;
  font-style: italic;
  font-weight: bold;
}

.d-content{
  font-family: 'Times New Roman',math,sans-serif
}

.expand{
  padding: 0 30px 0 30px;
}
</style>