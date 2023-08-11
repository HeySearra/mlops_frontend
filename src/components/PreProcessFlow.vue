<template>
  <div>
    <div class="preprocess-canvas">
      <div class="side-menu">
        <div class="node-container">
          <span class="node-item" v-for="(item, i) in nodeItemList" :key="i"
            @mousedown="evt => nodeItemMouseDown(evt, item.value)">
            {{ item.label }}
          </span>
        </div>
      </div>
      <div class="flow-container" ref="flowContainer">
        <super-flow ref="superFlow" :graph-menu="graphMenu" :node-menu="nodeMenu" :link-menu="linkMenu"
          :node-list="nodeList" :link-base-style="linkBaseStyle" :enter-intercept="enterIntercept"
          :output-intercept="outputIntercept">
          <template v-slot:node="{ meta }">
            <div @mouseup="nodeMouseUp" @dblclick="dialogConf.open(meta)" :class="`flow-node flow-node-${meta.name}`">
              <div :class="`node-header node-header-${meta.name}  ellipsis`">
                {{ meta.title }}
              </div>
              <div class="node-main-params">
                <div class="node-main-param-item ellipsis" v-for="(val, key, i) in meta.params" :key="i">
                  <span class="attr-label">{{ key }}:</span><span class="attr-value">{{ val.value }}</span>
                </div>
              </div>
            </div>
          </template>
        </super-flow>
      </div>
    </div>
    <!--    visible改变时自动重刷dialog内容，好耶！ -->
    <el-dialog :title="dialogConf.title" :visible.sync="dialogConf.visible" :close-on-click-modal="false" destroy-on-close
      width="500px">
      <el-form @keyup.native.enter="settingSubmit" @submit.native.prevent ref="paramSetting" :model="curDialogParams"
        label-width="110px">
        <el-form-item v-for="(val, key, idx) in this.curDialogParams" :label="key" :prop="key" :key="idx"
          >
          <el-input v-if="val.type === `Number`" v-model.number="curDialogParams[key].value"
            :placeholder="curDialogParams[key].value === `` ? val.tips : curDialogParams[key].value" maxlength="10"
            size="small" />
          <el-input v-if="val.type === `Double`" v-model="curDialogParams[key].value"
            onkeyup="value=value.replace(/[^0-9.]/g, '')"
            :placeholder="curDialogParams[key].value === `` ? val.tips : curDialogParams[key].value" maxlength="10"
            size="small" />
          <!--   TODO:float validator       -->
          <el-input v-if="val.type === `Float`" v-model="curDialogParams[key].value"
            :placeholder="curDialogParams[key].value === `` ? val.tips : curDialogParams[key].value" maxlength="10"
            size="small" />
          <el-input v-if="val.type === `String` && val.unique === true" v-model="curDialogParams[key].value"
            :placeholder="curDialogParams[key].value === `` ? val.tips : curDialogParams[key].value" maxlength="20"
            size="small" />
          <el-input type="textarea" v-if="val.type === `String` && val.unique === false"
            v-model="curDialogParams[key].value" :autosize="{ minRows: 2, maxRows: 4 }"
            :placeholder="curDialogParams[key].value === `` ? val.tips : curDialogParams[key].value" />
          <el-select multiple collapse-tags v-if="val.type === `ChooseCol`" v-model="curDialogParams[key].value"
            :placeholder="val.tips" size="small" style="width:100%" >
            <el-option v-for="(col, idx) in all_cols" :key="idx" :label="col" :value="col" />
          </el-select>
          <el-select collapse-tags v-if="val.type === `SingleChoose`" v-model="curDialogParams[key].value"
          :placeholder="val.tips" size="small" style="width:100%" >
          <el-option v-for="(col, idx) in all_cols" :key="idx" :label="col" :value="col" />
        </el-select>
          <el-select v-if="val.type === `Enum` && val.unique" v-model="curDialogParams[key].value"
          :placeholder="val.tips" size="small" style="width:100%" >
            <el-option v-for="(val, idx) in curDialogParams[key].options" :key="idx" :label="val" :value="val" />
          </el-select>
          <div v-if="val.type === `Bool`">
            <el-radio v-model="curDialogParams[key].value" :label="true">备选项</el-radio>
            <el-radio v-model="curDialogParams[key].value" :label="false">备选项</el-radio>
          </div>
        </el-form-item>
      </el-form>
      <!-- <el-form-item label="描述" class="super-flow-form-item">
        <el-input v-model="nodeDescription" maxlength="20" size="small" />
      </el-form-item> -->
      <!-- 
      <el-descriptions title="描述" style="border: 0px;!important">
        <el-descriptions-item label="">{{ nodeDescription }}</el-descriptions-item>
      </el-descriptions> -->
      <span style="margin-left: 20px">描述：{{ nodeDescription == "" ? "无" : nodeDescription }}</span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogConf.cancel">取 消</el-button>
        <el-button type="primary" @click="settingSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SuperFlow from 'vue-super-flow'
