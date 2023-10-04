<template><div v-loading="Loading" :element-loading-text="tip" style="height: 100%">
  <el-container style="width: 95%; margin-left: 30px; margin-top: 10px">
    <el-card class="box-card" style="margin: 1%">

      <!--     根据用户导入进度而切换的卡片，控制切换的变量为 active_step，值为0 1 2 3 4-->

      <!--      步骤进度条和提示信息，当前步骤变量为 active_step，值为1 2 3 4       -->

      <div slot="header" style="margin: 1%">
        <el-steps :active="active_step" finish-status="success" align-center>
          <el-step title="选择数据源"></el-step>
          <el-step title="上传数据"></el-step>
          <el-step title="关系表映射"></el-step>
          <el-step title="表字段映射"></el-step>
        </el-steps>

        <div v-if="active_step > 0 && active_step <= 3">
          <el-card style="margin: 20px; background: #e9e9eb; border-radius: 4px" shadow="never">
            <div v-if="active_step===1 && isRDB === true" class="info">
              连接关系型数据库，请依次输入如下信息，连接数据源
            </div>
            <div v-if="active_step===1 && isRDB === false" class="info">
              上传csv/excel文件的zip压缩包
            </div>
            <div v-else-if="active_step===2" class="info">
              确定关系表与概念之间映射关系，每张表可以选择一个或两个概念，并根据数据库建表规范，对映射作出以下限定：<br/>
              如果选择单个概念，则默认这张表可以进行实例属性映射，和外键关联的关系映射<br/>
              如果选择两个概念，则默认这张表不可以进行实例属性映射，只可以进行跨表关联的关系映射<br/>
              例：学生信息表对应"学生"概念，则该表可以生成"学生"实例，以及与该"学生"实例通过外键相连的关系，如"所在班级"关系；<br/>
              学生选课表对应"学生"和"课程"两个概念，则默认该表为跨表关联，由该表只能生成"选课"关系，无法生成实例
            </div>

            <div v-else-if="active_step===3" class="info">
              分别对每张表进行字段映射，概念图展示的是本体模型中本概念节点、邻居概念节点及其之间的关系，请依次选择你要处理的关系表，添加实例和关系
            </div>
          </el-card>
        </div>
      </div>

      <!--      第 0 步：选择rdb导入/csv导入       -->
      <div v-if="active_step === 0" style="height: 600px; margin-left: 20%;">
        <el-card style="height: 200px; width: 600px;  margin-top: 8%; cursor: pointer" shadow="hover"
                 @click.native="chooseDataSource(0)">
          <el-row>
            <el-col :span="10">
              <img style="margin-left:60px; margin-top: 25px; height: 100px"
                   src="https://s1.ax1x.com/2022/10/05/xlNECj.png"
                   alt="xltIjx.png"/>
            </el-col>
            <el-col :span="10">
              <div style="margin-top: 60px; font-size: 25px; font-weight:bold">RDB数据导入</div>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="height: 200px; width: 600px; margin-top: 5%; cursor: pointer" shadow="hover"
                 @click.native="chooseDataSource(1)">
          <el-row>
            <el-col :span="9">
              <img style="margin-left:50px; margin-top: 35px; height: 80px"
                   src="https://s1.ax1x.com/2022/10/04/xltIjx.png"
                   alt="xltIjx.png"/>
            </el-col>
            <el-col :span="10">
              <div style="margin-top: 60px; font-size: 25px; font-weight:bold">csv/excel数据导入</div>
            </el-col>
          </el-row>
        </el-card>

      </div>

      <!--      第 1 步：上传数据      -->
      <!--         RDB连接           -->
      <div v-if="active_step === 1 && isRDB === true">
        <el-card class="box-card" shadow="never">
          <el-form label-position="right" label-width="100px">
            <el-form-item label="数据库类型">
              <el-select v-model="structuredDataInput.rdbType" placeholder="请选择">
                <el-option value="MySQL"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数据库名称">
              <el-input v-model="structuredDataInput.dbName"></el-input>
            </el-form-item>
            <el-form-item label="数据库地址">
              <el-input v-model="structuredDataInput.host"></el-input>
            </el-form-item>
            <el-form-item label="端口号">
              <el-input v-model="structuredDataInput.port"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="structuredDataInput.user"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="structuredDataInput.pwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="映射可复用">
              <el-switch v-model="dataReuse"></el-switch>
            </el-form-item>
          </el-form>
          <div>
            <el-button style="margin-left: 80px" @click="lastStep" plain>上一步</el-button>
            <el-button style="float: right; margin-right: 80px" type="primary" @click="submitDatabaseInfo" plain>下一步
            </el-button>
            <el-button style="float: right" @click="testDatabaseConnection" plain>测试连接</el-button>
          </div>
        </el-card>
      </div>
      <!--          csv上传           -->
      <div v-if="active_step === 1 && isRDB === false">
        <el-card class="box-card" shadow="never" style="height: 60%">
          <el-form label-position="right" label-width="100px"
                   style="margin-left: 20%; margin-right: 20%; margin-top: 3%">
            <el-form-item>
              <el-upload :file-list="csvFileList" action="" :auto-upload="false"
                         :on-change="handleCsvFileChange" :on-preview="handleCsvFileChange"
                         :limit="1" drag :on-exceed="handleCsvFileUploadExceed">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
            <el-form-item label="映射可复用" style="margin-left: 100px">
              <el-switch v-model="dataReuse"></el-switch>
            </el-form-item>
          </el-form>
          <div style="margin-top: 10%">
            <el-button style="margin-left: 5%" @click="lastStep" plain>上一步</el-button>
            <el-button style="float: right; margin-right: 12%" type="primary" @click="ontMappingDataInputSubmit" plain>
              下一步
            </el-button>
          </div>
        </el-card>
      </div>
      <!--      第二步：关系表与概念映射        -->
      <div v-if="active_step===2">

        <el-table
            :data="tableData"
            style="width: 100%"
            border
            size="medium">
          <el-table-column
              type="index"
              width="40">
          </el-table-column>
          <el-table-column
              prop="name"
              label="表名"
              width="200">
            <template v-slot="scope">
              <el-link @click="dialogLookConceptVisible = true">{{ scope.row.name }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
              width="90"
              label="状态">
            <template v-slot="scope">
              <div v-if="!tableData[scope.$index].conceptMapped" style="color: #F56C6C; font-weight:bold"> 未映射</div>
              <div v-else style="color: #67C23A; font-weight:bold">已映射</div>
            </template>
          </el-table-column>
          <el-table-column prop="concept" label="对应概念">
            <template v-slot="scope">
              <el-tag type="info" v-for="(item, index) in scope.row.concepts"
                      :key="index" closable @close="deleteConcept(index, scope.row)"
                      style="margin-right: 5px"
                      effect="plain">
                {{ item }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="230">
            <template v-slot="scope">
              <el-button style="margin-left: 5px" size="small" type="primary"
                         @click="addRow = scope.$index; dialogAddConceptVisible = true; ">新增
              </el-button>
              <el-button size="small" type="warning">清空</el-button>
              <el-button size="small" type="danger" @click="deleteTable(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--    新增概念映射对话框    -->
        <el-dialog title="选择关系表对应的概念" :visible.sync="dialogAddConceptVisible" append-to-body
                   style="width: auto ">

          <el-card shadow="never" style="margin-bottom: 30px">
            <span>关系表名：</span>
            <span style="margin-left: 20px; font-weight:bold">{{ tableData[addRow].name }}</span>
            <el-divider></el-divider>
            <span>包含字段: </span>
            <span style="margin-left: 20px">
                <el-tag size="small" effect="plain"
                        v-for="(item,index) in tableData[addRow].fields"
                        :key="index"
                        style="margin-right: 5px; margin-bottom: 10px">{{ item }}</el-tag>
              </span>
          </el-card>

          <el-form label-position="right" label-width="100px">
            <el-form-item label="对应概念">
              <el-select v-model="newConcept">
                <el-option
                    v-for="(item,index) in conceptData"
                    :key="index"
                    :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddConceptVisible = false">取 消</el-button>
            <el-button type="primary" @click="addConcept">确 定</el-button>
          </div>
        </el-dialog>


        <!--    查看概念映射对话框    -->
        <el-dialog title="关系表对应概念" :visible.sync="dialogLookConceptVisible" append-to-body
                   style="width: auto ">

          <el-card shadow="never" style="margin-bottom: 30px">
            <span>关系表名</span>
            <span style="margin-left: 20px; font-weight:bold">{{ addRow.name }}</span>
            <el-divider></el-divider>
            <span>包含字段</span>
            <span style="margin-left: 20px">
                <span
                    v-for="(item,index) in addRow.fields"
                    :key="index"
                    style="margin-right: 15px">{{ item }}</span>
            </span>
            <el-divider></el-divider>
            <span>对应概念</span>
            <span style="margin-left: 20px">
              <el-tag
                  type="info"
                  v-for="(item, index) in addRow.concepts"
                  :key="index"
                  style="margin-right: 5px"> {{ item }}
              </el-tag>
            </span>
          </el-card>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogLookConceptVisible = false">确 定</el-button>
          </div>
        </el-dialog>

        <el-row style="margin-top: 20px">
          <el-button style="margin-left: 10px" @click="lastStep" plain>上一步</el-button>
          <el-button style="float: right; margin-right: 30px" type="primary" @click="submitTableMapping" plain>下一步
          </el-button>
        </el-row>

      </div>

      <!--      第三步：关系表与谓词映射        -->
      <div v-if="active_step===3">

        <el-container style="height: 100%; border: 1px solid #eee">
          <el-aside width="250px" style="background-color: rgb(238, 241, 246)">

            <div style="margin-left: 20px"><h4>数据表</h4></div>

            <el-menu
                :uniqueOpened="true"
                active-text-color="#0152c1"
                @select="tableMenuSelect">
              <el-menu-item
                  v-for="(item,index) in tableData"
                  :key="index"
                  :index="index.toString()">
                <i v-if="tableData[index].mappingSaved" class="el-icon-success"></i>
                <i v-else class="el-icon-document"></i>
                <span slot="title">{{ item.name }}</span>
              </el-menu-item>
            </el-menu>
          </el-aside>

          <el-main>
            <el-row style="margin: 2%" :gutter="10">
              <el-col :span="10">
                <el-card shadow="never" style="height: 300px; overflow: scroll; overflow-x:hidden">
                  <div slot="header" style="font-size: 15px; font-weight: bold">
                    <i class="el-icon-document-copy"></i>
                    表中字段
                  </div>
                  <div style="display:inline;margin-right:10px; height: 100%"
                       v-for="(item,index) in tableData[handleTableIndex].fields"
                       :key="index">
                    <!--          引入推荐           -->
                    <el-button v-if="isFieldRecommend(item)" type="warning" plain size="mini" style="margin-bottom: 8px"
                               @click="selectField(index)">{{ item }}
                    </el-button>
                    <el-button v-else type="info" plain size="mini" style="margin-bottom: 8px"
                               @click="selectField(index)">{{ item }}
                    </el-button>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="14">
                <el-card shadow="never">
                  <div slot="header" style="font-size: 15px; font-weight: bold">
                    <i class="el-icon-document-copy"></i>
                    概念：
                    <span style="display:inline" v-for="(concept, index) in tableData[handleTableIndex].concepts"
                          :key="index">
                      {{ concept }}
                    </span>
                  </div>
                  <!--  本体模型交互图   -->
                  <div>
                    <network
                        ref="interactGraph"
                        style="height: 200px"
                        :nodes="tableData[handleTableIndex].networkNodes"
                        :edges="tableData[handleTableIndex].networkEdges"
                        :options="network.options"
                        :manipulation-options="network.options.manipulation">
                    </network>
                  </div>
                </el-card>
              </el-col>
            </el-row>

            <!--                    实例列表展示卡片                     -->
            <el-card shadow="never" style="margin: 2%">
              <div slot="header" style="font-size: 15px; font-weight: bold">
                <i class="el-icon-document-copy"></i>
                实例
                <el-tooltip class="item" effect="dark" content="请添加实例，并选择表中字段完成属性映射" placement="top-start">
                  <i class="el-icon-info" style="margin-left: 5px;margin-top: 3px"></i>
                </el-tooltip>
                <el-button v-if="!tableData[handleTableIndex].mappingSaved"
                           style="float: right" type="warning"
                           icon="el-icon-plus" plain size="small"
                           @click="addInstances">新增
                </el-button>
              </div>
              <div v-if="tableData[handleTableIndex].conceptInstances.length > 0">
                <div v-for="(instance, index) in tableData[handleTableIndex].conceptInstances"
                     :key="index">
                  <el-card shadow="never" style="margin-bottom: 5px">
                    <div slot="header" style="margin-left: 15px; font-size: 12px; font-weight: bold">
                      实例： {{ instance.conceptName }}
                      <el-tooltip class="item" effect="dark" content="删除当前实例" placement="top">
                        <el-button style="float: right" type="danger" v-if="!tableData[handleTableIndex].mappingSaved"
                                   icon="el-icon-delete" circle plain size="mini"
                                   @click="deleteConceptInstance(index)"></el-button>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="一键推荐匹配" placement="top">
                        <el-button style="float: right; margin-right: 15px" type="success"
                                   v-if="!tableData[handleTableIndex].mappingSaved"
                                   icon="el-icon-magic-stick" circle plain size="mini"
                                   @click="recommendAllProps(index)"></el-button>
                      </el-tooltip>

                    </div>
                    <!--        把实例卡片展示分为3列            -->
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form v-for="(value, key) in tableSlice(instance.mapProps, 1)"
                                 :key="key"
                                 label-width="130px"
                                 label-position="right">
                          <!--用v-for遍历map时，value[0]为key值（属性名），value[1]为value值（属性对应的字段）-->
                          <el-form-item class="el-form-item--small" :label="value[0]" style="width: 90%;">
                            <!--          如果已经保存，则显示映射结果                -->
                            <div v-if="tableData[handleTableIndex].mappingSaved">
                              <div v-if="value[1] !== null">
                                <el-tag style="margin-right: 10px" size="small"> {{ value[1] }}</el-tag>
                              </div>
                            </div>
                            <!--          如果没有保存，则显示选择字段、close标签          -->
                            <div v-else>
                              <div v-if="value[1] === null">
                                <el-button @click="addProp(index, value[0])" icon="el-icon-plus"
                                           size="mini" plain>选择字段
                                </el-button>
                              </div>
                              <div v-else>
                                <el-tag style="margin-right: 10px" closable size="small" type="info"
                                        @close="deletePropMapping(index, value[0], 1)"> {{ value[1] }}
                                </el-tag>
                              </div>
                            </div>
                          </el-form-item>
                        </el-form>
                      </el-col>
                      <el-col :span="8">
                        <el-form v-for="(value, key) in tableSlice(instance.mapProps, 2)"
                                 :key="key"
                                 label-width="130px"
                                 label-position="right">
                          <!--用v-for遍历map时，value[0]为key值（属性名），value[1]为value值（属性对应的字段）-->
                          <el-form-item class="el-form-item--small" :label="value[0]" style="width: 90%;">
                            <!--          如果已经保存，则显示映射结果                -->
                            <div v-if="tableData[handleTableIndex].mappingSaved">
                              <div v-if="value[1] !== null">
                                <el-tag style="margin-right: 10px" size="small"> {{ value[1] }}</el-tag>
                              </div>
                            </div>
                            <!--          如果没有保存，则显示选择字段、close标签          -->
                            <div v-else>
                              <div v-if="value[1] === null">
                                <el-button @click="addProp(index, value[0])" icon="el-icon-plus"
                                           size="mini" plain>选择字段
                                </el-button>
                              </div>
                              <div v-else>
                                <el-tag style="margin-right: 10px" closable size="small" type="info"
                                        @close="deletePropMapping(index, value[0], 1)"> {{ value[1] }}
                                </el-tag>
                              </div>
                            </div>
                          </el-form-item>
                        </el-form>
                      </el-col>
                      <el-col :span="8">
                        <el-form v-for="(value, key) in tableSlice(instance.mapProps, 3)"
                                 :key="key"
                                 label-width="130px"
                                 label-position="right">
                          <!--用v-for遍历map时，value[0]为key值（属性名），value[1]为value值（属性对应的字段）-->
                          <el-form-item class="el-form-item--small" :label="value[0]" style="width: 90%;">
                            <!--          如果已经保存，则显示映射结果                -->
                            <div v-if="tableData[handleTableIndex].mappingSaved">
                              <div v-if="value[1] !== null">
                                <el-tag style="margin-right: 10px" size="small"> {{ value[1] }}</el-tag>
                              </div>
                            </div>
                            <!--          如果没有保存，则显示选择字段、close标签          -->
                            <div v-else>
                              <div v-if="value[1] === null">
                                <el-button @click="addProp(index, value[0])" icon="el-icon-plus"
                                           size="mini" plain>选择字段
                                </el-button>
                              </div>
                              <div v-else>
                                <el-tag style="margin-right: 10px" closable size="small" type="info"
                                        @close="deletePropMapping(index, value[0], 1)"> {{ value[1] }}
                                </el-tag>
                              </div>
                            </div>
                          </el-form-item>
                        </el-form>
                      </el-col>
                    </el-row>
                  </el-card>
                </div>
              </div>
              <div v-else style="color: #909399; font-size: 12px; margin-left: 45%">
                暂无实例
              </div>
            </el-card>

            <!--                    关系列表展示卡片                     -->
            <el-card shadow="never" style="margin: 2%">
              <div slot="header" style="font-size: 15px; font-weight: bold">
                <i class="el-icon-document-copy"></i>
                关系
                <el-tooltip class="item" effect="dark" content="请添加关系，并选择表中字段中该头/尾实体的关键属性，完成关系映射" placement="top-start">
                  <i class="el-icon-info" style="margin-left: 5px;margin-top: 3px"></i>
                </el-tooltip>
                <el-button v-if="!tableData[handleTableIndex].mappingSaved"
                           style="float: right" type="warning"
                           icon="el-icon-plus" plain size="small"
                           @click="addEdgeInstance">新增
                </el-button>
              </div>

              <div v-if="tableData[handleTableIndex].edgeInstances.length > 0">
                <div v-for="(edge, index) in tableData[handleTableIndex].edgeInstances"
                     :key="index"
                     style="margin-top:5px">
                  <el-card shadow="never">
                    <div slot="header" style="margin-left: 15px; font-size: 12px; font-weight: bold">
                      关系： {{ edge.edgeLabel }}
                      <el-button style="float: right" type="danger" v-if="!tableData[handleTableIndex].mappingSaved"
                                 icon="el-icon-delete" circle plain size="mini"
                                 @click="deleteEdgeInstance(index)"></el-button>

                    </div>
                    <!--       分为2列：头实体和尾实体            -->
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form label-width="130px" label-position="right">
                          <!--用v-for遍历map时，value[0]为key值（属性名），value[1]为value值（属性对应的字段）-->
                          <el-form-item class="el-form-item--small" :label=" '头实体：' + edge.fromLabel"
                                        style="width: 90%;">
                            <!--      如果映射已经保存       -->
                            <div v-if="tableData[handleTableIndex].mappingSaved">
                              <div v-if="edge.fromValue === -1">
                                <el-tag style="margin-right: 10px" size="small"> 当前实例</el-tag>
                              </div>
                              <div v-else-if="edge.fromValue !== null">
                                <el-tag style="margin-right: 10px" size="small"> {{ edge.fromValue }}
                                </el-tag>
                              </div>
                            </div>
                            <!--      如果映射没有保存       -->
                            <div v-else>
                              <div v-if="edge.fromValue === -1">
                                <el-tag style="margin-right: 10px" size="small"> 当前实例</el-tag>
                              </div>

                              <div v-else-if="edge.fromValue === null">
                                <el-button @click="addEdge(index, 'fromValue')" icon="el-icon-plus"
                                           size="mini" plain>选择字段
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
                      <el-col :span="12">
                        <el-form label-width="130px" label-position="right">
                          <!--用v-for遍历map时，value[0]为key值（属性名），value[1]为value值（属性对应的字段）-->
                          <el-form-item class="el-form-item--small" :label=" '尾实体：' + edge.toLabel"
                                        style="width: 90%;">
                            <!--      如果映射已经保存       -->
                            <div v-if="tableData[handleTableIndex].mappingSaved">
                              <div v-if="edge.toValue === -1">
                                <el-tag style="margin-right: 10px" size="small"> 当前实例</el-tag>
                              </div>
                              <div v-else-if="edge.fromValue !== null">
                                <el-tag style="margin-right: 10px" size="small"> {{ edge.toValue }}
                                </el-tag>
                              </div>
                            </div>
                            <!--      如果映射没有保存       -->
                            <div v-else>
                              <div v-if="edge.toValue === -1">
                                <el-tag style="margin-right: 10px" size="small"> 当前实例</el-tag>
                              </div>

                              <div v-else-if="edge.toValue === null">
                                <el-button @click="addEdge(index, 'toValue')" icon="el-icon-plus"
                                           size="mini" plain>选择字段
                                </el-button>
                              </div>
                              <div v-else>
                                <el-tag style="margin-right: 10px" closable size="small" type="info"
                                        @close="deletePropMapping(index, 'toValue', 0)"> {{ edge.toValue }}
                                </el-tag>
                              </div>
                            </div>
                          </el-form-item>
                        </el-form>
                      </el-col>
                    </el-row>
                  </el-card>
                </div>
              </div>
              <div v-else style="color: #909399; font-size: 12px; margin-left: 45%">
                暂无关系
              </div>
            </el-card>
            <div v-if="tableData[handleTableIndex].mappingSaved">
              <el-button style="float: right; margin-right: 30px; margin-bottom: 20px" size="medium"
                         @click="changeMappingResult" plain>修改映射
              </el-button>
            </div>
            <div v-else>
              <el-button style="float: right; margin-right: 30px; margin-bottom: 20px" size="medium"
                         @click="saveMappingResult" plain>保存映射
              </el-button>
            </div>
          </el-main>
        </el-container>

        <!--    新增关系实例对话框    -->
        <el-dialog title="请选择新增的关系边" :visible.sync="dialogAddingEdgeVisible" append-to-body
                   style="width: auto ">

          <el-card shadow="never" style="margin: 2%">

            <div slot="header" style="font-size: 15px; font-weight: bold">
              <i class="el-icon-document-copy"></i>
              概念：
              <span style="display:inline" v-for="(concept, index) in tableData[handleTableIndex].concepts"
                    :key="index">
                      {{ concept }}
                    </span>
            </div>
            <!--  本体模型交互图   -->
            <div>
              <network
                  ref="interactGraph"
                  style="height: 200px"
                  :nodes="tableData[handleTableIndex].networkNodes"
                  :edges="tableData[handleTableIndex].networkEdges"
                  :options="network.options"
                  :manipulation-options="network.options.manipulation"
                  @click="selectEdge">
              </network>
            </div>
          </el-card>
        </el-dialog>

        <el-row style="margin-top: 20px">
          <el-button style="margin-left: 20px" @click="lastStep" plain>上一步</el-button>
          <el-button style="float: right; margin-right: 30px" type="primary" @click="generateInstances" plain>生成实例
          </el-button>

        </el-row>

      </div>

      <!--      第四步：导入成功界面       -->
      <div v-if="active_step===4">

        <el-card class="box-card" shadow="never" style="height: 700px">
          <div v-if="generateFinish === false"
               style="margin-left:42%; margin-top: 20px; font-size: 20px; font-weight: bold">
            <i class="el-icon-loading"></i>
            实例生成中
          </div>
          <div v-else-if="generateFinish" style="margin-left:42%; margin-top: 20px; font-size: 20px; font-weight: bold">
            <i class="el-icon-success"></i>
            实例导入成功！
          </div>
          <div v-else-if="generateFailed" style="margin-left:42%; margin-top: 20px; font-size: 20px; font-weight: bold">
            <i class="el-icon-error"></i>
            实例导入失败！
          </div>

          <div v-if="getTableContentFinish" style="margin-top:30px">
            <div v-for="(size, index) in tableContentSize"
                 :key="index"
                 style="margin-left:38%; margin-top: 20px; margin-bottom: 20px; font-size: 14px">
              {{ tableContentNameList[index] }} 共读取 {{ size }} 条记录
            </div>
          </div>

          <div v-if="generateFinish" style="margin-left:40%; margin-top: 30px; margin-bottom: 20px; font-size: 16px">
            共生成 {{ instanceNum }} 个实例， {{ edgeNum }} 条边
          </div>

          <el-button v-if="generateFinish" style="margin-left: 45%; margin-top: 100px" @click="finishAndReturn" plain>完成</el-button>
        </el-card>

      </div>

    </el-card>


  </el-container>

</div>
</template>


<style>

.info {
  font-size: 14px;
  margin-left: 10px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 100%;
}

.demo-block .demo-block-control {
  border-top: 1px solid #eaeefb;
  height: 44px;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  text-align: center;
  margin-top: -1px;
  color: #d3dce6;
  cursor: pointer;
  position: relative;
}

.demo-block .demo-block-control .control-button {
  line-height: 26px;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 14px;
  padding-left: 5px;
  padding-right: 25px;
}

</style>

<script>
import _ from "@/utils";
import Network from "../../lib/vue2vis/components/Network";
import {DataSet} from "vis-network"; //中括号不可删除！

export default {
  name: "newOntMapping",
  components: {
    Network
  },
  created() {
    this.network.data.nodes = new DataSet()
    this.network.data.edges = new DataSet()
  },
  data() {

    return {
      active_step: 0,

      /*******  第0步：基本功能所需数据定义  ******/
      //所有概念名
      conceptName: [],

      //所有概念数据
      conceptData: [],

      // 所有概念的主属性
      conceptKeyProp: new Map,

      // 是RDB还是csv文件
      isRDB: true,

      /*******  第一步：连接数据源 数据定义  ******/
      structuredDataInput: {
        rdbType: 'MySQL',
        dbName: 'construct_shuili',
        host: 'cc.qk0.cc',
        port: '13307',
        user: 'root',
        pwd: 'woxnskzhcs!',
      },

      dataReuse: true,

      // 用户上传的csv文件
      csvFileList: [],

      tableData: [],

      /*******  第二步：关系表与概念映射 数据定义 ******/
      //新增、查看概念映射对话框
      dialogAddConceptVisible: false,
      dialogLookConceptVisible: false,
      dialogDeleteTableVisible: false,

      // 当前新增所在行
      addRow: 0,
      newConcept: '',

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
      edgeNum: 0
    };
  },
  methods: {
    /*******  整体逻辑 方法定义  ******/

    test(data) {
      console.log(data)
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

    // 选择数据源，0-rdb，1-csv
    chooseDataSource(choice) {
      this.isRDB = choice === 0;

      _.post('/i3city-evo/v1/newOntMapping/chooseDataSource', {
        isRDB: this.isRDB
      }, () => {
        this.active_step++
      }, () => {
        this.$message.error('选择失败')
      })
    },

    /*******  第一步：连接RDB/上传CSV压缩包 方法定义  ******/
    //测试数据库连通性
    testDatabaseConnection() {
      _.post('/i3city-evo/v1/newOntMapping/testConnection', {
        rdbType: this.structuredDataInput.rdbType,
        dbName: this.structuredDataInput.dbName,
        host: this.structuredDataInput.host,
        port: this.structuredDataInput.port,
        username: this.structuredDataInput.user,
        pwd: this.structuredDataInput.pwd
      }, res => {
        let isConnected = res.data
        if (isConnected) {
          this.$message({
            message: '数据库连接成功',
            type: 'success'
          });
        } else {
          this.$message.error('数据库连接失败');
        }
      }, () => {
        this.$message.error('数据库连接失败')
      })
    },

    // 提交连接数据，并获取RDB数据模式和本体模型数据
    submitDatabaseInfo() {
      _.post('/i3city-evo/v1/newOntMapping/testConnection', {
        rdbType: this.structuredDataInput.rdbType,
        dbName: this.structuredDataInput.dbName,
        host: this.structuredDataInput.host,
        port: this.structuredDataInput.port,
        username: this.structuredDataInput.user,
        pwd: this.structuredDataInput.pwd
      }, res => {
        let isConnected = res.data
        if (isConnected) {
          this.getConceptData()
          this.getTableSchema() // 页面切换
        } else {
          this.$message.error('数据库连接失败');
        }
      }, () => {
        this.$message.error('数据库连接失败')
      })
    },

    // 获取本体模型的concept数据
    getConceptData() {
      _.get('/i3city-evo/v1/newOntMapping/getConceptData', {}, res => {
        this.conceptName = []
        this.conceptData = []
        // 根据返回结果构造conceptData，res的格式为：{id, name, props:[], edges:[{id, label, fromId, toId}], nodes:[{id, label}]}列表
        for (let i in res.data) {
          let concept = {
            id: res.data[i].id,
            name: res.data[i].name,
            props: res.data[i].props,
            edges: res.data[i].edges,
            nodes: res.data[i].nodes
          }
          // 把concept加入conceptData列表中
          this.conceptData.push(concept)
          this.conceptName.push(concept.name)
        }
      }, () => {
        this.$message.error('本体模型读取失败')
      })

      _.get('/i3city-evo/v1/newOntMapping/getConceptKeyProp', {}, res => {
        for (const [conceptId, keyProp] of Object.entries(res.data)) {
          this.conceptKeyProp.set(conceptId, keyProp)
        }
      }, () => {
        this.$message.error('本体模型读取失败')
      })
    },

    // 获取表数据模式
    getTableSchema() {
      _.get('/i3city-evo/v1/newOntMapping/getTableSchema', {}, res => {
        // key为 tableName, value为 columnName list
        this.tableData = []
        let i = 0
        for (const [tableName, fieldName] of Object.entries(res.data)) {
          let table = {
            name: '',
            fields: [],
            concepts: [],
            conceptMapped: false,
            conceptInstances: [],
            edgeInstances: [],
            networkNodes: [],
            networkEdges: [],
            mappingSaved: false
          }
          table.name = tableName
          table.fields = fieldName
          this.tableData[i++] = table
        }
        this.active_step++ // 页面切换
      }, () => {
        this.$message.error('数据模式读取失败')
      })
    },

    // csv文件上传
    handleCsvFileChange(file) {
      this.csvFileList = []
      this.csvFileList.push(file)
    },
    // 限制仅能选择一个文件
    handleCsvFileUploadExceed() {
      this.$message.warning('只可选择一个文件!')
    },
    // csv文件提交
    ontMappingDataInputSubmit() {
      if (this.csvFileList.length === 0) {
        alert('请上传文件！')
        return
      }
      _.postMultipart('/i3city-evo/v1/newOntMapping/importSourceZip', {
        file: this.csvFileList[0].raw,
      }, {}, res => {
        if (res.data) {
          this.$message({
            message: '文件上传成功',
            type: 'success'
          });
        }
        this.getConceptData()
        this.getTableSchema()
      }, () => {
        this.$message.error('文件上传失败')
      })
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


