<template>
  <div class="container">

    <el-dialog title="修改数据" :visible.sync="changeInfoDialogVisible" width="60%" :destroy-on-close="true" modal>
      <el-form ref="form" :model="detail" label-width="80px" size="mini">
        <el-form-item label="数据名称">
          <el-input v-model="detail.name"></el-input>
        </el-form-item>
        <el-form-item label="数据简介">
          <el-input type="textarea" autosize placeholder="请输入数据简介" v-model="detail.short_description">
          </el-input>
        </el-form-item>
        <div>
          <el-form-item label="详细介绍">
            <el-input type="textarea" autosize placeholder="请输入数据详情介绍" v-model="detail.long_description">
            </el-input>
          </el-form-item>
          <el-form-item label="领域">
            <el-select v-model="detail.area" placeholder="请选择">
              <el-option v-for="a in areaOptions" :key="a" :label="a" :value="a">
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="任务">
          <el-select v-model="detail.task" placeholder="请选择">
            <el-option v-for="b in taskOptions" :key="b" :label="b" :value="b">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" icon="el-icon-edit" circle size="mini" style="margin-left: 100px"
          @click="changeInfoDialogVisible = false">
        </el-button>
      </el-form>
    </el-dialog>

    <div>
      <span class="title">{{ detail.name }}</span>
      <el-tag size="mini" type="success" style="margin-left: 20px">{{ detail.task }}</el-tag>
      <el-tag type="warning" size="mini" style="margin-left: 10px">{{ detail.area }}</el-tag>
      <span class="attr-label">贡献者:</span><span class="attr-value">{{detail.owner}}</span>
      <span class="attr-label">上传时间：</span><span class="attr-value">{{beautifyTimestamp(detail.created)}}</span>
    </div>
    <div class="info" style="color:grey">简介： {{ detail.short_description }}</div>

    <div class="version-choose">
      <el-button type="primary" icon="el-icon-edit" circle size="mini" style="margin-right: 10px"
        @click="changeInfo"></el-button>
      <el-button type="danger" icon="el-icon-delete" circle size="mini" style="margin-right: 10px"
        @click="deleteDataset"></el-button>
      <el-select v-model="version_choose" size="small" @change="versionChange">
        <el-option v-for="(version, index) in detail.children" :key="version.children_id[0]"
          :label="version.children_name[0]" :value="version.children_id[0]">
        </el-option>
      </el-select>
    </div>

    <div>
      <el-tabs v-model="activeName" id="tab">
        <el-tab-pane label="详情" name="first">
          <dataset-intro :detail="detail" :id="id" :history="resultList"> </dataset-intro>
        </el-tab-pane>

        <el-tab-pane label="实验" name="second">
          <dataset-experiment ref="Experiment" :history="resultList" :detail="detail" :id="id"></dataset-experiment>
        </el-tab-pane>

        <el-tab-pane label="自定义实验" name="third">
          <user-defined-pre :id="id" :detail="detail" v-if="detail"></user-defined-pre>
        </el-tab-pane>

        <!-- <el-tab-pane label="视图" name="fourth">
          <dataset-statistic :id="id"></dataset-statistic>
        </el-tab-pane> -->
      </el-tabs>
    </div>

  </div>
</template>
  
<script>
import DatasetIntro from "../../components/DatasetIntro";
import DatasetStatistic from "../../components/DatasetStatistic";
import DatasetExperiment from "../../components/DatasetExperiment";
import UserDefinedPre from "../../components/UserDefinedPre.vue";

export default {

  components: {
    DatasetIntro,
    DatasetStatistic,
    DatasetExperiment,
    UserDefinedPre
  },

  data() {
    return {
      id: 1,
      origin_id: 1,
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
        long_description: "\n",
        sample: {
          head: [],
          sample_data: []
        },
        created: "",
        experiment_times: 0,
        record_count: 0,
      },
      process_info: [],
      areaOptions: ["医疗"],
      taskOptions: ["通用"],
      changeInfoDialogVisible: false,
      exp_count: 2,
      exp_list: [],
      activeName: 'first',
      version_choose: null,
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
      resultList: []
    }
  },

  created() {

  },


  mounted() {
    var that = this
    if(!this.login_manager.get()){
        that.$notify.warning({
            title: '未登录，请先登录账号',
            duration: 5000
          });
        that.$router.push('/login');
        return
      }
    const id = this.$route.params.id
    this.origin_id = parseInt(id)
    this.id = parseInt(id)
    this.get_datasets(id)
    this.version_choose = this.id
  },

  methods: {
    change(value, render) {
      this.html = render;
    },
    beautifyTimestamp(ts) {
      if(ts == "" || ts == undefined){
        return ""
      }
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
        console.log("DataDetails_wang get_datasets")
        console.log(res)
        if (res.status == 200) {
          let data = res.data
          if (data.father == null) {
            data.children.push({
              'children_id': [data.id],
              'children_name': [data.name],
            })
          }
          else {
            data.children = that.detail.children
          }
          that.detail = data
          that.parseHistoryRecord()
        } else {
          that.$notify.error({
            title: '服务器失败 :/predata/' + id + ' get',
            message: res.response,
            duration: 5000
          });
        }
      });
    },
    versionChange(version) {
      if (version != this.id) {
        this.get_datasets(version)
        this.id = version
        this.$router.push(version)
        // this.$refs.child.$emit('childMethod','发送给方法一的数据') // 方法1:触发监听事件
        // this.$refs.child.getData(version, 0, 100) // 方法2:直接调用
        this.$bus.$emit("xxx", version, 0, 100)
        this.$bus.$emit("method2", version)
      } 
    },
    parseHistoryRecord() {
      if (this.detail.process_code === "") {
        return
      }
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
    },
    changeInfo(e) {
      e.stopPropagation();
      console.log("?")
      this.changeInfoDialogVisible = true
    },
    deleteDataset() {
      var that = this;
      this.$http_wang({
        url: "/predata/" + that.id + '/',
        method: "delete",
      }).then((res) => {
        console.log(res)
        if (res.status == 200) {
          that.$notify({
            title: '删除成功',
            duration: 5000
          });
          // todo: 刷新页面
          that.$router.push('/datasets')
        } else {
          that.$notify.error({
            title: '服务器失败 :/predata/ delete',
            message: res.response,
            duration: 5000
          });
        }
      });
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

.experiment > div {
  height: 22px;
  flex: 1;
}

#id {
  margin-top: 10px;
}

.version-choose {
  position: absolute;
  top: 130px;
  right: 175px;
}
</style>