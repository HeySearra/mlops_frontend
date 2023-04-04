<template>
  <div>
    <mavon-editor class='md' v-model="detail.long_description" defaultOpen="preview" :subfield="false"
                  :editable="false" :toolbarsFlag="false" :shortCut="false" :boxShadow="false" />
    <el-card shadow="never">
      <div slot="header" class="card-title">
        <span>数据集预览</span>
        <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-download"
                   @click="Download">下载数据集</el-button>
      </div>

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
      default: null
    }
  }
}
</script>

<style scoped>

</style>