<template>
  <div>
    <el-card shadow="never">
      <div slot="header" class="card-title">
        <span>创建新流程</span><span class="tips">拖动左侧方块来编辑流程</span>
        <el-popover
            placement="left"
            width="500"
            trigger="click"
            v-model="newNameDialogVisible"
        >
          <div>
            <!-- <span style="margin-right: 10px">新文件名</span>
            <el-input v-model="newFileName" placeholder="请输入文件名" size="mini"/> -->

            <el-form :model="newInfo" ref="newInfo" label-width="85px">
              <el-form-item prop="name" label="新文件名">
                <el-input type="text" v-model="newInfo.name" placeholder="新文件名" clearable>
                </el-input>
              </el-form-item>
              <el-form-item label="文件类型">
                <el-select v-model="newInfo.type" placeholder="请选择">
                  <el-option v-for="a in typeOptions" :key="a" :label="a" :value="a">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="short_description" label="数据集简介">
                <el-input v-model="newInfo.short_description" placeholder="数据集简介" clearable>
                </el-input>
              </el-form-item>
              <el-form-item prop="long_description" label="详细介绍">
                <el-input type="textarea" v-model="newInfo.long_description" placeholder="数据集介绍">
                </el-input>
              </el-form-item>
              <el-button style="float: right; padding: 3px 0" type="text" @click="Submit">
                提交修改
              </el-button>
            </el-form>

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
        newInfo: {
          name: "",
          short_description: "",
          long_description: "",
          type: "",
        },
        typeOptions: [".csv", ".xlsx", ".xls"],
        resultList:[]
      }
  },
  created() {

  },
  mounted(){
    if(!this.login_manager.get()){
        return
      }
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
      this.$refs.preProcessFlow.submitPreprocess(this.newInfo)
      this.newInfo = {
          name: "",
          short_description: "",
          long_description: "",
          type: "",
        };
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