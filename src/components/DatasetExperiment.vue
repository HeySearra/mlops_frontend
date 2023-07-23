<template>
  <div>
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