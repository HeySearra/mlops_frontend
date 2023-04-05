<template>
  <div>
    <!-- <mavon-editor class='md' v-model="Introduction" defaultOpen="preview" :subfield="false"
                  :editable="false" :toolbarsFlag="false" :shortCut="false" :boxShadow="false" /> -->
    <el-card shadow="never">
      <div slot="header" class="card-title">
        <span>数据集预览</span>
        <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-download"
                   @click="Download">下载数据集</el-button>
      </div>
      <el-table :data='Introduction.sample' max-height="400" style="width: 100%">
        <el-table-column v-for="item in Introduction.head" :key="item" :prop=item :label=item width="180">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "DatasetIntro.vue",
  data(){
    return{

    }
  },
  props:{
    Introduction:{
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
</style>