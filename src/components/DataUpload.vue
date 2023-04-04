<template>
  <div id="upload-frame">
    <el-form ref="form" 
      :model="datasetInfo"
      label-width="80px"
      size="mini">
      <el-form-item label="数据名称" :rules="[{required: true}]">
        <el-input v-model="datasetInfo.name"></el-input>
      </el-form-item>
      <el-form-item label="数据简介" :rules="[{required: true}]">
        <el-input
          type="textarea"
          autosize
          placeholder="请输入数据简介"
          v-model="datasetInfo.short_description">
        </el-input>
      </el-form-item>
      <div>
        <el-form-item label="详细介绍" :rules="[{required: true}]">
          <el-input
              type="textarea"
              autosize
              placeholder="请输入数据详情介绍"
              v-model="datasetInfo.long_description">
          </el-input>
        </el-form-item>
        <el-form-item label="领域" :rules="[{required: true}]">
          <el-select v-model="datasetInfo.area" placeholder="请选择">
            <el-option
                v-for="a in areaOptions"
                :key="a"
                :label="a"
                :value="a">
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <el-form-item label="任务" :rules="[{required: true}]">
        <el-select v-model="datasetInfo.task" placeholder="请选择" >
          <el-option
            v-for="b in taskOptions"
            :key="b"
            :label="b"
            :value="b">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  
    <el-upload
      id="upload-view"
      drag
      multiple
      ref="upload"
      :auto-upload="false"
      :on-preview="handlePreview"
      :file-list="fileList"
      :on-remove="handleRemoveFile"
      :on-success="handleUploadSuccess"
      :on-progess="handleUploadProgess"
      :on-change="handleFileListChange"
      :data="datasetInfo"
      action="/wang/predata/"
      >
      <i class="el-icon-upload" id="upload-view"/>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload> 
    <el-button size="small" type="primary" @click="handleUpload">要上传力</el-button>
  </div>
</template>

<script>
// 我们似乎需要上传时附带Cookie....
export default {
    data(){
      return {
        need_refresh: false,
        fileList:[],
        areaOptions:["医疗"],
        taskOptions:["通用"],
        datasetInfo:{
          name:'',
          task:'',
          short_description:'',
          long_description:'',
          area:'',
          time_series:"114514",
          id_col:"114514"
        }
      }
    },
    methods:{
      handleUpload(){
        this.$refs.upload.submit();
      },
      handleRemoveFile(){

      },
      handleUploadSuccess(){
        this.datasetInfo = {
          name:'',
          task:'',
          short_description:'',
          long_description:'',
          area:'',
          time_series:"114514",
          id_col:"114514"
        }
      },
      handleUploadProgess(){

      },
      sendUploadRequest(){

      },
      handleFileListChange(file, fileList){
        this.fileList = fileList
      }
    }
}
</script>

<style>

.el-upload{
  width: 100%;
}

#upload-frame{
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}

#upload-view{
  margin-bottom: 10px;
}

</style>