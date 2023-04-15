<template>
  <div class="container">

    <div>
      <span class="title">{{ detail.name }}</span>
      <el-tag size="mini" type="success" style="margin-left: 20px">{{ detail.task }}</el-tag>
      <el-tag type="warning" size="mini" style="margin-left: 10px">{{ detail.area }}</el-tag>
      <span class="attr-label">贡献者:</span><span class="attr-value">{{detail.owner}}</span>
      <span class="attr-label">上传时间：</span><span class="attr-value">{{beautifyTimestamp(detail.created)}}</span>
    </div>
    <div class="info" style="color:grey">简介： {{ detail.short_description }}</div>

    <div class="version-choose" >
      <el-select v-model="version_choose" size="small" @change="versionChange">
        <el-option
            label="原始版本"
            :value="id">
        </el-option>
        <el-option
            v-for="(version, index) in detail.children"
            :key="index+1"
            :label="version.children_name[0]"
            :value="version.children_id[0]">
        </el-option>
      </el-select>
    </div>

    <div>
      <el-tabs v-model="activeName" id="tab">
        <el-tab-pane label="详情" name="first">
          <dataset-intro :detail="detail" :id="id" > </dataset-intro>
        </el-tab-pane>

        <el-tab-pane label="实验" name="second">
          <dataset-experiment ref="Experiment" :history="resultList" :detail="detail" :id="id"></dataset-experiment>
        </el-tab-pane>

        <el-tab-pane label="视图" name="third">
          <dataset-statistic :id="id"></dataset-statistic>
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>
  
<script>
import DatasetIntro from "../../components/DatasetIntro";
import DatasetStatistic from "../../components/DatasetStatistic";
import DatasetExperiment from "../../components/DatasetExperiment";

export default {

  components: {
    DatasetIntro,
    DatasetStatistic,
    DatasetExperiment
  },

  data() {
    return {
      id: 1,
      detail: {
        owner: "匿名用户",
        id_col: 1,
        process_code: "",
        name: "",
        task: "通用",
        area: "",
        children: [],
        father: 0,
        short_description: "暂无简介",
        long_description: "## 数据集描述\n",
        sample: {
          head:[],
          sample_data:[]
        },
        created: "2023-01-01T00:00:00",
        experiment_times: 0,
        record_count: 0,
      },
      process_info:[],
      exp_count: 2,
      exp_list: [],
      activeName: 'first',
      version_choose: 0,
      form: {
        'name': 'name',
        'region': 'region',
        'date1': '2023.01',
        'date2': '2023.02',
        'delivery': true,
        'type': 'type',
        'resource': 'resource',
        'desc': 'desc',
      },
      resultList:[]
    }
  },

  created() {
    const id = this.$route.params.id
    this.id = parseInt(id)
    this.get_datasets(id)
    this.version_choose = this.id

  },


  mounted() {

  },

  methods: {
    change(value, render) {
      this.html = render;
    },
    beautifyTimestamp(ts) {
      let date = ts.split("T")[0]
      let time = ts.split("T")[1]
      let date_parts = date.split("-")
      let time_parts = time.split(":")
      let date_string = date_parts[0] + "年" + String(Number(date_parts[1])) + "月" + String(Number(date_parts[2])) + "日" + " "
      let time_string = time_parts[0] + "时" + time_parts[1] + "分"
      return date_string + time_string
    },
    get_datasets(id) {
      var that = this;
      this.$http_wang({
        url: "/predata/" + id + '/',
        method: "get",
      }).then((res) => {
        console.log(res)
        if (res.status == 200) {
          let data = res.data
          if (data.children.length == 0) {
            data.children.push({
              'children_id': data.id,
              'children_name': '原始版本',
            })
          }
          that.detail = data
          that.parseHistoryRecord()
        } else {
          that.$notify({
            title: '获取失败',
            message: res.response.data,
            duration: 5000
          });
        }
      });
    },
    versionChange(version) {
      if (version != this.id) {
        this.get_datasets(version)
      }
    },
    parseHistoryRecord() {
      var processes = JSON.parse(this.detail.process_code)
      let list = []
      processes.forEach((record) => {
        let process_name = record["name"]
        let info = {
          'task': process_name,
          'created': record["create_time"],
          'run_status': 'success',
          'description': record["description"],
          'owner': record["operator"],
          "model_config": {}
        }
        for (let key in record["params"]) {
          info["model_config"][key] = record["params"][key]
        }
        list.push(info)
      })
      this.resultList = list
    }
  }
}
</script>
  
<style  scoped>
.container {
  padding: 40px 180px;
}

.title {
  cursor: pointer;
  font-size: 30px;
  font-family: SimHei-Normal;
  font-weight: bold;
  text-align: LEFT;
  color: #5194e9;
  line-height: 30px;
}

.info {
  margin-top: 9px;
  margin-right: 200px;
  line-height: 24px;
  font-size: 15px;
  color: #555;
  letter-spacing: 0.5px;
  font-family: Arial, "Microsoft yehei";
  text-justify: inter-word;
  text-align: justify;
}

.experiment>div {
  height: 22px;
  flex: 1;
}

#id{
  margin-top: 10px;
}

.version-choose{
  position: absolute;
  top: 100px;
  right: 200px;
}

</style>