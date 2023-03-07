<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card
          class="new-card"
          shadow="never"
        >
          <div
            slot="header"
            class="clearfix"
          >
            <span>选择数据集</span>
          </div>
          <div class="card-item">
            <div class="search-box">
              <el-input
                placeholder="搜索数据集"
                v-model="input[0]"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="search_data"
                ></el-button>
              </el-input>
            </div>
            <el-card
              shadow="never"
              class="my"
              v-for="(item,index) in data_list "
              :key="index"
              @dblclick.native="data_selected = item"
            >
              <div
                class="title"
                @click="toDataset(item.id)"
              >{{item.name}}</div>
              <div class="info">{{item.short_description}}</div>
            </el-card>

          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card
          class="new-card"
          shadow="never"
        >
          <div
            slot="header"
            class="clearfix"
          >
            <span>新建实验</span>
            <el-button
              style="float: right; padding:5px 10px;color:#000"
              plain
            >运行</el-button>
          </div>
          <div class="card-item">
            <p>数据</p>
            <el-card
              shadow="never"
              class="my"
              v-if="data_selected"
            >
              <div class="title">{{data_selected.name}}</div>
              <div class="info">{{data_selected.short_description}}</div>
            </el-card>
            <el-divider></el-divider>
            <div>
              <p>模型</p>
              <el-card
                shadow="never"
                class="my"
                v-if="model_selected"
              >
                <div class="title">{{model_selected.model_name}}</div>

              </el-card>
            </div>
          </div>

        </el-card>
      </el-col>
      <el-col :span="8">

        <el-card
          class="new-card"
          shadow="never"
        >
          <div
            slot="header"
            class="clearfix"
          >
            <span>选择模型</span>
          </div>
          <div class="card-item">
            <div class="search-box">
              <el-input
                placeholder="搜索模型"
                v-model="input[1]"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="search_model"
                ></el-button>
              </el-input>
            </div>

            <el-card
              shadow="never"
              class="my"
              v-for="(item,index) in model_list "
              :key="index"
              @dblclick.native="model_selected = item"
            >
              <div
                class="title"
                @click="toModel(item.id)"
              >{{item.model_name}}</div>
              <div class="info">{{item.short_description}}</div>
            </el-card>

            <p class='text'>模型推荐</p>
            <el-card
              shadow="never"
              class="my"
            >
              <div
                class="title"
                @click="toModel(1)"
              >{{title}}</div>
              <div class="info">{{info}}</div>
            </el-card>
          </div>
        </el-card>

      </el-col>
    </el-row>
  </div>
</template>

<script>
//import draggable from 'vuedraggable'
export default {

  components: {
    // draggable

  },

  data() {
    return {
      input: ['', ''],
      search_word: ['', ''],
      data_selected: undefined,
      model_selected: undefined,
      model_list: [],
      data_list: [],
      title: 'bert-softmax',
      info: '经典的bert-softmax模型用于命名实体识别',
    }
  },

  created() {

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
          name: this.search_word[1]
        }
      }).then((res) => {
        //console.log(res);
        let data = res.data
        this.model_list = data.results
      })
    },

    get_dataList(page = 1) {
      this.$http({
        url: "/datasets/",
        method: "get",
        params: {
          page: page,
          name: this.search_word[0]
        }
      }).then((res) => {
        let data = res.data
        this.data_list = data.results
      })
    },
    search_model() {
      this.search_word[1] = this.input[1].trim()
      this.get_modelList()
    },

    search_data() {
      this.search_word[0] = this.input[0].trim()
      this.get_dataList()
    },

    toModel(id) {
      const { href } = this.$router.resolve({
        name: "ModelDetails",
        params: {
          id: id,
        },
      });
      window.open(href, '_blank')
    },

    toDataset(id) {
      const { href } = this.$router.resolve({
        name: "DataDetails",
        params: {
          id: id,
        },
      });
      window.open(href, '_blank')
    },
  }

}
</script>

<style  scoped>
.container {
  padding: 18px 80px;
}

.new-card >>> .el-card__header {
  background-color: #2b354b;
  height: 50px;
  color: #fff;
  text-align: center;
  padding: 14px;
  font-size: 17px;
}

.new-card.el-card {
  min-height: 80vh;
  max-height: 80vh;
}

.text {
  text-align: center;
  margin-top: 50px;
  font-weight: bold;
}

.el-card {
  border: 1px solid #c0c4cc;
  margin-top: 20px;
  overflow-y: auto;
}

.title {
  cursor: pointer;
  font-size: 16px;
  font-family: SimHei-Normal;
  font-weight: normal;
  text-align: LEFT;
  color: #5194e9;
  line-height: 30px;
}

.info {
  margin-top: 9px;
  line-height: 24px;
  font-size: 14px;
  color: #555;
  letter-spacing: 0.5px;
  font-family: Arial, "Microsoft yehei";
  text-justify: inter-word;
  text-align: justify;
}

.my >>> .el-card__body {
  padding: 12px;
}

.model {
  vertical-align: middle;
  display: table-cell;
}

p {
  margin: 0;
}
</style>


