<template>
  <div class="container">
    <div class="search-box">
      <el-input
        placeholder="搜索数据集"
        v-model="input"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="search"
        ></el-button>
      </el-input>
    </div>

    <div class="filter">
      <el-card
        class="limit"
        shadow="never"
      >
        <div slot="header">
          <span>领域</span>
        </div>
        <el-collapse-transition>
          <div style="padding: 8px 0">
            <el-radio-group v-model="clusterFields.checkList">
              <el-radio
                v-for="(item, i) in clusterFields.data"
                :label="item"
                :key="i"
                @click.prevent.native="checkRadio(item, clusterFields)"
              >
                <el-tag
                  type="warning"
                  :effect="item == clusterFields.checkList ? 'light':'plain'"
                >{{ item }}</el-tag>
              </el-radio>
            </el-radio-group>
          </div>
        </el-collapse-transition>
      </el-card>

      <el-card
        class="limit"
        shadow="never"
      >
        <div slot="header">
          <span>任务</span>
        </div>
        <el-collapse-transition>
          <div style="padding: 8px 0">
            <el-radio-group v-model="clusterTasks.checkList">
              <el-radio
                v-for="(item, i) in clusterTasks.data"
                :label="item"
                :key="i"
                @click.prevent.native="checkRadio(item, clusterTasks)"
              >
                <el-tag
                  type="success"
                  :effect="item == clusterTasks.checkList ? 'light':'plain'"
                >{{ item }}</el-tag>
              </el-radio>
            </el-radio-group>
          </div>
        </el-collapse-transition>
      </el-card>

    </div>

    <p style="  margin-left: 400px; ">共找到 {{count}} 条数据集</p>
    <div class="data-result">
      <div
        v-for="(item,index) in resultList "
        :key="index"
      >
        <div
          style="cursor: pointer"
          @click="toDataset(item)"
        >
          <div class="title">{{item.name}}</div>
          <el-tag
            size="small"
            type="success"
          >{{item.task }}</el-tag>
          <el-tag
            type="warning"
            size="small"
          >{{item.area}}</el-tag>
          <div class="info">{{item.short_description}}</div>
          <div class="num">{{item.experiment_times}}次实验
            <span style="padding-left:20px"></span>
            <i class="el-icon-time"></i>
            {{item.created.substr(0,10)}} by {{item.owner}}
          </div>
        </div>
        <el-divider></el-divider>
      </div>
      <el-pagination
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="this.count"
      >
      </el-pagination>
    </div>

  </div>
</template>

<script>

export default {

  components: {

  },

  data() {
    return {
      input: '',
      search_word: '',
      count: undefined,
      resultList: undefined,
      clusterFields: {
        data: ['新闻', '金融', '医疗'],
        checkList: '',
      },
      clusterTasks: {
        data: ['命名实体识别', '关系抽取', '实体关系联合抽取'],
        checkList: '',
      }
    }
  },

  created() {
    this.get_datasets_list()
  },


  mounted() {

  },

  methods: {
    search() {
      this.search_word = this.input.trim()
      this.get_datasets_list()
    },

    get_datasets_list(page = 1) {
      this.$http({
        url: "/datasets/",
        method: "get",
        params: {
          page: page,
          area: this.clusterFields.checkList,
          task: this.clusterTasks.checkList,
          name: this.search_word
        }
      }).then((res) => {
        //console.log(res);
        let data = res.data
        this.count = data.count
        this.resultList = data.results
      })
    },

    checkRadio(val, cluster) {
      val == cluster.checkList ? cluster.checkList = '' : cluster.checkList = val
      this.get_datasets_list()
    },

    toDataset(arg) {
      this.$router.push({
        name: "DataDetails",
        params: {
          id: arg.id,
        },
      });
    },
  }

}
</script>

<style  scoped>
.container {
  padding: 40px 180px;
}
.search-box {
  width: 500px;
  margin-bottom: 40px;
}
.data-result {
  margin-left: 400px;
  margin-right: 80px;
}
.title {
  cursor: pointer;
  font-size: 24px;
  font-family: SimHei-Normal;
  font-weight: normal;
  text-align: LEFT;
  color: #5194e9;
  line-height: 30px;
}

.info {
  margin-top: 9px;
  line-height: 24px;
  font-size: 15px;
  color: #555;
  letter-spacing: 0.5px;
  font-family: Arial, "Microsoft yehei";
  text-justify: inter-word;
  text-align: justify;
}

.num {
  font-weight: bold;
  margin-top: 9px;
  line-height: 18px;
  font-size: 14px;
  color: #777;
}

.limit {
  float: left;
  width: 300px;
  margin-bottom: 50px;
}

.el-card {
  border: 1px solid #e0e0e0;
}

.filter {
  width: 400px;
}
.el-radio {
  margin-bottom: 8px;
  margin-right: 0px;
}

.el-tag {
  margin-right: 10px;
  margin-top: 8px;
}

.limit >>> .el-card__body {
  padding: 5px;
}
</style>
