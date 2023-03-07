<template>
  <div>
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

  props: ['resultList'],
  data() {
    return {

    }
  },

  created() {

  },


  mounted() {
  },

  methods: {
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