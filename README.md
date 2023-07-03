# modelops

## 首先安装node.js环境，在项目目录下运行命令

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### 完成以上两条命令即可在本地运行前端项目

#

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


                    <!-- <el-table
                      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
                      style="width: 100%">
                      <el-table-column label="当前实例" width="200px" align="center">
                        <template slot-scope="scope">
                          <div>{{ edge.fromLabel }}</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="选择字段" prop="name" width="200px" align="center">
                        <template slot-scope="scope">
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
                        </template>
                      </el-table-column>
                      <el-table-column align="right" width="120px">
                        <template slot="header" slot-scope="scope"> -->
                          <!-- <el-input v-model="search" size="mini" placeholder="搜索实例" /> -->
                        <!-- </template> -->
                        <!-- <template slot-scope="scope">
                          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                          <el-button size="mini" type="danger"
                            @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                        </template> -->
                      <!-- </el-table-column>
                    </el-table> -->