<template>
  <div class="dataset-intro-frame">
    <div style="margin-bottom: 20px">
      <el-card shadow="never">
        <div slot="header" class="card-title">
          <span>数据详情介绍</span>
        </div>
        <mavon-editor class='md' v-model="detail.long_description" defaultOpen="preview" :subfield="false"
          :editable="false" :toolbarsFlag="false" :shortCut="false" :boxShadow="false" />
      </el-card>
    </div>

    <div style="margin-bottom: 20px">
      <el-card shadow="never">
        <div slot="header" class="card-title">
          <span>数据集预览</span>
          <span class="attr-label">Col-count:</span><span class="attr-value">{{ detail.sample.head.length }}</span>
          <span class="attr-label">Record-count:</span><span class="attr-value">{{ detail.record_count }}</span>
          <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-download"
            @click="Download">下载数据集</el-button>
        </div>
        <el-table :data='detail.sample.sample' max-height="400" border :cell-style="cellStyle">
          <el-table-column v-for="(item, idx) in detail.sample.head" :formatter="trimFloat" :key="idx" :prop="item"
            :label="item" width="100" />
        </el-table>
      </el-card>
    </div>

    <div class="table">
      <el-card shadow="never">
        <div slot="header" class="card-title">
          <span>数据历史处理记录</span>
        </div>
        <el-table border tooltip-effect="dark" style="width: 100%" max-height="210" :data="history"
          :row-style="{ height: '10px' }" :cell-style="{ padding: '0' }" :header-cell-style="{
            'font-size': '14px',
            color: '#778192',
            'font-weight': 'normal',
            'text-align': 'center',
            'background-color': '#fafafa',
          }">
          <el-table-column prop="task" label="任务名" width="160" align="center" show-overflow-tooltip />
          <el-table-column label="开始时间" prop="created" width="160" align="center" show-overflow-tooltip />
          <el-table-column label="状态" width="100" align="center">
            <template slot-scope="scope">
              <el-tag align="center" :type="scope.row.run_status == 'running' ? 'warning' : 'success'"
                disable-transitions>
                {{ scope.row.run_status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" show-overflow-tooltip />
          <el-table-column prop="owner" label="创建用户" width="80" align="center" show-overflow-tooltip />

          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="expand">
                <p><i class="el-icon-s-operation" />预处理参数</p>
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
  </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";

export default {
  name: "DatasetIntro.vue",
  components: {
    mavonEditor
  },
  data() {
    return {

    }
  },
  props: {
    detail: {
      type: Object,
      required: true,
      default: {
        owner: "匿名用户",
        id_col: 1,
        process_code: "",
        name: "",
        task: "通用",
        area: "",
        children: [],
        father: 0,
        short_description: "暂无简介",
        long_description: "\n",
        sample: {
          head: [],
          sample_data: []
        },
        created: "",
        experiment_times: 0,
        record_count: 0,
      },
    },
    id: {
      type: Number,
      required: true,
    },
    history: {
      type: Array,
      require: false
    }
  },
  created() {
    if(!this.login_manager.get()){
        return
      }
  },
  methods: {
    Download() {
      window.open("http://162.105.88.214:4499/predata/" + this.id + "/download")
    },
    cellStyle() {
      return "font-size:10px;font-family:'Times New Roman',math,sans-serif"
    },
    trimFloat(row, column, cellValue, index) {
      if (typeof cellValue === 'number' && cellValue.toString().indexOf(".") !== -1) {
        return cellValue.toFixed(5)
      } else {
        return cellValue
      }
    }
  }
}
</script>

<style scoped>
.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #555;
}

.dataset-intro-frame {
  display: flex;
  flex-direction: column;
}

/*设置mavon编辑器的框的样式*/
.v-note-wrapper {
  min-height: auto;
  max-height: 500px;
}

.attr-label {
  font-size: 10px;
  color: #a3a3a3;
  margin-right: 10px;
  margin-left: 20px;
}

.attr-value {
  font-size: 10px;
  color: #a3a3a3;
}
</style>