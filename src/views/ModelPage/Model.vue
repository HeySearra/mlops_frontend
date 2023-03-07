<template>
  <div class="container">
    <div class="search-box">
      <el-input
        placeholder="搜索模型"
        v-model="input"
        style="width: 500px;"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="search"
        ></el-button>
      </el-input>

      <el-select
        v-model="task_selected"
        clearable
        placeholder="按任务类型筛选"
        @change="filter"
        style=" margin-left:20px"
      >
        <el-option
          v-for="(item, i) in task_list"
          :label="item"
          :key="i"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-button
        type="text"
        @click="clear_filter"
        style=" margin-left:10px"
      >取消筛选</el-button>
    </div>

    <p>共找到 {{count}} 个模型</p>

    <div
      class="card"
      v-for="(item,index) in resultList "
      :key="index"
    >
      <div
        style="cursor: pointer"
        @click="toModel(item)"
      >
        <div class="title">{{item.model_name}}
        </div>

        <div class="info">{{item.short_description}}</div>
        <div class="num">
          <el-tag
            size="small"
            type="success"
            style="margin-right:15px"
          >{{item.task }}</el-tag>
          <i class="el-icon-time"></i>
          {{item.created.substr(0,10)}} by {{item.owner}}
        </div>
      </div>
      <el-divider></el-divider>
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
      resultList: undefined,
      count: undefined,
      task_list: ['命名实体识别', '关系抽取', '实体关系联合抽取'],
      task_selected: '',
    }
  },

  created() {
    this.get_modelList()

  },


  mounted() {
  },

  methods: {
    get_modelList(page = 1) {
      this.$http({
        url: "/modelrepos/",
        method: "get",
        params: {
          page: page,
          task: this.task_selected,
          name: this.search_word
        }
      }).then((res) => {
        //console.log(res);
        let data = res.data
        this.count = data.count
        this.resultList = data.results
      })
    },

    filter() {
      this.get_modelList()
    },

    clear_filter() {
      this.task_selected = ''
      this.get_modelList()
    },

    search() {
      this.search_word = this.input.trim()
      this.get_modelList()
    },

    toModel(arg) {
      this.$router.push({
        name: "ModelDetails",
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
  margin-bottom: 30px;
}
.card {
  margin-right: 200px;
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
  line-height: 20px;
  font-size: 14px;
  color: #777;
}
</style>