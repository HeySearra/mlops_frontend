const nodeOptions=[
    {
      label: '删除缺失值',
      value: () => ({
        meta: {
          name: 'dropna',
          title: "删除缺失值",
          params: {
            axis: { value:0,type: "Number", unique:true},
            how: { value:'any',type: "Enum", unique:true, options:["any","all"]},
            thresh: { value:0,type: "Double", unique:true},
            subset: { value:[], type:"ChooseCol", unique:false}
          },
          description: ""
        },
      })
    },
    {
      label: '去除重复值',
      value: () => ({
        meta: {
          name: 'remove_duplicates',
          title: "去除重复值",
          params:{
            keep: { value: "first",type:"Enum", unique:true, options:["first","last","mean"]},
            subset: { value:[], type:"ChooseCol", unique:false }
          },
          description: ""
        },

      })
    },
    {
      label: '时间标准化',
      value: () => ({
        meta: {
          name: 'time_normalization',
          title: "时间标准化",
          params:{
            subset: {value:[], type:"ChooseCol", unique:false}
          },
          description: ""
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
            prefix: {value:"", type:"String", unique:false, tips:"需要输入多个字符串，请用 | 作为分隔符"},//TODO:???长度和subset长度对应？
            include_na: {value:false, type:"Bool", unique:true},
            subset: {value:[], type:"ChooseCol", unique:false}
          },
          description: ""
        }
      })
    },
    {
      label: '归一化',
      value: () => ({
        meta: {
          name: 'normalize',
          title: "归一化",
          params:{
            method: {value:"z-score", type:"Enum", unique:true, options:["z-score","min-max","max-abs"]},
            subset: {value:[], type:"ChooseCol", unique:false}
          },
          description: ""
        },
      })
    },
    {
      label: '缺失值填补',
      value: () => ({
        meta: {
          name: 'imputation',
          title: "缺失值填补",
          params:{
            method: {value:"ffill", type:"Enum", unique:true, options:["ffill","bfill","meanfill","valuefill"]},
            value: {value:0, type:"Float", unique:true},
            subset: {value:[], type:"ChooseCol", unique:false}
          },
          description: ""
        },

      })
    },
    {
      label: '方差筛选',
      value: () => ({
        meta: {
          name: 'variance_select',
          title: "方差筛选",
          params:{
            threshold: {value:0, type:"Float", unique:true},
            subset: {value:[], type:"ChooseCol", unique:false}
          },
          description: ""
        }
      })
    },
    {
      label: '假设检验筛选',
      value: () => ({
        meta: {
          name: 'test_select',
          title: "假设检验筛选",
          params:{
            score_func: {value:"pearson", type:"Enum",unique:true,
                      options:["pearson","mutual_info_regression","chi2","ANOVA","mutual_info_classify"]},
            k: { value: 0, type:"Number", unique:true},
            y_name: { value:"", type:"String", unique:true},
            subset: {value:[], type:"ChooseCol", unique:false}
          },
          description: ""
        },
      })
    },
    {
      label: '数据降维',
      value: () => ({
        meta: {
          name: 'dimension_reduction',
          title: "数据降维",
          params:{
            method: {value:"pca", type:"Enum", unique:true, options:["pca","svd"]},
            n_components: {value:1, type:"Number", unique:true},
            subset: {value:[], type:"ChooseCol", unique:false},
          },
          description: ""
        },
      })
    },
    {
      label: '获取子表',
      value: () => ({
        meta: {
          name: 'get_subtable',
          title: '获取子表',
          params:{
            subset: {value:[], type:"ChooseCol", unique:false}
          },
          description: ""
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
            to_type: { value:'any',type: "Enum", unique:true, options:['int', 'float', 'str', 'datetime']},
            subset: { value:[], type:"ChooseCol", unique:false}
          },
          description: ""
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
            str_list: {value:"", type:"String", unique:false, tips:"需要输入多个字符串，请用[\"str1\", \"str2\"]格式"},
          },
          description: ""
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
            lower_bound: { value:0,type: "Double", unique:true},
            upper_bound: { value:0,type: "Double", unique:true},
            method: { value:'zscore',type: "Enum", unique:true, options:['zscore']},
          },
          description: ""
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
    //         id_col: {value:[], type:"ChooseCol", unique:false},
    //         timestap_col: {value:[], type:"ChooseCol", unique:true},
    //         to_tensor: {value:false, type:"Bool", unique:true}
    //       },
    //       description: ""
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