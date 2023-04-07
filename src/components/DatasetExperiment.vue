<template>
  <div>
    <div class="table" style="margin-bottom: 50px">
      <el-card shadow="never">
        <div slot="header" class="card-title">
          <span>数据历史处理记录</span>
        </div>
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
        <el-table-column prop="task" label="任务名" width="160" align="center" show-overflow-tooltip/>
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
        <el-table-column prop="description" label="描述" show-overflow-tooltip/>
        <el-table-column prop="owner" label="创建用户" width="80" align="center" show-overflow-tooltip />

        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="expand">
              <el-row :gutter="30">
                <el-col :span="10">
                  <p>实验参数</p>
                  <el-descriptions :column="1" border>
                    <template v-for="(value, key) in props.row.metric">
                      <el-descriptions-item :key="key" :label="key">{{ value }}</el-descriptions-item>
                    </template>
                  </el-descriptions>
                </el-col>

                <el-col :span="10">
                  <p>实验指标</p>
                  <el-descriptions :column="1" border>
                    <template v-for="(value, key) in props.row.metric">
                      <el-descriptions-item :key="key" :label="key">{{ value }}</el-descriptions-item>
                    </template>
                  </el-descriptions>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>

      </el-table>
      </el-card>
    </div>
    <el-card shadow="never">
      <div slot="header" class="card-title">
        <span>创建新流程</span>
        <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-caret-right" @click="Submit">
          提交流程
        </el-button>
      </div>
      <pre-process-flow :dataset_id="id" ref="preProcessFlow"></pre-process-flow>
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
        resultList:[{
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
          }},{
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
          }}
        ]
      }
  },
  props:{
    id:{
      type: Number,
      required: true
    }
  },
  methods:{
    Submit(){
      this.$refs.preProcessFlow.submitPreprocess()
    }
  }
}
</script>

<style>
.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #555;
}
</style>