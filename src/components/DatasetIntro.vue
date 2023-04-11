<template>
  <div class="dataset-intro-frame">
    <div style="margin-bottom: 50px">
      <el-card shadow="never">
        <div slot="header" class="card-title">
          <span>数据详情介绍</span>
        </div>
        <mavon-editor
            class='md'
            v-model="detail.long_description"
            defaultOpen="preview"
            :subfield="false"
            :editable="false"
            :toolbarsFlag="false"
            :shortCut="false"
            :boxShadow="false"
        />
      </el-card>
    </div>


    <el-card shadow="never">
      <div slot="header" class="card-title">
          <span>数据集预览</span>
        <span class="attr-label">Col-count:</span><span class="attr-value">{{detail.sample.head.length}}</span>
        <span class="attr-label">Record-count:</span><span class="attr-value">{{detail.record_count}}</span>
          <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-download"
                     @click="Download">下载数据集</el-button>
      </div>
      <el-table :data='detail.sample.sample' max-height="400" style="width: 100%">
        <el-table-column v-for="(item,idx) in detail.sample.head" :key="idx" :prop="item" :label="item" width="180"/>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {mavonEditor} from "mavon-editor";
import "mavon-editor/dist/css/index.css";

export default {
  name: "DatasetIntro.vue",
  components: {
    mavonEditor
  },
  data(){
    return{

    }
  },
  props:{
    detail:{
      type: Object,
      required: true,
      default: null,
    }
  },
  methods: {
    Download(){

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

.dataset-intro-frame{
  display: flex;
  flex-direction: column;
}
/*设置mavon编辑器的框的样式*/
.v-note-wrapper{
  min-height: auto;
  max-height: 500px;
}

.attr-label{
  font-size: 10px;
  color: #a3a3a3;
  margin-right: 10px;
  margin-left: 20px;
}

.attr-value{
  font-size: 10px;
  color: #a3a3a3;
}
</style>