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
        <el-select v-model="datasetInfo.area" placeholder="请选择">
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
        <el-upload id="upload-view" v-model="datasetInfo.file" drag multiple ref="upload" 
          accept=".csv, .xlsx" 
          :before-upload="beforeUpload"
          :on-preview="handlePreview"
          :file-list="fileList" 
          :on-remove="handleRemoveFile"
          :on-success="handleUploadSuccess"
          :on-progess="handleUploadProgess" 
          :on-change="handleFileListChange" 
          :data="datasetInfo"
          action="/wang/predata/pre_upload/">
          
        <!-- :auto-upload="false"  -->
          <i class="el-icon-upload" id="upload-view" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传csv（或excel）数据文件</div>
        </el-upload>
      </el-form-item>
    </el-form>

    <!--      第三步：关系表与谓词映射        -->
    <div v-if="active_step === 3">

      <el-container style="height: 100%; border: 1px solid #eee">

        <el-main>
          <el-card shadow="never" style="height: 150px; overflow: scroll; overflow-x:hidden">
            <div slot="header" style="font-size: 15px; font-weight: bold">
              <i class="el-icon-document-copy"></i>
              表中字段
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
          <el-card shadow="never" style="margin: 2%">
            <div slot="header" style="font-size: 15px; font-weight: bold">
              <i class="el-icon-document-copy"></i>
              领域表头
              <el-tooltip class="item" effect="dark" content="请添加关系，并选择表中字段中该头/尾实体的关键属性，完成关系映射" placement="top-start">
                <i class="el-icon-info" style="margin-left: 5px;margin-top: 3px"></i>
              </el-tooltip>
              <!-- <el-button v-if="!tableData[handleTableIndex].mappingSaved" style="float: right" type="warning"
                icon="el-icon-plus" plain size="small" @click="addEdgeInstance">新增
              </el-button> -->
              <!-- <el-button style="float: right" type="danger" v-if="!tableData[handleTableIndex].mappingSaved"
                icon="el-icon-delete" circle plain size="mini" @click="deleteEdgeInstance(index)"></el-button> -->
            </div>

            <div v-if="tableData[handleTableIndex].edgeInstances.length > 0">
              <el-row :gutter="20" style="margin-bottom: 20px;">
                <el-col :span="150">
                  <el-select v-model="valueMeta" value-key="fromId" collapse-tags placeholder="请选择实例">
                    <div class="el-input" style="width:90%;margin-left:5%;">
                      <input type="text" placeholder="请输入" class="el-input__inner" v-model="dropDownValue" @keyup="dropDownSearch">
                    </div>
                    <el-option v-for="item in optionsMetaShow" :key="item.fromId" :label="item.fromLabel" :value="item"></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <div v-for="(edge, index) in tableData[handleTableIndex].edgeInstances" :key="index" style="margin-top:5px">
                <el-row :gutter="20">
                  
                  <el-col :span="150">
                    <el-form label-width="130px" label-position="left">
                      <el-form-item class="el-form-item--small" :label="edge.fromLabel" style="width: 90%;">
                        <div v-if="tableData[handleTableIndex].mappingSaved">
                          <div v-if="edge.fromValue === -1">
                            <el-tag style="margin-right: 10px" size="small"> 当前实例</el-tag>
                          </div>
                          <div v-else-if="edge.fromValue !== null">
                            <el-tag style="margin-right: 10px" size="small"> {{ edge.fromValue }}
                            </el-tag>
                          </div>
                        </div>
                        <div v-else>
                          <div v-if="edge.fromValue === -1">
                            <el-tag style="margin-right: 10px" size="small"> 当前实例</el-tag>
                          </div>
                          <div v-else-if="edge.fromValue === null">
                            <el-button @click="addEdge(index, 'fromValue')" icon="el-icon-plus" size="mini" plain>选择字段
                            </el-button>
                          </div>
                          <div v-else>
                            <el-tag style="margin-right: 10px" closable size="small" type="info"
                              @close="deletePropMapping(index, 'fromValue', 0)"> {{ edge.fromValue }}
                            </el-tag>
                          </div>
                        </div>
                      </el-form-item>
                    </el-form>
                  </el-col>
                  
                </el-row>

              </div>
            </div>
            <div v-else style="color: #909399; font-size: 12px; margin-left: 45%">
              暂无关系
            </div>
          </el-card>
        </el-main>
      </el-container>
      <!--    新增关系实例对话框    -->
      <el-dialog title="请选择新增的关系边" :visible.sync="dialogAddingEdgeVisible" append-to-body style="width: auto ">

        <el-card shadow="never" style="margin: 2%">

          <div slot="header" style="font-size: 15px; font-weight: bold">
            <i class="el-icon-document-copy"></i>
            概念：
            <span style="display:inline" v-for="(concept, index) in tableData[handleTableIndex].concepts" :key="index">
              {{ concept }}
            </span>
          </div>
          <!--  本体模型交互图   -->
          <div>
            <network ref="interactGraph" style="height: 200px" :nodes="tableData[handleTableIndex].networkNodes"
              :edges="tableData[handleTableIndex].networkEdges" :options="network.options"
              :manipulation-options="network.options.manipulation" @click="selectEdge">
            </network>
          </div>
        </el-card>
      </el-dialog>


    </div>

    <el-button size="small" type="primary" @click="handleUpload">上传</el-button>
  </div>
