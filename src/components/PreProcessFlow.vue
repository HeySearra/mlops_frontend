<template>
  <div>
    <div class="preprocess-canvas">
      <div class="side-menu">
        <div class="node-container">
          <span
              class="node-item"
              v-for="(item,i) in nodeItemList"
              :key="i"
              @mousedown="evt => nodeItemMouseDown(evt, item.value)">
            {{ item.label }}
          </span>
        </div>
      </div>
      <div
          class="flow-container"
          ref="flowContainer">
        <super-flow
            ref="superFlow"
            :graph-menu="graphMenu"
            :node-menu="nodeMenu"
            :link-menu="linkMenu"
            :link-base-style="linkBaseStyle"
            :link-style="linkStyle"
            :link-desc="linkDesc">
          <template v-slot:node="{meta}">
            <div
                @mouseup="nodeMouseUp"
                @dblclick="drawerConf.open(meta.name)"
                :class="`flow-node flow-node-${meta.name}`">
                <div :class="`node-header node-header-${meta.name}  ellipsis`">
                  {{ meta.name }}
                </div>
                <div class="node-main-params">
                  <div class="node-main-param-item" v-for="(val,key,i) in meta.params" :key="i">
                    <span class="attr-label">{{key}}:</span><span class="attr-value">{{val != null? val : "空"}}</span>
                  </div>
                </div>
            </div>
          </template>
        </super-flow>
      </div>
    </div>

    <el-dialog
        :title="drawerConf.title"
        :visible.sync="drawerConf.visible"
        :close-on-click-modal="false"
        width="500px">
      <el-form
          @keyup.native.enter="settingSubmit"
          @submit.native.prevent
          ref="nodeSetting"
          :model="nodeSetting">
          <!-- TODO:!!! -->
        <el-form-item
            label="节点名称"
            prop="name">
          <el-input
              v-model="nodeSetting.name"
              placeholder="请输入节点名称"
              maxlength="30">
          </el-input>
        </el-form-item>
        <el-form-item
            label="节点描述"
            prop="desc">
          <el-input
              v-model="nodeSetting.desc"
              placeholder="请输入节点描述"
              maxlength="30">
          </el-input>
        </el-form-item>
      </el-form>
      <span
          slot="footer"
          class="dialog-footer">
        <el-button
            @click="drawerConf.cancel">
          取 消
        </el-button>
        <el-button
            type="primary"
            @click="settingSubmit">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SuperFlow from 'vue-super-flow'
import 'vue-super-flow/lib/index.css'
// TODO: 自动定位
// TODO：设置参数对话框
// TODO：设置线段规则分布
// TODO：设置上传规则

const drawerType = {
  node: 0,
  link: 1
}

