<template>
  <div id="upload-frame">
    <el-upload
      id="upload-view"
      drag
      multiple
      :auto-upload="false"
      :on-preview="handlePreview"
      :file-list="fileList"
      :on-remove="handleRemoveFile"
      :on-success="handleUploadSuccess"
      :on-progess="handleUploadProgess"
      :http-request="sendUploadRequest"
      :on-change="handleFileListChange"
      :limit="5">
      <i class="el-icon-upload" id="upload-view"/>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">Tips</div>
    </el-upload>
    <el-button size="small" type="primary" @click="upload">要上传力</el-button>
  </div>
</template>

<script>
// 我们似乎需要上传时附带Cookie....
export default {
    data(){
      return {
        need_refresh: false,
        fileList:[],
      }
    },
    mounted:{

    },
    methods:{
      upload(){

      },
      handlePreview(){

      },
      handleRemoveFile(){

      },
      handleUploadSuccess(){

      },
      handleUploadProgess(){

      },
      sendUploadRequest(){

      },
      handleFileListChange(file, fileList){
        this.fileList = fileList
        console.log(this.fileList)
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