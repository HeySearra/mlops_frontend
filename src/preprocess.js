const nodeOptions = [
  {
    label: '删除缺失值',
    value: () => ({
      meta: {
        name: 'dropna',
        title: "删除缺失值",
        params: {
          axis: { value: 0, type: "Number", unique: true, tips: "0: 删除有缺失值的行, 1: 删除有缺失值的列" },
          how: { value: "", type: "Enum", unique: true, options: ["any", "all"], tips:"全为缺失值删除该列还是有任何缺失值删除该列" },
          thresh: { value: "", type: "Double", unique: true, tips: "数据缺失率，0-1之间的一个浮点数（不包含0和1），删除数据缺失率>thresh的行或列，不与how和subset一起使用" },
          subset: { value: "", type: "ChooseCol", unique: false, tips: "在哪些列上考虑，默认考虑所有列" }
        },
        description: "删除缺失值"
      },
    })
  },
  {
    label: '去除重复值',
    value: () => ({
      meta: {
        name: 'remove_duplicates',
        title: "去除重复值",
        params: {
          keep: { value: "first", type: "Enum", unique: true, options: ["first", "last", "mean"] },
          subset: { value: "", type: "ChooseCol", unique: false, tips: "在哪些列上考虑，默认考虑所有列" }
        },
        description: "根据给定的特征或者特征列表，去除的重复数据"
      },

    })
  },
  {
    label: '时间标准化',
    value: () => ({
      meta: {
        name: 'time_normalization',
        title: "时间标准化",
        params: {
          subset: { value: "", type: "ChooseCol", unique: false, tips: "在哪些列上考虑，默认考虑所有列" }
        },
        description: "根据给定的征或者征列表，将object类型的数据转为datetime64类型"
      }
    })
  },
  {
    label: 'onehot编码',
    value: () => ({
      meta: {
        name: 'onehot_encode',
        title: "onehot编码",
        params: {
          prefix: { value: "", type: "String", unique: false, tips: "需要输入多个字符串，请用[\"str1\", \"str2\"]格式，列表长度应该等于subset的数量" },//TODO:???长度和subset长度对应？
          include_na: { value: false, type: "Bool", unique: false, tips: "是否包含NaN，如果为False空值将被忽略" },
          subset: { value: "", type: "ChooseCol", unique: false, tips: "在哪些列上考虑，默认考虑所有列" }
        },
        description: "将类型变量转换为onehot 编码"
      }
    })
  },
  {
    label: '归一化',
    value: () => ({
      meta: {
        name: 'normalize',
        title: "归一化",
        params: {
          method: { value: "z-score", type: "Enum", unique: true, options: ["z-score", "min-max", "max-abs"], tips: "标准化或归一化方法" },
          subset: { value: "", type: "ChooseCol", unique: false, tips: "在哪些列上考虑，默认考虑所有列" }
        },
        description: "进行数字特征的标准化或归一化"
      },
    })
  },
  {
    label: '缺失值填补',
    value: () => ({
      meta: {
        name: 'imputation',
        title: "缺失值填补",
        params: {
          method: { value: "ffill", type: "Enum", unique: true, options: ["ffill", "bfill", "meanfill", "valuefill"], tips: "填补方法" },
          value: { value: 0, type: "Float", unique: false, tips: "如果method为valuefill，value为填充的值" },
          subset: { value: "", type: "ChooseCol", unique: false, tips: "在哪些列上考虑，默认考虑所有列" }
        },
        description: "缺失值填补"
      },

    })
  },
  {
    label: '方差筛选',
    value: () => ({
      meta: {
        name: 'variance_select',
        title: "方差筛选",
        params: {
          threshold: { value: 0, type: "Float", unique: true, tips: "方差低于threshold 的特征将被删除，default=0" },
          subset: { value: "", type: "ChooseCol", unique: false, tips: "在哪些列上考虑，默认考虑所有列" }
        },
        description: "根据方差筛选特征"
      }
    })
  },
  {
    label: '假设检验筛选',
    value: () => ({
      meta: {
        name: 'test_select',
        title: "假设检验筛选",
        params: {
          score_func: {
            value: "pearson", type: "Enum", unique: true,
            options: ["pearson", "mutual_info_regression", "chi2", "ANOVA", "mutual_info_classif"], tips: "假设检验方法"
          },
          k: { value: 0, type: "Number", unique: true, tips: "筛选最好的k组数据" },
          y_name: { value: "", type: "String", unique: true, tips: "作为label/target的特征名" },
          subset: { value: "", type: "ChooseCol", unique: false, tips: "在哪些列上考虑，默认考虑所有列" }
        },
        description: "根据假设检验筛选特征"
      },
    })
  },
  {
    label: '数据降维',
    value: () => ({
      meta: {
        name: 'dimension_reduction',
        title: "数据降维",
        params: {
          method: { value: "pca", type: "Enum", unique: true, options: ["pca", "svd"], tips: "降维方法" },
          n_components: { value: 1, type: "Number", unique: true, tips: "保留多少维" },
          subset: { value: "", type: "ChooseCol", unique: false, tips: "在哪些列上考虑特征降维，默认考虑所有列" },
        },
        description: "进行特征降维"
      },
    })
  },
  {
    label: '获取子表',
    value: () => ({
      meta: {
        name: 'get_subtable',
        title: '获取子表',
        params: {
          subset: { value: "", type: "ChooseCol", unique: false, tips: "取哪些列构成子表" }
        },
        description: "获取子表"
      },
    })
  },
  {
    label: '格式转化',
    value: () => ({
      meta: {
        name: 'to_type',
        title: "格式转化",
        params: {
          to_type: { value: 'any', type: "Enum", unique: true, options: ['int', 'float', 'str', 'datetime'] },
          subset: { value: "", type: "ChooseCol", unique: false }
        },
        description: "格式转化"
      },
    })
  },
  {
    label: '清理字符串null',
    value: () => ({
      meta: {
        name: 'str_null',
        title: "清理字符串null",
        params: {
          // str_list: { value:'any',type: "Enum", unique:true, options:['null', 'NULL', 'None', 'none', '0', '']},
          str_list: { value: "", type: "String", unique: false, tips: "哪些字符串定义为空值，需要输入多个字符串，请用[\"str1\", \"str2\"]格式" },
        },
        description: "清理字符串null，转化为np.nan"
      },
    })
  },
  {
    label: '处理离群值',
    value: () => ({
      meta: {
        name: 'handle_outliers',
        title: "处理离群值",
        params: {
          lower_bound: { value: 0, type: "Double", unique: true, tips: "下限，值必须大于等于下限，否则会被置nan" },
          upper_bound: { value: 0, type: "Double", unique: true, tips: "上限，值必须小于等于上限，否则会被置nan" },
          method: { value: 'zscore', type: "Enum", unique: true, options: ['zscore'] },
        },
        description: "处理DataFrame中某一列的离群值，将其变为为NaN。给定上下限优先使用上下限，未给定上下限使用zscore方法结合3 sigma原则筛选"
      },
    })
  },
  // {
  //   label: '时序转换',
  //   value: () => ({
  //     meta: {
  //       name: '2d_to_3d',
  //       title: "时序转换",
  //       params:{
  //         id_col: {value:[], type:"ChooseCol", unique:false, tips: "如患者ID的所在列的列名"},
  //         timestap_col: {value:[], type:"ChooseCol", unique:true, tips: "时间戳所在列的列名"},
  //         to_tensor: {value:false, type:"Bool", unique:true, tips: "是否生成规范的三维tensor，否则生成不规则的三维列表"}
  //       },
  //       description: "对于时序数据，给定id和时间戳所在列，将二维表转换为三维数据"
  //     }
  //   })
  // },
  // {
  //   label: '多表合并',
  //   value: () => ({
  //     meta: {
  //       name: 'merge',
  //       title: "多表合并",
  //       params:{
  //         how: { value:"inner", type:"Enum", unique:true, options:["left","right","outer","inner","cross"]},
  //         on: { value:[], type:"ChooseCol", unique:false}
  //       },
  //       description: ""
  //     },
  //   })
  // },
]

export default nodeOptions