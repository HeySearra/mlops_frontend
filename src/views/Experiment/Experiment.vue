<template>
  <div class="container">
    <div class="search-box">
      <el-row :gutter="15">
        <el-col :span="7">
          <el-input
            placeholder="输入数据集名称"
            v-model="input[0]"
          >
            <template slot="prepend">数据集
            </template>
          </el-input>
        </el-col>
        <el-col :span="9">

          <el-input
            placeholder="输入模型名称"
            v-model="input[1]"
          >
            <template slot="prepend">模型
            </template>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </el-col>

        <el-col :span="8">
          <el-select
            v-model="task_selected"
            clearable
            placeholder="按任务类型筛选"
            @change="filter"
          >
            <el-option
              v-for="(item, i) in task_list"
              :label="item"
              :key="i"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <p style=" ">共找到 {{count}} 个实验</p>

    <el-button
      plain
      disabled
    >比较</el-button>
    <el-button
      plain
      disabled
    >导出csv文件</el-button>

    <div class='r-buttons'>
      <router-link to="/new_experiment">
        <el-button
          plain
          style=" margin-right: 20px;"
        >新建实验</el-button>
      </router-link>
      <el-button
        plain
        disabled
      >在线运行</el-button>
    </div>

    <el-table
      border
      tooltip-effect="dark"
      style="width: 100%"
      :data="resultList"
      @expand-change="expandChange"
      :header-cell-style="{
        'font-size': '14px',
        color: '#778192',
        'font-weight': 'normal',
        'text-align': 'center',
        'background-color': '#fafafa',
        padding: '0',
        height: '2.5vw',
      }"
    >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        label="开始时间"
        width="180"
        align="center"
      >
        <template slot-scope="scope">{{ scope.row.created.substr(0,10)}}
          <span style=" margin-right: 5px;"></span>
          {{scope.row.created.substr(11,8)}}</template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.run_status == 'running' ? 'warning' : 'success'"
            disable-transitions
          >{{scope.row.run_status}} </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="task"
        label="任务"
        width="160"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="owner"
        label="用户"
        width="80"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="模型">
        <template slot-scope="scope">
          <span
            @click="toModel(scope.row)"
            class="name"
          >{{scope.row.model_name}}</span> </template>
      </el-table-column>
      <el-table-column
        prop="model_version"
        label="版本"
        width="55"
        align="center"
      >
      </el-table-column>

      <el-table-column label="数据集">
        <template slot-scope="scope">
          <span
            @click="toDataset(scope.row)"
            class="name"
          >{{scope.row.dataset_name}}</span> </template>
      </el-table-column>

      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="expand">
            <el-row :gutter="40">
              <el-col :span="18">
                <p>实验参数</p>
                <el-descriptions
                  :column="2"
                  border
                >
                  <template v-for="(value,key) in JSON.parse(props.row.model_config)">
                    <el-descriptions-item :label="key">{{value}}</el-descriptions-item>
                  </template>
                </el-descriptions>
              </el-col>

              <el-col :span="6">
                <p>实验指标</p>
                <el-descriptions
                  :column="1"
                  border
                >
                  <template v-for="(value,key) in JSON.parse(props.row.metric)">
                    <el-descriptions-item :label="key">{{value}}</el-descriptions-item>
                  </template>
                </el-descriptions>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script>
export default {

  components: {

  },

  data() {
    return {
      input: ['', ''],
      search_word: ['', ''],
      resultList: undefined,
      count: undefined,
      task_list: ['命名实体识别', '关系抽取', '实体关系联合抽取'],
      task_selected: '',
    }
  },

  created() {
    this.get_expList()

  },


  mounted() {

  },

  methods: {
    get_expList(page = 1) {
      this.$http({
        url: "/experiments/",
        method: "get",
        params: {
          page: page,
          task: this.task_selected,
          dataset: this.search_word[0],
          model: this.search_word[1]
        }
      }).then((res) => {
        let data = res.data
        this.count = data.count
        data.results.map(item => {
          item.model_config = '';
          item.metric = '';
        });
        this.resultList = data.results
      })
    },

    expandChange(row, expandedRows) {
      if (expandedRows.length > 0) {
        let id = row.id
        this.$http({
          url: "/experiments/" + id + '/',
          method: "get",
        }).then((res) => {
          let data = res.data
          row.model_config = data.model_config
          row.metric = data.metric
        })
      }
    },

    search() {
      this.search_word[0] = this.input[0].trim()
      this.search_word[1] = this.input[1].trim()
      this.get_expList()
    },

    filter() {
      this.get_expList()
    },

    toModel(arg) {
      const { href } = this.$router.resolve({
        name: "ModelDetails",
        params: {
          id: arg.model,
        },
      });
      window.open(href, '_blank')
    },

    toDataset(arg) {
      const { href } = this.$router.resolve({
        name: "DataDetails",
        params: {
          id: arg.dataset,
        },
      });
      window.open(href, '_blank')
    },
  }

}
</script>

<style  scoped>
.container {
  padding: 40px 100px;
}
.search-box {
  margin-bottom: 40px;
}
.el-table {
  margin-top: 20px;
}

.r-buttons {
  float: right;
}

.expand {
  padding: 0 40px 20px 40px;
}

.expand p {
  font-weight: 700;
}

.name {
  cursor: pointer;
}
</style>