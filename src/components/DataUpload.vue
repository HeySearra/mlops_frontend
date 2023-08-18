<template>
  <div id="upload-frame">
    <el-form ref="datasetInfoRef" :rules="rules" :model="datasetInfo" label-width="80px" size="mini">
      <el-form-item label="数据名称" prop="name">
        <el-input v-model="datasetInfo.name"></el-input>
      </el-form-item>
      <el-form-item label="数据简介" prop="short_description">
        <el-input type="textarea" autosize placeholder="请输入数据简介" v-model="datasetInfo.short_description">
        </el-input>
      </el-form-item>
      <el-form-item label="详细介绍" prop="long_description">
        <el-input type="textarea" autosize placeholder="请输入数据详情介绍" v-model="datasetInfo.long_description">
        </el-input>
      </el-form-item>
      <el-form-item label="领域" prop="area">
        <el-select @change="selectChanged" v-model="datasetInfo.area" placeholder="请选择">
          <el-option v-for="a in areaOptions" :key="a" :label="a" :value="a">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间列" prop="time_series">
        <el-input v-model="datasetInfo.time_series"></el-input>
      </el-form-item>
      <el-form-item label="id列" prop="id_col">
        <el-input v-model="datasetInfo.id_col"></el-input>
      </el-form-item>
      <!-- <el-form-item label="任务" :rules="[{ required: true }]">
        <el-select v-model="datasetInfo.task" placeholder="请选择">
          <el-option v-for="b in taskOptions" :key="b" :label="b" :value="b">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="文件:" prop="fileList">
        <el-upload id="upload-view" v-model="datasetInfo.file" drag multiple ref="upload" accept=".csv, .xlsx"
          :before-upload="beforeUpload" :on-preview="handlePreview" :file-list="fileList" :on-remove="handleRemoveFile"
          :on-success="handleUploadSuccess" :on-progess="handleUploadProgess" :on-change="handleFileListChange"
          :data="datasetInfo" action="/wang/predata/pre_upload/">

          <!-- :auto-upload="false"  -->
          <i class="el-icon-upload" id="upload-view" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传csv（或excel）数据文件</div>
        </el-upload>
      </el-form-item>
    </el-form>

    <!--      第三步：关系表与谓词映射        -->
    <el-container style="height: 100%; border: 1px solid #eee">

      <el-main>
        <el-card shadow="never"
          style="width: 600px; max-width: 600px; height: 200px; overflow: scroll; overflow-x:hidden">
          <div slot="header" style="font-size: 15px; font-weight: bold">
            <i class="el-icon-document-copy"></i>
            用户表中字段
          </div>
          <div v-if="show_head_upload">
            <div style="display:inline;margin-right:10px; height: 100%"
              v-for="(item, index) in tableData[handleTableIndex].fields" :key="index">
              <!--          引入推荐           -->
              <el-button v-if="isFieldRecommend(item)" type="warning" plain size="mini" style="margin-bottom: 8px"
                @click="selectField(index)">{{ item }}
              </el-button>
              <el-button v-else type="info" plain size="mini" style="margin-bottom: 8px" @click="selectField(index)">{{
                item }}
              </el-button>
            </div>
          </div>
          <div v-else>
            暂未上传用户文件
          </div>
        </el-card>

        <!--                    关系列表展示卡片                     -->
        <el-card shadow="never" style="margin-top: 2%; width: 600px;">
          <div slot="header" style="font-size: 15px; font-weight: bold">
            <i class="el-icon-document-copy"></i>
            领域特征
            <el-tooltip class="item" effect="dark" content="请添加关系，并选择表中字段中该头/尾实体的关键属性，完成关系映射" placement="top-start">
              <i class="el-icon-info" style="margin-left: 5px;margin-top: 3px"></i>
            </el-tooltip>

            <el-select v-model="valueMeta" value-key="fromId" collapse-tags placeholder="请选择特征"
              @change="selectEdgeChange">
              <div class="el-input" style="width:90%;margin-left:5%;">
                <input type="text" placeholder="请输入" class="el-input__inner" v-model="dropDownValue"
                  @keyup="dropDownSearch">
              </div>
              <el-option v-for="item in optionsMetaShow" :key="item.fromId" :label="item.fromLabel"
                :value="item"></el-option>
            </el-select>
            <el-button size="small" type="primary" @click="handleMapping">推荐匹配</el-button>
            <el-button v-if="!tableData[handleTableIndex].mappingSaved" style="float: right" type="warning"
              icon="el-icon-plus" plain size="small" @click="addEdgeInstance">新增
            </el-button>
            <!-- <el-button style="float: right" type="danger" v-if="!tableData[handleTableIndex].mappingSaved"
                icon="el-icon-delete" circle plain size="mini" @click="deleteEdgeInstance(index)"></el-button> -->

          </div>

          <el-table v-if="tableData[handleTableIndex].edgeInstances.length > 0"
            :data="tableData[handleTableIndex].edgeInstances" :row-style="{ height: '40px' }"
            :cell-style="{ padding: '1px' }" style="overflow: scroll; overflow-x:hidden; height: 500px;">
            <!-- <el-row :gutter="20" style="margin-bottom: 20px;">
                <el-col :span="150"></el-col>
              </el-row> -->
            <el-table-column label="待对齐特征" width="150">
              <template slot-scope="scope">
                <el-popover trigger="hover" :content="scope.row.fromName">
                  <div slot="reference" style="margin: 0; padding: 0">
                    <!-- 问题列显示文本 即触发Popover显示的HTML元素 -->
                    {{ scope.row.fromLabel }}
                  </div>
                </el-popover>
              </template>
            </el-table-column>

            <el-table-column>
              <template slot-scope="scope">
                <div v-if="tableData[handleTableIndex].mappingSaved">
                  <div v-if="scope.row.fromValue === -1">
                    <el-tag style="margin-right: 10px" size="small"> 当前实例</el-tag>
                  </div>
                  <div v-else-if="scope.row.fromValue !== null">
                    <el-tag style="margin-right: 10px" size="small"> {{ scope.row.fromValue }}
                    </el-tag>
                  </div>
                </div>
                <div v-else>
                  <div v-if="scope.row.fromValue === -1">
                    <el-tag style="margin-right: 10px" size="small"> 当前实例</el-tag>
                  </div>
                  <div v-else-if="scope.row.fromValue === null">
                    <el-button @click="addEdge(scope.$index, 'fromValue')" icon="el-icon-plus" size="mini" plain>选择字段
                    </el-button>
                  </div>
                  <div v-else>
                    <el-tag style="margin-right: 10px" closable size="small" type="info"
                      @close="deletePropMapping(scope.$index, 'fromValue', 0)"> {{ scope.row.fromValue }}
                    </el-tag>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteEdgeInstance(scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-else style="color: #909399; font-size: 12px; margin-left: 45%">
            未选择领域或该领域下无特征
          </div>
        </el-card>
      </el-main>
    </el-container>
    <!--    新增关系实例对话框    -->
    <el-dialog title="新增系统特征" :visible.sync="dialogAddingEdgeVisible" append-to-body style="width: auto ">

      <div id="upload-frame">
        <el-form ref="headUploadRef" :rules="rules" :model="headUpload" label-width="80px" size="mini">
          <el-form-item label="领域" prop="area">
            <el-select @change="selectChanged" v-model="headUpload.area" placeholder="请选择">
              <el-option v-for="a in areaOptions" :key="a" :label="a" :value="a">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="特征名" prop="name">
            <el-input v-model="headUpload.name"></el-input>
          </el-form-item>
          <el-form-item label="特征简介" prop="description">
            <el-input type="textarea" autosize placeholder="请输入特征简介" v-model="headUpload.description">
            </el-input>
          </el-form-item>
          <!-- <el-form-item label="类型" prop="type">
              <el-select @change="selectChanged" v-model="headUpload.type" placeholder="请选择">
                <el-option v-for="a in typeOption" :key="a" :label="a" :value="a">
                </el-option>
              </el-select>
            </el-form-item> -->
        </el-form>
        <el-button size="small" type="primary" @click="handleHeadUpload">新增</el-button>
      </div>
    </el-dialog>


    <el-button size="small" type="primary" @click="handleUpload">上传</el-button>
  </div>
</template>

<script>
// 我们似乎需要上传时附带Cookie....
export default {
  data() {
    return {
      search: '',
      need_refresh: false,
      fileList: [],
      areaOptions: ["1"],
      typeOption: ['String', 'Int', 'Float'],
      taskOptions: ["通用"],
      datasetInfo: {
        name: '',
        task: '',
        short_description: '',
        long_description: '',
        area: '',
        time_series: "",
        id_col: "",
        file: null,
        fileList: null,
      },
      headUpload: {
        area: '',
        type: '',
        name: '',
        description: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        area: [
          { required: true, message: '请选择领域', trigger: 'blur' },
        ],
        short_description: [
          { required: true, message: '请填写数据简介', trigger: 'blur' },
        ],
        long_description: [
          { required: true, message: '请填写详细介绍', trigger: 'blur' },
        ],
        fileList: [
          { required: true, message: '请上传文件', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择特征类型', trigger: 'blur' }
        ],
        // file: [
        //   {required: true, message: '请上传文件', trigger: 'blur' },
        // ]
      },
      show_head_upload: false,

      //所有概念名
      conceptName: [],

      //所有概念数据
      conceptData: [
        { 'name': '概念1' },
        { 'name': '概念2' },
        { 'name': '概念3' },
      ],

      //我的系统里tableData只能有一行
      tableData: [{
        name: 'name',
        conceptMapped: false,
        fields: ['1', '2'],
        concepts: ['tD概念1', 'tD概念2'],
        conceptInstances: {
          length: 1
        },
        edgeInstances: [
          //   {
          //   edgeId: '1',
          //   fromId: '1',
          //   // toId: '1',
          //   fromValue: 'fromValue1',
          //   // toValue: 'toValue',
          //   fromLabel: 'flable1',
          //   // toLabel: 'tlable',
          // },
          // {
          //   edgeId: '2',
          //   fromId: '2',
          //   // toId: '1',
          //   fromValue: 'fromValue2',
          //   // toValue: 'toValue',
          //   fromLabel: 'flable2',
          //   // toLabel: 'tlable',
          // },
          // {
          //   edgeId: '3',
          //   fromId: '3',
          //   // toId: '1',
          //   fromValue: null, //这是要置为tableData.field的
          //   // toValue: 'toValue',
          //   fromLabel: 'flable3',
          //   // toLabel: 'tlable',
          // }
        ],
        conceptInstances: {
          conceptId: '1',
          conceptName: 'name',
          mapProps: {
            1: 1,
            2: 2,
          },
        },
      }],

      // 当前正在处理的表的index（由于default-active接收String，因此再设定一个handleTableIndex的String类型的变量）
      handleTableIndex: 0,

      // 交互图点集和边集
      nodes: [],
      edges: [],

      // 定义当前正在做的属性映射，结构为 handlePropInfo = 'concept_index'+'_'+'prop'，用来存储当前点击的"概念下标_属性名"
      // 每次完成一次映射时更新、handleTableIndex改变时更新
      handlePropInfo: '',
      handleEdgeInfo: '',

      // 添加系统表头对话框是否显示
      dialogAddingEdgeVisible: false,

      //搜索框
      dropDownValue: '',
      optionsMetaShow: [],
      valueMeta: []
    }
  },
  created() {
  },

  mounted() {
    if(!this.login_manager.get()){
        return
      }
    this.get_area();
  },
  methods: {
    getCookie(name) {
      var value = '; ' + document.cookie
      var parts = value.split('; ' + name + '=')
      if (parts.length === 2) return parts.pop().split(';').shift()
    },

    get_head_list() {
      var that = this;
      this.$http_wang({
        url: "/head/",
        method: "get",
        params: {
          "area": that.datasetInfo.area,
        }
      }).then((res) => {
        if (res.status == 200) {
          let data = res.data
          console.log("表头")
          console.log(res.data)
          that.tableData[0].edgeInstances = []
          for (let item in res.data) {
            that.tableData[0].edgeInstances.push({
              edgeId: res.data[item].id,
              fromId: res.data[item].id,
              // toId: '1',
              fromValue: null,
              // toValue: 'toValue',
              fromLabel: res.data[item].name,
              fromName: res.data[item].description,
            })
          }
        }
        else {
          that.$notify.error({
            title: '服务器失败 :/head/ area=' + that.datasetInfo.area,
            message: res.response,
            duration: 5000
          });
        }
        // this.count = data.count
        // this.resultList = data.results
      })
    },

    get_area() {
      var that = this;
      this.$http_wang({
        url: "/head/get_area/",
        method: "get",
        params: {
        }
      }).then((res) => {
        // console.log("area")
        // console.log(res.data)
        if (res.status == 200) {
          that.areaOptions = res.data.areas
          // this.count = data.count
          // this.resultList = data.results
        }
        else {
          that.$notify.error({
            title: '服务器失败 :/head/get_area/',
            message: res.response,
            duration: 5000
          });
        }
      })
    },
    selectChanged() {
      this.get_head_list();
    },


    selectEdgeChange(value) {
      let proNum = this.tableData[0].edgeInstances.findIndex((item, index) => {
        return item.edgeId == value.edgeId
      })

      this.addEdge(proNum, 'fromValue')
    },

    dropDownSearch() {
      // this.get_head_list();
      var that = this;
      that.valueMeta = [];
      that.optionsMetaShow = that.tableData[0].edgeInstances.filter(that.filterSearch);
    },

    filterSearch(item) {
      if (this.dropDownValue == "") return false;
      return item.fromLabel.includes(this.dropDownValue);
    },

    async handleMapping() {
      var ontology_value = {};
      var that = this;
      for (var item in this.areaOptions) {
        var res = await this.$http_wang({
          url: "/head/",
          method: "get",
          params: {
            "area": this.areaOptions[item],
          }
        })
        // console.log("表头")
        // console.log(res.data)
        if (res.status == 200) {
          var li = new Array();
          for (var a in res.data) {
            li.push(res.data[a].name)
          }
          ontology_value[this.areaOptions[item]] = li
        }
        else {
          that.$notify.error({
            title: '服务器失败 :/head/ area=' + this.areaOptions[item],
            message: res.response,
            duration: 5000
          });
        }
      }

      var params = {
        // ontology: JSON.stringify(ontology_value),
        ontology: ontology_value,
        tables: {
          // table1: JSON.stringify(this.tableData[0].fields),
          table1: this.tableData[0].fields,
        },
        field: that.datasetInfo.area,
        isModified: 0,
        thresholdofTable: 0.35,
        thresholdofcol: 1.05
      }
      this.$http_zyq({
        url: "/getOneTabColToAttributes/",
        method: "post",
        data: params,
        headers: {
          'Content-Type': 'application/json'
        },
      }).then((res) => {
        console.log("ok!", res)
        if (res.status == 200) {
          console.log("auto mapping done")
          console.log(res)
          // that.upload_data_df = res
          that.$notify({
            title: '推荐匹配成功',
            duration: 5000
          });
          let edge_instance = that.tableData[this.handleTableIndex].edgeInstances
          let res_mapping = res.data.colToAttribute.table1
          let new_res_mapping = {};
          for (let key in res_mapping) {
            new_res_mapping[res_mapping[key]['value']] = key
          }
          for (let item in edge_instance) {
            if (Object.keys(new_res_mapping).indexOf(edge_instance[item].fromLabel) > -1) {
              edge_instance[item].fromValue = new_res_mapping[edge_instance[item].fromLabel]
            }
          }
          that.tableData[this.handleTableIndex].edgeInstances = edge_instance
          let res_mapping_keys = Object.keys(res_mapping)
          for (let a in res_mapping_keys) {
            this.tableData[this.handleTableIndex].fields.forEach(function (item, index, arr) {
              if (item == res_mapping_keys[a]) {
                arr.splice(index, 1);
              }
            });
          }
        } else {
          that.$notify.error({
            title: '服务器失败 :/getOneTabColToAttributes/',
            message: res.response,
            duration: 5000
          });
        }
      })
    },

    beforeUpload(file) {
      const { name, size } = file;
      this.file = file
      const index = name.lastIndexOf('.');
      // 判断文件名是否有后缀，没后缀文件错误
      if (index === -1) {
        this.$notify.error({
          title: '错误',
          message: '文件错误，请重新上传！',
        });
        return false
      }
      // const fileType = name.substr(index + 1);
      // const acceptFileTypes = ['csv', 'xlsx'];
      // 判断文件类型
      // if (!acceptFileTypes.includes(fileType)) {
      //   this.$notify.error({
      //     title: '错误',
      //     message: '文件类型错误，请重新上传！',
      //   });
      //   return false;
      // }
      // 判断文件大小
      if (size > 10 * 1024 * 1024) {
        this.$notify.error({
          title: '错误',
          message: '文件大小超过10M，请重新上传！',
        });
        return false;
      }
      // 默认true
      return true;
    },

    handleUpload() {
      // this.$refs.upload.submit();

      var that = this;
      that.$refs["datasetInfoRef"].validate((valid) => {
        if (!valid) {
          that.alert_msg.warning("请正确输入表单内容");
          return false;
        }
        // this.$refs.upload.submit();
      })
      // that.$refs["upload"].validate((valid) => {
      //   if (!valid) {
      //     that.alert_msg.warning("请上传文件");
      //     return false;
      //   }
      //   // this.$refs.upload.submit();
      // })

      console.log(this.file)
      var params = new FormData()
      params.append('file', this.file)
      params.append('name', this.datasetInfo.name)
      params.append('task', this.datasetInfo.name)
      params.append('area', this.datasetInfo.area)
      params.append('short_description', this.datasetInfo.short_description)
      params.append('long_description', this.datasetInfo.long_description)

      var time_series = that.datasetInfo.time_series;
      // if(that.datasetInfo.time_series != ""){
      //   time_series = that.datasetInfo.time_series
      // }
      var id_col = that.datasetInfo.id_col;
      // if(that.datasetInfo.id_col != ""){
      //   id_col = that.datasetInfo.id_col
      // }

      var store_name = {};
      for (var item in that.tableData[0].edgeInstances) {
        if (that.tableData[0].edgeInstances[item].fromValue != null) {
          if (time_series == that.tableData[0].edgeInstances[item].fromValue) {
            time_series = that.tableData[0].edgeInstances[item].fromLabel
          }
          else if (id_col == that.tableData[0].edgeInstances[item].fromValue) {
            id_col = that.tableData[0].edgeInstances[item].fromLabel
          }
          store_name[that.tableData[0].edgeInstances[item].fromLabel] = that.tableData[0].edgeInstances[item].fromValue
        }
      }
      params.append('store_name', JSON.stringify(store_name))
      params.append('process_code', "")
      params.append('father_name', "")

      params.append('time_series', time_series)
      params.append('id_col', id_col)
      this.$http_wang({
        url: "/predata/",
        method: "post",
        data: params,
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'X-CSRFToken': that.getCookie('csrftoken'),
        },
      }).then((res) => {
        console.log("ok!", res)
        if (res.status == 200) {
          console.log("upload done")
          console.log(res)
          that.upload_data_df = res
          that.$notify({
            title: '上传成功',
            duration: 5000
          });
          that.$router.go(0)
        } else {
          that.$notify.error({
            title: '服务器失败 :/predata/ post',
            message: res.response,
            duration: 5000
          });
        }
      })
    },
    handleRemoveFile() {
      this.show_head_upload = false;
      this.datasetInfo.fileList = null;
      this.datasetInfo.file = null;
      this.$refs.datasetInfoRef.validateField('fileList');
    },
    handleUploadSuccess(res) {
      var that = this;
      res = eval(res)
      console.log("in uploadSuccess")
      // this.upload_data_dict = res.data_dict;
      this.tableData[0].fields = res.head;
      this.show_head_upload = true;
      this.$refs.datasetInfoRef.validateField('fileList');
    },
    handleUploadProgess() {

    },
    sendUploadRequest() {

    },
    handleFileListChange(file, fileList) {
      // this.fileList = fileList
      this.datasetInfo.fileList = fileList;// 防止用户打开了文件选择框之后不选择文件而出现效验失败if(this.form.fileList){this.$refs.form.clearValidate('fileList');} 
      this.$refs.datasetInfoRef.validateField("fileList");
    },
    handlePreview() {

    },
    handleBefore(file) {
      const { name, size } = file;
      this.file = file
      const index = name.lastIndexOf('.');
      // 判断文件名是否有后缀，没后缀文件错误
      if (index === -1) {
        this.$notify.error({
          title: '错误',
          message: '文件错误，请重新上传！',
        });
        return false
      }
      // const fileType = name.substr(index + 1);
      // const acceptFileTypes = ['csv', 'xlsx'];
      // 判断文件类型
      // if (!acceptFileTypes.includes(fileType)) {
      //   this.$notify.error({
      //     title: '错误',
      //     message: '文件类型错误，请重新上传！',
      //   });
      //   return false;
      // }
      // 判断文件大小
      if (size > 10 * 1024 * 1024) {
        this.$notify.error({
          title: '错误',
          message: '文件大小超过10M，请重新上传！',
        });
        return false;
      }
      // 默认true
      return true;
    },

    async handleHeadUpload() {
      var that = this;
      that.$refs["headUploadRef"].validate((valid) => {
        if (!valid) {
          // that.alert_msg.warning("请正确输入表单内容");
          this.$message.warning('请正确输入表单内容')
          return false;
        }
      })
      var params = {
        'name': that.headUpload['name'],
        'area': that.headUpload['area'],
        'description': that.headUpload['description'],
      }

      var res = await that.$http_wang({
        url: "/head/",
        method: "post",
        data: params
      })
      // console.log(res.data)
      if (res.status == 200) {
        that.headUpload = {
          area: '',
          name: '',
          description: '',
        }
        that.dialogAddingEdgeVisible = false
        that.get_head_list()
        that.get_file_head_list()
        var res = that.$refs.upload.submit();
        that.$message({
          type: 'success',
          message: '添加成功!'
        });
      }
      else {
        that.$notify.error({
          title: '服务器失败 :/head/ post',
          message: res.response,
          duration: 5000
        });
      }
    },

    get_file_head_list() {
      var that = this
      var params = new FormData()
      params.append('file', this.file)
      this.$http_wang({
        url: "/predata/pre_upload/",
        method: "post",
        data: params,
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'X-CSRFToken': that.getCookie('csrftoken'),
        },
      }).then((res) => {
        console.log("ok!", res)
        if (res.status == 200) {
          res = eval(res)
          console.log("in get_file_head_list")
          // this.upload_data_dict = res.data_dict;
          that.tableData[0].fields = res.data.head;
          that.show_head_upload = true;
          that.$refs.datasetInfoRef.validateField('fileList');
        } else {
          that.$notify.error({
            title: '服务器失败 :/predata/pre_upload/',
            message: res.response,
            duration: 5000
          });
        }
      })
    },

    /*******  第三步：关系表字段与谓词映射 方法定义 ******/

    addEdgeInstance() {
      // 弹出交互图对话框
      this.dialogAddingEdgeVisible = true
    },

    // 删除所选关系实例
    deleteEdgeInstance(item, instance_index) {
      this.$confirm('是否删除所选系统特征?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        var res = await this.$http_wang({
          url: "/head/" + item.edgeId + "/",
          method: "delete",
          // params: {
          //   "id": item.edgeId,
          // }
        })
        console.log(res.data.message)
        let table = this.tableData[0]
        let edge_instance = table.edgeInstances[instance_index]
        console.log(item)
        // 把映射值归位
        let from_value = edge_instance.fromValue
        if (from_value !== -1 && from_value !== null) table.fields.push(from_value)
        table.edgeInstances.splice(instance_index, 1)

        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        that.$notify.error({
          title: '服务器失败 :"head/' + item.edgeId + '/',
          message: res.response,
          duration: 5000
        });
      });
    },

    // 选择属性时，对概念-属性信息进行记录
    addProp(instance_index, prop) {
      this.handlePropInfo = instance_index + '+' + prop
    },

    // 选择头尾实体时，对关系映射信息进行记录
    addEdge(instance_index, toOrFrom) {
      this.handleEdgeInfo = instance_index + '+' + toOrFrom
    },

    // 先选了属性/实体再选择字段时，完成映射
    selectField(index) {
      // 选择的字段名称
      let field = this.tableData[this.handleTableIndex].fields[index]

      if (this.handlePropInfo === '' && this.handleEdgeInfo === '') {
        this.$message.error('请先选择属性或头/尾实体！')
      }
      // 属性映射
      else if (this.handlePropInfo !== '') {
        // 把handlePropInfo拆开
        let instance_index = this.handlePropInfo.split('+')[0]
        let prop = this.handlePropInfo.split('+')[1]

        // conceptInstances 是 tableData 的一个子元素，代表当前表生成的实例节点列表
        // conceptInstances 中的 mapProps 是Map类型，用于存放当前实例节点对应的属性，格式为：{属性, 字段}
        this.tableData[this.handleTableIndex].conceptInstances[instance_index].mapProps.set(prop, field)
        this.tableData[this.handleTableIndex].fields.splice(index, 1) // 把待映射的字段删除掉
        //清空handlePropInfo
        this.handlePropInfo = ''
      }
      // 关系映射
      else {
        // 把handleEdgeInfo拆开
        let instance_index = this.handleEdgeInfo.split('+')[0]
        let toOrFrom = this.handleEdgeInfo.split('+')[1]

        // 设置to或from的value为field
        let edge_instance = this.tableData[this.handleTableIndex].edgeInstances[instance_index]
        if (toOrFrom === 'toValue') edge_instance.toValue = field
        if (toOrFrom === 'fromValue') edge_instance.fromValue = field
        this.tableData[this.handleTableIndex].fields.splice(index, 1) // 把待映射的字段删除掉

        //清空handleEdgeInfo
        this.handleEdgeInfo = ''
      }
    },

    // 按照字符串相似度进行字段推荐
    isFieldRecommend(field) {
      if (this.handlePropInfo === '') return false
      let prop = this.handlePropInfo.split("+")[1]
      let similarity = 1 - this.minDistance(field, prop) / Math.max(field.length, prop.length)
      return similarity >= 0.8;
    },

    // 字符串编辑距离计算
    minDistance(w1, w2) {
      let len1 = w1.length
      let len2 = w2.length
      let dp = new Array(len1 + 1).fill(0).map(() => Array(len2 + 1).fill(0))
      for (let i = 0; i <= len1; i++) {
        dp[i][0] = i
      }
      for (let i = 0; i <= len2; i++) {
        dp[0][i] = i
      }
      for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
          if (w1[i - 1] === w2[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1]
          } else {
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + 1)
          }
        }
      }
      return dp[len1][len2]
    },

    // 属性-字段一键匹配
    recommendAllProps(index) {
      let fields = this.tableData[this.handleTableIndex].fields
      let instance = this.tableData[this.handleTableIndex].conceptInstances[index]
      let props = this.conceptData[this.conceptName.findIndex(i => i === instance.conceptName)].props

      for (let i in props) {
        this.addProp(index, props[i])
        for (let j in fields) {
          if (this.isFieldRecommend(fields[j])) {
            this.selectField(j)
            break
          }
        }
      }
    },

    // 删除映射标签
    // 第一个参数 instance_index：当前实例节点下标
    // 第二个参数 prop：属性映射值，或关系头/尾节点value值
    // 第三个参数 isPropMapping：1表示属性，0表示关系
    deletePropMapping(instance_index, prop, isPropMapping) {
      // 待删除的映射标签字段
      let field
      // 属性映射
      if (isPropMapping === 1) {
        // 将mapProps对应的map设置为null
        let concept_instance = this.tableData[this.handleTableIndex].conceptInstances[instance_index]
        field = concept_instance.mapProps.get(prop)
        concept_instance.mapProps.set(prop, null)
      }
      // 关系映射
      else {
        let edge_instance = this.tableData[this.handleTableIndex].edgeInstances[instance_index]
        // prop的值应该为 toValue 或 fromValue，将对应的value设置为null
        if (prop === 'toValue') {
          field = edge_instance.toValue
          edge_instance.toValue = null
        } else {
          field = edge_instance.fromValue
          edge_instance.fromValue = null
        }
      }
      // 恢复字段标签
      this.tableData[this.handleTableIndex].fields.push(field)
    },


  }
}

</script>

<style>
.el-upload {
  width: 100%;
}

#upload-frame {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}

#upload-view {
  margin-bottom: 10px;
}

.el-table__body-wrapper::-webkit-scrollbar {
  /*width: 0;宽度为0隐藏*/
  width: 0px;
}

.el-scrollbar {
  display: block !important;
}
</style>