</template>

<script>
import Network from "vue2vis/src/components/Network";
// 我们似乎需要上传时附带Cookie....
export default {
  components: {
    Network
  },
  data() {
    return {
      search: '',
      need_refresh: false,
      fileList: [],
      areaOptions: ["1"],
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
      rules: {
        name: [
          { required: true, message: '请输入数据库名称', trigger: 'blur' },
        ],
        area: [
          {required: true, message: '请选择数据领域', trigger: 'blur' },
        ],
        short_description: [
          {required: true, message: '请填写数据简介', trigger: 'blur' },
        ],
        long_description: [
          {required: true, message: '请填写详细介绍', trigger: 'blur' },
        ],
        fileList: [
          {required: true, message: '请上传文件', trigger: 'blur' }
        ],
        // file: [
        //   {required: true, message: '请上传文件', trigger: 'blur' },
        // ]
      },
      // upload_form: {
      //   data_set: '',
      //   data_info: '',
      //   data_source: '湘钢Q235B',
      // },

      show_head_upload: false,

      /*******  第0步：基本功能所需数据定义  ******/
      active_step: 3,
      //所有概念名
      conceptName: [],

      //所有概念数据
      conceptData: [
        { 'name': '概念1' },
        { 'name': '概念2' },
        { 'name': '概念3' },
      ],

      // 所有概念的主属性
      conceptKeyProp: new Map,

      /*******  第二步：关系表与概念映射 数据定义 ******/
      //新增、查看概念映射对话框
      dialogAddConceptVisible: false,
      dialogLookConceptVisible: false,
      dialogDeleteTableVisible: false,

      // 当前新增所在行
      addRow: 0,
      newConcept: '',
      //我的系统里tableData只能有一行
      tableData: [{
        name: 'name',
        conceptMapped: false,
        fields: ['1', '2'],
        concepts: ['tD概念1', 'tD概念2'],
        conceptInstances: {
          length: 1
        },
        edgeInstances: [{
          edgeId: '1',
          fromId: '1',
          // toId: '1',
          fromValue: 'fromValue1',
          // toValue: 'toValue',
          fromLabel: 'flable1',
          // toLabel: 'tlable',
        },
        {
          edgeId: '2',
          fromId: '2',
          // toId: '1',
          fromValue: 'fromValue2',
          // toValue: 'toValue',
          fromLabel: 'flable2',
          // toLabel: 'tlable',
        },
        {
          edgeId: '3',
          fromId: '3',
          // toId: '1',
          fromValue: null,
          // toValue: 'toValue',
          fromLabel: 'flable3',
          // toLabel: 'tlable',
        }],
        conceptInstances: {
          conceptId: '1',
          conceptName: 'name',
          mapProps: {
            1: 1,
            2: 2,
          },
        },
        networkNodes: [{
          id: 1,
          label: '1'
        }, {
          id: 2,
          label: '2'
        }],
        networkEdges: [{
          id: 1,
          label: '1',
          fromId: 1,
          toId: 2,
        }]
      }],


      /*******  第三步：关系表字段与谓词映射 数据定义 ******/
      // 卡片显示状态变量
      // instanceEditing: false,
      // edgeEditing: false,

      // 当前正在处理的表的index（由于default-active接收String，因此再设定一个handleTableIndex的String类型的变量）
      handleTableIndex: 0,

      // 交互图点集和边集
      nodes: [],
      edges: [],

      // 交互图配置项 vis-network configuration：
      network: {
        data: {},
        options: {
          nodes: {
            physics: true,
            borderWidth: 0,
            shape: 'dot',
            size: 80,
            font: {
              face: 'PingFang SC',
              size: 50
            },
            shadow: {
              enabled: false,
              color: 'rgba(0,0,0,0.5)',
              size: 16,
              x: 6,
              y: 6
            }
          },
          edges: {
            physics: true,
            arrows: {
              to: {
                enabled: true,
                type: "arrow"
              }
            },
            color: {
              color: '#bcbcbc',
              highlight: '#bcbcbc',
              hover: '#bcbcbc',
              inherit: false,
              opacity: 1
            },
            font: {
              size: 50,
              face: "tahoma",
              strokeWidth: 1
            },
            smooth: {
              enabled: true,
              type: 'dynamic',
              forceDirection: "none",
              roundness: 0.5
            },
          },
          interaction: {
            hover: true,
            tooltipDelay: 150,
            hideEdgesOnDrag: false,
            hideEdgesOnZoom: false,
            multiselect: false,
            dragNodes: true,
          },
          physics: {
            enabled: true,
            barnesHut: {
              gravitationalConstant: -50000,
              centralGravity: 0.1,
              springLength: 400,
              springConstant: 0.03,
              damping: 0.09,
              avoidOverlap: 0
            }
          },
          configure: {
            enabled: false
          },
          manipulation: {
            enabled: false
          }
        }
      },

      // 定义当前正在做的属性映射，结构为 handlePropInfo = 'concept_index'+'_'+'prop'，用来存储当前点击的"概念下标_属性名"
      // 每次完成一次映射时更新、handleTableIndex改变时更新
      handlePropInfo: '',
      handleEdgeInfo: '',

      // 添加关系边对话框是否显示
      dialogAddingEdgeVisible: false,

      // 是否正在读取数据
      getTableContentFinish: false,
      tableContentSize: [],
      tableContentNameList: [],

      // 导入进程提示
      tip: '',
      Loading: false,
      ontMappingImportProgressTimer: '',

      generateFinish: false,
      generateFailed: false,

      // 导入数量结果
      instanceNum: 0,
      edgeNum: 0,

      //搜索框
      dropDownValue: '',
      optionsMetaShow: [],
      valueMeta: []
    }
  },
  created() {
    this.get_head_list();
    this.get_area();
  },

  mounted() {
  },
  methods: {
    get_head_list(){
      var that = this;
      this.$http_wang({
          url: "/head/",
          method: "get",
          params: {
            "area": that.datasetInfo.area,
          }
        }).then((res) => {
          let data = res.data
          console.log("表头")
          console.log(res.data)
          that.tableData[0].edgeInstances = []
          for(let item in res.data.results){
            that.tableData[0].edgeInstances.push({
              edgeId: res.data.results[item].id,
              fromId: res.data.results[item].id,
              // toId: '1',
              fromValue: null,
              // toValue: 'toValue',
              fromLabel: res.data.results[item].name,
              fromName: res.data.results[item].description,
            })
          }
          // this.count = data.count
          // this.resultList = data.results
        })
    },

    get_area(){
      var that = this;
      this.$http_wang({
          url: "/head/get_area/",
          method: "get",
          params: {
          }
        }).then((res) => {
          let data = res.data
          console.log("area")
          console.log(res.data)
          that.areaOptions = res.data.areas
          // this.count = data.count
          // this.resultList = data.results
        })
    },

    dropDownSearch () {
      // this.get_head_list();
      var that = this;
      that.valueMeta = [];
      that.optionsMetaShow = that.tableData[0].edgeInstances.filter(that.filterSearch);
    },

    filterSearch (item) {
      if(this.dropDownValue == "") return false;
      return item.fromLabel.includes(this.dropDownValue);
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
      params.append('name', 'default_' + this.datasetInfo.name)
      params.append('task', 'default_' + this.datasetInfo.name)
      params.append('area', this.datasetInfo.area)
      params.append('short_description', this.datasetInfo.short_description)
      params.append('long_description', this.datasetInfo.long_description)
      params.append('store_name', this.datasetInfo.store_name)
      params.append('process_code', "")
      params.append('father_name', "")
      var time_series = -1;
      if(that.datasetInfo.time_series != ""){
        time_series = that.datasetInfo.time_series
      }
      params.append('time_series', time_series)
      var id_col = -1;
      if(that.datasetInfo.id_col != ""){
        id_col = that.datasetInfo.id_col
      }
      params.append('id_col', id_col)

      this.$http_wang({
        url:"/predata/",
        method: "post",
        data: params
      }).then((res)=>{
        console.log("ok!",res)
        if(res.status == 200){
          console.log("upload done")
          console.log(res)
          that.upload_data_df = res
          // that.show_table_upload = true
          // that.$router.go(0); //刷新
          that.$notify({
            title: '上传成功',
            duration: 5000
          });
          that.$router.go(0)
        } else{
          that.$notify({
            title: '创建失败',
            message:  res.response,
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
      console.log(res)
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


    //"上一步"按钮界面切换和变量更新
    lastStep() {
      switch (this.active_step) {
        case 1:
          this.active_step--;
          break;
        case 2:
          this.active_step--;
          break;
        case 3:
          this.active_step--;
          break;
      }
    },

    /*******  第二步：关系表与概念映射 方法定义 ******/
    //增加新的概念映射
    addConcept() {
      //对已选择的概念进行限制
      if (this.tableData[this.addRow].concepts.indexOf(this.newConcept) !== -1) {
        this.$message.error('错了哦，这个概念已经映射过啦');
      } else {
        // Vue不能检测利用数组索引直接修改一个数组项，必须用$set方法来进行修改
        let tmp = this.tableData[this.addRow]
        tmp.concepts.push(this.newConcept)
        tmp.conceptMapped = true
        this.$set(this.tableData, this.addRow, tmp)
        //关闭dialog
        this.dialogAddConceptVisible = false;
      }
    },

    // 删除概念映射标签
    deleteConcept(index, row) {
      row.concepts.splice(index, 1)
      if (row.concepts.length === 0)
        row.conceptMapped = false
    },

    //删除整行表格
    deleteTable(index) {
      this.$confirm('是否删除该关系表?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        //删除该行表格
        this.tableData.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    //判断是否所有表都已映射
    checkTableMappingStatus() {
      for (let item in this.tableData)
        if (this.tableData[item].conceptMapped === false)
          return false
      return true
    },

    // 进入下一步
    submitTableMapping() {
      if (!this.checkTableMappingStatus()) {
        this.$message.error('请完成所有表格映射！')
      } else {
        this.constructNetworkData()
        this.active_step++
      }
    },

    /*******  第三步：关系表字段与谓词映射 方法定义 ******/

    // 对实例卡片的el-table进行分列操作，mapProps为待分割的map，col为当前列数[1,3]
    tableSlice(mapProps, col) {
      // 把size平均分为3份，如果col==1，则将%多的部分分到前两列
      let n = Math.floor(mapProps.size / 3)
      let a = mapProps.size % 3
      let num = [n, n, n]
      if (a > 0) num[0] += 1
      if (a === 2) num[1] += 1
      // 将mapProps转为数组
      let list = [...mapProps]
      if (col === 1) return new Map(list.slice(0, num[0]))
      if (col === 2) return new Map(list.slice(num[0], num[0] + num[1]))
      if (col === 3) return new Map(list.slice(num[0] + num[1]))
    },

    // 根据映射到的概念，为每张表添加新实例
    addInstances() {
      // 获取当前表
      let table = this.tableData[this.handleTableIndex]
      // 每张表多实例的写法：
      if (table.conceptInstances.length !== 0) {
        this.$message.error('实例已存在了哦！')
      } else {
        // 初始化实例（这里设置成循环，就是将每种概念都各生成一个实例）
        for (let j in table.concepts) {
          // 根据concept名字，找到其在conceptData中的下标，从而获取concept信息
          let concept = this.conceptData[this.conceptName.findIndex(i => i === table.concepts[j])]
          let ins = {
            conceptId: concept.id,
            conceptName: concept.name,
            mapProps: new Map,
          }
          // 将属性映射map初始化为null
          for (let k in concept.props) ins.mapProps.set(concept.props[k].toString(), null)
          // 将ins存入conceptInstances这个Map中
          table.conceptInstances.push(ins)

          this.$message({
            type: 'success',
            message: '添加成功!'
          });
        }
      }
    },

    // 删除所选概念实例
    deleteConceptInstance(instance_index) {
      this.$confirm('是否删除所选实例?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        // 需要先把已有的映射标签归位
        let table = this.tableData[this.handleTableIndex]
        let mapProps = table.conceptInstances[instance_index].mapProps

        for (let value of mapProps.values())
          if (value !== null) table.fields.push(value)
        // 删除实例
        table.conceptInstances.splice(instance_index, 1)
        this.$message({
          type: 'success',
          message: '清空成功!'
        });
      }).catch(() => {
        this.$message.error('清空失败')
      });
    },

    // 新增关系实例
    addEdgeInstance() {
      // 弹出交互图对话框
      this.dialogAddingEdgeVisible = true
    },

    // 构造每张表的交互图节点集和边集
    constructNetworkData() {
      for (let i in this.tableData) {
        let nodeSet = new Set()
        let edgeSet = new Set()

        // 先清空之前的数据
        this.tableData[i].networkNodes = []
        this.tableData[i].networkEdges = []

        // 把映射到的概念的nodes和edges加进集合
        for (let c in this.tableData[i].concepts) {
          let concept_name = this.tableData[i].concepts[c]
          let concept_id = this.conceptName.findIndex((i => i === concept_name))
          for (let n in this.conceptData[concept_id].nodes) {
            let node = this.conceptData[concept_id].nodes[n]
            if (!nodeSet.has(node.id)) {
              this.tableData[i].networkNodes.push(node)
              nodeSet.add(node.id)
            }
          }
          for (let e in this.conceptData[concept_id].edges) {
            let edge = this.conceptData[concept_id].edges[e]
            if (!edgeSet.has(edge.id)) {
              this.tableData[i].networkEdges.push(edge)
              edgeSet.add(edge.id)
            }
          }
        }
      }
    },

    // 交互图选择边
    selectEdge(params) {
      // 判断点击的是否是边
      if (params.nodes.length === 0 && params.edges.length === 1) {
        let edge_id = params.edges[0]
        // 找到对应的edge的label（虽然可能有多个概念，但由于跨表连接的情况中两个概念都出现在了图中，因此遍历谁的边集都一样，这里选择concepts[0].edges进行遍历）
        let concept_name = this.tableData[this.handleTableIndex].concepts[0]
        let concept = this.conceptData[this.conceptName.findIndex(i => i === concept_name)]
        // 设置edge为目标边，包含id、label、to、from
        let edge
        for (let e in concept.edges)
          if (concept.edges[e].id === edge_id)
            edge = concept.edges[e]

        // 让用户确认是否选择添加这条边
        this.$confirm('是否添加"' + edge.label + '"边的实例？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // 去concept的nodes列表里寻找头/尾节点的label
          let from_label
          let to_label
          for (let i in concept.nodes) {
            if (concept.nodes[i].id === edge.from) from_label = concept.nodes[i].label
            if (concept.nodes[i].id === edge.to) to_label = concept.nodes[i].label
          }
          // 新建一个关系实例
          let edgeInstance = {
            edgeId: edge_id,
            edgeLabel: edge.label,
            fromId: edge.from,
            toId: edge.to,
            fromLabel: from_label,
            toLabel: to_label,
            fromValue: null, // 头节点映射值
            toValue: null  // 尾节点映射值
          }
          // 将头/尾节点为本实例的Value映射值设置为-1（注意此魔法值！但应该不会有表关键字段叫-1的，所以应该是合理的嘎嘎）
          if (concept_name === from_label) edgeInstance.fromValue = -1
          else edgeInstance.toValue = -1
          // 将关系实例加入关系实例列表中
          this.tableData[this.handleTableIndex].edgeInstances.push(edgeInstance)

          // 对话框隐藏
          this.dialogAddingEdgeVisible = false
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
        }).catch(() => {
          this.$message.error('添加失败')
          // 对话框隐藏
          this.dialogAddingEdgeVisible = false
        });
      }
    },

    // 删除所选关系实例
    deleteEdgeInstance(instance_index) {
      this.$confirm('是否删除所选实例?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let table = this.tableData[this.handleTableIndex]
        let edge_instance = table.edgeInstances[instance_index]
        // 把头尾映射值归位
        let from_value = edge_instance.fromValue
        let to_value = edge_instance.toValue
        if (from_value !== -1 && from_value !== null) table.fields.push(from_value)
        if (to_value !== -1 && to_value !== null) table.fields.push(to_value)
        // 删除实例
        table.edgeInstances.splice(instance_index, 1)
        this.$message({
          type: 'success',
          message: '清空成功!'
        });
      }).catch(() => {
        this.$message.error('清空失败')
      });
    },

    // 菜单栏数据表menu，参数为当前选中菜单项的index
    tableMenuSelect(key, keyPath) {
      // keyPath参数必须使用，数组类型，第一项为menu选择的index
      this.handleTableIndex = keyPath[0]
      //清空handlePropInfo
      this.handlePropInfo = ''
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

    // 保存本表映射
    saveMappingResult() {
      // 至少完成属性映射或关系映射中的一个
      if (this.tableData[this.handleTableIndex].conceptInstances.length === 0
        && this.tableData[this.handleTableIndex].edgeInstances.length === 0) {
        this.$message.error("请完成实例映射/关系映射！")
        return
      }

      if (this.tableData[this.handleTableIndex].conceptInstances.length !== 0) {
        // 检查所有实例的主属性是否都映射到了
        let keyMapped = true
        for (let i in this.tableData[this.handleTableIndex].conceptInstances) {
          let instance = this.tableData[this.handleTableIndex].conceptInstances[i]
          let keyProp = this.conceptKeyProp.get(instance.conceptId)
          if (instance.mapProps.get(keyProp) === null)
            keyMapped = false
          break
        }
        if (!keyMapped) {
          this.$message.error("请保证实例的主属性映射不为空！")
          return
        }

        // 检查所有实例是否都至少映射到了一个字段
        let oneMapped = false
        for (let i in this.tableData[this.handleTableIndex].conceptInstances) {
          let instance = this.tableData[this.handleTableIndex].conceptInstances[i]
          for (let item of instance.mapProps.values()) {
            if (item !== null)
              oneMapped = true
            break
          }
        }
        if (!oneMapped) {
          this.$message.error("请保证实例的属性映射不全为空！")
          return
        }
      }

      if (this.tableData[this.handleTableIndex].edgeInstances.length !== 0) {
        // 检查所有边的头尾节点是否都不为null
        let edgeMapped = true
        for (let i in this.tableData[this.handleTableIndex].edgeInstances) {
          let edge = this.tableData[this.handleTableIndex].edgeInstances[i]
          if (edge.fromValue === null || edge.toValue === null)
            edgeMapped = false
          break
        }
        if (!edgeMapped) {
          this.$message.error("请保证边映射头尾节点均不为空！")
          return
        }
      }

      this.tableData[this.handleTableIndex].mappingSaved = true
    },

    // 修改本表映射
    changeMappingResult() {
      this.tableData[this.handleTableIndex].mappingSaved = false
    },

    /*******  第四步：提交映射，进入实例生成阶段 ******/
    allMappingSaved() {
      for (let i in this.tableData)
        if (!this.tableData[i].mappingSaved) return false
      return true
    },

    // 提交数据并生成实例
    generateInstances() {
      // 判断是否已保存映射
      if (!this.allMappingSaved()) {
        this.$message.error("请先保存每张表的映射！")
      } else {
        // 先写生成实例的数据吧！！
        // 以实例列表的形式生成，表项为实例对象，包括：{tableName, conceptId, conceptName, mapProps}
        let result = []
        for (let i in this.tableData) {
          let table = this.tableData[i]
          let instance = table.conceptInstances[0]
          // map需要先转为json再传，否则后台接收为空
          let map_json = Object.create(null);
          for (let [k, v] of instance.mapProps) map_json[k] = v

          let result_item = {
            tableName: table.name,
            conceptId: instance.conceptId,
            conceptName: instance.conceptName,
            mapProps: map_json,
            edgeInstances: []
          }

          for (let j in table.edgeInstances) {
            let edge = table.edgeInstances[j]
            let ins = {
              edgeId: edge.edgeId,
              fromId: edge.fromId,
              toId: edge.toId,
              fromValue: edge.fromValue,
              toValue: edge.toValue
            }
            result_item.edgeInstances.push(ins)
          }
          // 将 result_item 加入 result 列表
          result.push(result_item)
        }
        console.log(result)
        _.postData('/i3city-evo/v1/newOntMapping/postMappingResult', result, res => {
          if (res.data) {
            this.active_step++;
            // 先读表，再生成实例
            this.Loading = true
            this.tip = "读取表文件中..."
            _.get('/i3city-evo/v1/newOntMapping/getTableContent', {}, res => {
              // 展示读表结果
              this.getTableContentFinish = true
              this.Loading = false
              for (let i in res.data) {
                let name = res.data[i].split("+")[0]
                let size = res.data[i].split("+")[1]
                this.tableContentNameList.push(name)
                this.tableContentSize.push(size)
              }
              // 生成实例
              this.Loading = true
              _.get('/i3city-evo/v1/newOntMapping/generateInstances', {}, res => {
                this.instanceNum = res.data[0];
                this.edgeNum = res.data[1];
                this.generateFinish = true;
              }, () => {
                this.$message.error('实例生成失败')
                this.generateFailed = true
              })

              // 定时查询导入进程，通过element-loading-text显示出来
              // this.ontMappingImportProgressTimer = setInterval(function(){
              //   _.get('/i3city-evo/v1/newOntMapping/checkGenerateProgress', {}, res => {
              //     if(res.data.length === 1) this.tip = res.data // [tip]
              //     else { // 导入完成
              //       clearInterval(this.ontMappingImportProgressTimer)
              //       this.Loading = false
              //     }
              //   })
              // }, 3000)
            })
          }
        })
      }
    },

    finishAndReturn() {
      // 清空导入结果记录变量
      this.getTableContentFinish = false
      this.tableContentSize = []
      this.tableContentNameList = []
      this.generateFinish = false
      this.generateFailed = false
      this.instanceNum = 0
      this.edgeNum = 0
      // 清空所有数据变量
      this.tableData = []
      this.conceptData = []
      this.conceptName = []
      this.addRow = 0
      this.handleTableIndex = 0

      // 回到第一页
      this.active_step = 0
    }
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