import 'vue-super-flow/lib/index.css'
import nodeOptions from "../preprocess"
// TODO: 自动定位
// TODO：设置线段规则分布 vue super flow 自带接口
// TODO：设置上传规则

export default {
  components: {
    SuperFlow
  },
  data() {
    return {
      curDialogParams: {},
      metaInfo: {},
      nodeDescription: "",
      dialogConf: {
        title: '修改参数',
        visible: false,
        open: (meta) => {
          console.log(meta)
          const conf = this.dialogConf
          this.metaInfo = meta // meta是object，采用引用传递，故this.metaInfo就是node的真实meta
          this.curDialogParams = meta.params
          this.nodeDescription = meta.description
          conf.visible = true
        },
        close: () => {
          this.dialogConf.visible = false
          this.$refs.paramSetting.clearValidate()
        },
        cancel: () => {
          this.dialogConf.visible = false
          this.$refs.paramSetting.clearValidate()
        }
      },
      dragConf: {
        isDown: false,
        isMove: false,
        offsetTop: 0,
        offsetLeft: 0,
        clientX: 0,
        clientY: 0,
        ele: null,
        info: null
      },
      nodeItemList: nodeOptions,
      nodeList: [
        {
          id: 'nodeStart',
          width: 100,
          height: 80,
          coordinate: [20, 20],
          label: 'BEGIN',
          meta: {
            title: "BEGIN",
            name: 'BEGIN',
            params: {}
          },
        }
      ],
      graphMenu: [
        [
          { label: '清空', selected: graph => { graph.selectAll() } }
        ]
      ],
      nodeMenu: [
        [
          { label: '删除', selected: node => { node.remove() } }
        ]
      ],
      linkMenu: [
        [
          { label: '删除', selected: link => { link.remove() } }
        ]
      ],

      linkBaseStyle: {
        color: '#666666',           // line 颜色
        hover: '#FF0000',           // line hover 的颜色
        textColor: '#666666',       // line 描述文字颜色
        textHover: '#FF0000',       // line 描述文字 hover 颜色
        font: '14px Arial',         // line 描述文字 字体设置 参考 canvas font
        dotted: false,              // 是否是虚线
        lineDash: [4, 4],           // 虚线时生效
        background: 'rgba(255,255,255,0.6)'    // 描述文字背景色
      },
      fontList: [
        '14px Arial',
        'italic small-caps bold 12px arial'
      ]
    }
  },
  props: {
    dataset_id: {
      type: Number,
      required: false,
    },
    all_cols: {
      type: Array,
      required: false
    },
    dataset_name: {
      type: String,
      required: true
    }
  },
  mounted() {
    document.addEventListener('mousemove', this.docMousemove)
    document.addEventListener('mouseup', this.docMouseup)
    this.$once('hook:beforeDestroy', () => {
      document.removeEventListener('mousemove', this.docMousemove)
      document.removeEventListener('mouseup', this.docMouseup)
    })
  },
  methods: {
    enterIntercept(formNode, toNode, graph) {
      // console.log(formNode, toNode, graph)
      return true
    },
    outputIntercept(node, graph) {
      // console.log(node, graph)
      return true
    },
    //TODO： 暂时是按照nodelist里的顺序来排列的，这显然不一定是真正的顺序！
    graphValidate() {
      let graph = this.$refs.superFlow.toJSON();

      return true
    },
    submitPreprocess(newInfo) {
      if(!this.login_manager.get()){
        that.$notify.warning({
            title: '未登录，请先登录账号',
            duration: 5000
          });
        return
      }
      // 可能出现begin不在第一个的情形。
      if (!this.graphValidate()) {
        that.$notify.error({
          title: 'begin应为头节点',
        });
        return
      }
      let that = this
      let graph = this.$refs.superFlow.toJSON();
      console.log(graph)
      let methods = []
      for (let i = 1; i < graph.nodeList.length; i++) {
        let method_dict = { "params": {} }
        const name = graph.nodeList[i].meta.name;
        const param = graph.nodeList[i].meta.params;
        method_dict["name"] = name
        method_dict["description"] = graph.nodeList[i].meta.description
        for (let key in graph.nodeList[i].meta.params) {
          if(param[key].value != ''){
            method_dict["params"][key] = param[key].value
          }
        }
        methods.push(method_dict)
      }
      if (methods.length == 0) {
        that.$notify.error({
          title: '未添加预处理方法',
        });
        return
      }
      let id = this.dataset_id
      this.$http_wang({
        url: "/predata/" + id + "/process/",
        method: "post",
        data: {
          name: newInfo.name + newInfo.type,
          short_description: newInfo.short_description,
          long_description: newInfo.long_description,
          methods: JSON.stringify(methods)
        }
      }).then((res) => {
        console.log("ok!", res)
        if (res.status == 200) {
          that.$notify({
            title: '创建成功',
            duration: 5000
          });
          that.$router.go(0)
        } else {
          that.$notify.error({
            title: '服务器失败 :/predata/' + id + '/process/ post',
            message: res.response,
            duration: 5000
          });
        }
      })
    },
    settingSubmit() { // node的meta是没有getter和setter的，所以需要手动$set
      // console.log("?")
      // Object.keys(this.curDialogParams).forEach(key => {
      //   this.$set(this.metaInfo.params, key, this.curDialogParams[key])
      // })
      // this.$set(this.metaInfo,"description",this.nodeDescription)
      // this.$refs.paramSetting.resetFields()
      this.dialogConf.visible = false
    },
    nodeMouseUp(evt) {
      //TODO： 在这里调整方块位置
      evt.preventDefault()
    },
    docMousemove({ clientX, clientY }) {
      const conf = this.dragConf
      if (conf.isMove) {
        conf.ele.style.top = clientY - conf.offsetTop + 'px'
        conf.ele.style.left = clientX - conf.offsetLeft + 'px'
      } else if (conf.isDown) {
        // 鼠标移动量大于 5 时 移动状态生效
        conf.isMove =
          Math.abs(clientX - conf.clientX) > 5
          || Math.abs(clientY - conf.clientY) > 5
      }
    },
    docMouseup({ clientX, clientY }) {
      const conf = this.dragConf
      conf.isDown = false
      if (conf.isMove) {
        const {
          top,
          right,
          bottom,
          left
        } = this.$refs.flowContainer.getBoundingClientRect()
        // 判断鼠标是否进入 flow container
        if (
          clientX > left
          && clientX < right
          && clientY > top
          && clientY < bottom
        ) {
          // 获取拖动元素左上角相对 super flow 区域原点坐标
          const coordinate = this.$refs.superFlow.getMouseCoordinate(
            clientX - conf.offsetLeft,
            clientY - conf.offsetTop
          )
          // 添加节点
          this.$refs.superFlow.addNode({
            coordinate,
            ...conf.info
          })
        }
        conf.isMove = false
      }
      if (conf.ele) {
        conf.ele.remove()
        conf.ele = null
      }
    },
    //操控拖拽的回调函数！
    nodeItemMouseDown(evt, infoFun) {
      const {
        clientX,
        clientY,
        currentTarget
      } = evt

      const {
        top,
        left
      } = evt.currentTarget.getBoundingClientRect()

      const conf = this.dragConf
      const ele = currentTarget.cloneNode(true)

      Object.assign(this.dragConf, {
        offsetLeft: clientX - left,
        offsetTop: clientY - top,
        clientX: clientX,
        clientY: clientY,
        info: infoFun(),
        ele,
        isDown: true
      })

      ele.style.position = 'fixed'
      ele.style.margin = '0'
      ele.style.top = clientY - conf.offsetTop + 'px'
      ele.style.left = clientX - conf.offsetLeft + 'px'

      this.$el.appendChild(this.dragConf.ele)
    }
  }
}
</script>