export default {
  components:{
    SuperFlow
  },
  data () {
    return {
      drawerType,
      drawerConf: {
        title: '修改参数',
        visible: false,
        open: (name) => {
          //TODO：根据name选择params
          const conf = this.drawerConf

          let params = {}
          for (let nodeItem in this.nodeItemList) {
            if (nodeItem.label === name){
              params = nodeItem.value()
            }
          }

          if (this.$refs.nodeSetting) this.$refs.nodeSetting.resetFields()
          conf.visible = true
        },
        cancel: () => {
          this.drawerConf.visible = false
          this.$refs.nodeSetting.clearValidate()
        }
      },
      nodeSetting: {
        name: '',
        desc: ''
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
      nodeItemList: [
        {
          label: 'dropna',
          value: () => ({
            meta: {
              name: 'dropna',
              params: {
                axis: 0,
                how: 'any',
                thresh: null,
                subset: null
              }
            },

          })
        },
        {
          label: 'remove_duplicates',
          value: () => ({
            meta: {
              name: 'remove_duplicates',
              params:{
                keep: "first",
                subset: null
              }
            },

          })
        },
        {
          label: 'Time_normalization',
          value: () => ({
            meta: {
              name: 'Time_normalization',
              params:{
                subset:null
              }
            }
          })
        },
        {
          label: 'onehot_encode',
          value: () => ({
            meta: {
              name: 'onehot_encode',
              params: {
                prefix: null,
                include_na: false,
                subset: null
              }
            }
          })
        },
        {
          label: 'normalize',
          value: () => ({
            meta: {
              name: 'normalize',
              params:{
                method: null,
                subset: null
              }
            },
          })
        },
        {
          label: 'imputation',
          value: () => ({
            meta: {
              name: 'imputation',
              params:{
                method: null,
                value: null,
                subset: null
              }
            },

          })
        },
        {
          label: 'variance_select',
          value: () => ({
            meta: {
              name: 'variance_select',
              params:{
                threshold: 0,
                subset: null
              }
            }
          })
        },
        {
          label: 'test_select',
          value: () => ({
            meta: {
              name: 'test_select',
              params:{
                score_func: null,
                k: null,
                y_name: null,
                subset:null
              }
            },
          })
        },
        {
          label: 'dimension_reduction',
          value: () => ({
            meta: {
              name: 'dimension_reduction',
              params:{
                method: null,
                n_components: 0,
                subset: null,
              }
            },
          })
        },
        {
          label: 'get_subtable',
          value: () => ({
            meta: {
              name: 'get_subtable',
              params:{
                subset: null
              }
            },
          })
        },
        {
          label: '2d_to_3d',
          value: () => ({
            meta: {
              name: '2d_to_3d',
              params:{
                id_col: null,
                timestap_col: null,
                to_tensor: false
              }
            }
          })
        },
        {
          label: 'merge',
          value: () => ({
            meta: {
              name: 'merge',
              params:{
                how: null,
                on: null
              }
            },
          })
        },
      ],

      graphMenu: [
        [
          {
            label: 'Beautify',
            selected (graph) {
              console.log("try to beautify,", graph)
            }
          }
        ],
        [
          {
            label: '清空',
            selected: graph => {
              graph.selectAll()
            }
          }
        ]
      ],
      nodeMenu: [
        [
          {
            label: '删除',
            selected: node => {
              node.remove()
            }
          },
          {
            label: '编辑',
            selected: node => {
              this.drawerConf.open(drawerType.node, node)
            }
          }
        ]
      ],
      linkMenu: [
        [
          {
            label: '删除',
            selected: link => {
              link.remove()
            }
          },
          {
            label: '编辑',
            selected: link => {
              this.drawerConf.open(drawerType.link, link)
            }
          }
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
  props:{
    dataset_id:{
      type:Number,
      required:false,
    }
  },
  mounted () {
    document.addEventListener('mousemove', this.docMousemove)
    document.addEventListener('mouseup', this.docMouseup)
    this.$once('hook:beforeDestroy', () => {
      document.removeEventListener('mousemove', this.docMousemove)
      document.removeEventListener('mouseup', this.docMouseup)
    })
  },
  methods: {
    //TODO： 暂时是按照nodelist里的顺序来排列的，这显然不一定是真正的顺序！
    submitPreprocess(){
      let graph = this.$refs.superFlow.toJSON();
      let method_dict = {}
      for(let i = 0;i<graph.nodeList.length;i++){
        var name = graph.nodeList[i].meta.name
        var param = graph.nodeList[i].meta.params
        method_dict[name] = {}
        for(let key in graph.nodeList[i].meta.params){
          if(param[key]  != null){
            method_dict[name][key] = param[key]
          }
        }
      }
      let id = this.dataset_id
      this.$http_wang({
        url:"/predata/"+id+"/process/",
        method: "get",
        params: {
          name:"newnew",
          methods: JSON.stringify(method_dict)
        }
      }).then((res)=>{
        console.log("ok",res)
      })
    },
    linkStyle (link) {
      if (link.meta && link.meta.desc === '1') {
        return {
          color: 'red',
          hover: '#FF00FF',
          dotted: true
        }
      } else {
        return {}
      }
    },
    linkDesc (link) {
      return link.meta ? link.meta.desc : ''
    },
    settingSubmit () {
      const conf = this.drawerConf
      if (!conf.info.meta) conf.info.meta = {}
      Object.keys(this.nodeSetting).forEach(key => {
        this.$set(conf.info.meta, key, this.nodeSetting[key])
      })
      this.$refs.nodeSetting.resetFields()
      conf.visible = false
    },
    nodeMouseUp (evt) {
      //TODO： 有什么用？
      evt.preventDefault()
    },
    nodeClick () {
      console.log(arguments)
      //TODO: 点击修改param！
    },
    docMousemove ({ clientX, clientY }) {
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
    docMouseup ({ clientX, clientY }) {
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
    nodeItemMouseDown (evt, infoFun) {
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
  white-space   : nowrap;
  text-overflow : ellipsis;
  overflow      : hidden;
  word-wrap     : break-word;
}

.link-base-style-form {
  .el-form-item {
    margin-bottom : 12px;
  }

  padding-bottom : 20px;
  border-bottom  : 1px solid #DCDCDC;
}

.preprocess-canvas {
  width            : 100%;
  height           : 500px;
  background-color : #f5f5f5;
  @list-width      : 200px;
  @node-header-height: 30px;
  @node-width      : 150px;
  @node-height     : 100px;
  display:flex;
  flex-direction: row;
  justify-content: flex-start;

  //TODO: 节点列表可能溢出。修改UI。
  .side-menu{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width         : @list-width;
    height        : 100%;
    float            : left;
  }

  .node-container {
    width            : @list-width;
    height           : 100%;
    text-align       : center;
    overflow-wrap    : normal;
    background-color : #FFFFFF;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .flow-container {
    width    : calc(100% - @list-width);
    float    : left;
    height   : 100%;
    overflow : hidden;
  }

  .flow-node{
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }

  .node-header {
    font-size   : 14px;
    height      : 30px !important;
    line-height : 30px;
    color       : #ffffff;
    width       : 100%;
    text-align: center;
    font-weight: bold;
  }
  .node-header-dropna { background: black;}
  .node-header-remove_duplicates{ background: brown;}
  .node-header-Time_normalization{ background: #9a6e3a;}
  .node-header-onehot_encode{ background: #008fff; }
  .node-header-normalize{ background: #55a532; }
  .node-header-imputation{ background: #795da3; }
  .node-header-variance_select{ background: #990055; }
  .node-header-test_select{ background: red; }
  .node-header-dimension_reduction{ background: cadetblue;}
  .node-header-get_subtable{ background: darkblue ;}
  .node-header-2d_to_3d{ background: chocolate;}
  .node-header-merge{ background: tomato; }

  .node-main-params{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    text-align  : center;
    overflow-y  : hidden;
    word-break  : break-all;
    height: calc(@node-height - @node-header-height);

    .attr-label{
      font-size: 10px;
      color: #a3a3a3;
      margin-right: 2px !important;
      margin-left: 0px !important;
      font-family: "Times New Roman", math, sans-serif;
      font-style: italic;
    }

    .attr-value{
      font-size: 10px;
      color: #737373;
      font-family: "Times New Roman", math, sans-serif;
      font-style: italic;
    }
  }
}

.node-item {
  @node-item-height : 30px;

  font-size         : 12px;
  display           : inline-block;
  height            : @node-item-height;
  width             : 120px;
  margin-top        : 10px;
  background-color  : #FFFFFF;
  line-height       : @node-item-height;
  box-shadow        : 1px 1px 4px rgba(0, 0, 0, 0.3);
  cursor            : pointer;
  user-select       : none;
  text-align        : center;
  z-index           : 6;
  border-radius:  5px;

  &:hover {
    box-shadow : 1px 1px 8px rgba(0, 0, 0, 0.4);
  }
}

// TODO: 展示表头

</style>