<style lang="less" scoped>
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
}

.link-base-style-form {
  .el-form-item {
    margin-bottom: 12px;
  }

  padding-bottom : 20px;
  border-bottom : 1px solid #DCDCDC;
}

.preprocess-canvas {
  width: 100%;
  height: 500px;
  background-color: #f5f5f5;
  @list-width : 200px;
  @node-header-height: 30px;
  @node-width : 150px;
  @node-height : 120px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  //TODO: 节点列表可能溢出。修改UI。
  .side-menu {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: @list-width;
    height: 100%;
    float: left;
  }

  .node-container {
    width: @list-width;
    height: 100%;
    text-align: center;
    overflow-wrap: normal;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .flow-container {
    width: calc(100% - @list-width);
    float: left;
    height: 100%;
    overflow: hidden;
  }

  .node-main-param-item {
    max-width: 100%;
  }

  .flow-node {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }

  .node-header {
    font-size: 14px;
    height: 30px !important;
    line-height: 30px;
    color: #ffffff;
    width: 100%;
    text-align: center;
    font-weight: bold;
  }

  .node-header-dropna {
    background: black;
  }

  .node-header-remove_duplicates {
    background: brown;
  }

  .node-header-time_normalization {
    background: #9a6e3a;
  }

  .node-header-onehot_encode {
    background: #008fff;
  }

  .node-header-normalize {
    background: #55a532;
  }

  .node-header-imputation {
    background: #795da3;
  }

  .node-header-variance_select {
    background: #990055;
  }

  .node-header-test_select {
    background: red;
  }

  .node-header-dimension_reduction {
    background: cadetblue;
  }

  .node-header-get_subtable {
    background: darkblue;
  }

  .node-header-2d_to_3d {
    background: chocolate;
  }

  .node-header-to_type {
    background: chocolate;
  }

  .node-header-str_null {
    background: chocolate;
  }

  .node-header-handle_outliers {
    background: cadetblue;
  }

  .node-header-merge {
    background: tomato;
  }

  .node-header-BEGIN {
    background: #0077aa;
  }

  .node-main-params {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    text-align: center;
    overflow-y: hidden;
    word-break: break-all;
    height: calc(@node-height - @node-header-height);
    padding: 0 5px 0 5px;

    .attr-label {
      font-size: 10px;
      color: #a3a3a3;
      margin-right: 2px !important;
      margin-left: 0px !important;
      font-family: "Times New Roman", math, sans-serif;
      font-style: italic;
    }

    .attr-value {
      font-size: 10px;
      color: #737373;
      font-family: "Times New Roman", math, sans-serif;
      font-style: italic;
    }
  }
}

.node-item {
  @node-item-height : 30px;

  font-size: 12px;
  display: inline-block;
  height: @node-item-height;
  width: 120px;
  margin-top: 10px;
  background-color: #FFFFFF;
  line-height: @node-item-height;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  user-select: none;
  text-align: center;
  z-index: 6;
  border-radius: 5px;

  &:hover {
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.4);
  }
}

// TODO: 展示表头</style>