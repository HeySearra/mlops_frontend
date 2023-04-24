const nodeOptions=[
    {
      label: 'dropna',
      value: () => ({
        meta: {
          name: 'dropna',
          params: {
            axis: { value:0,type: "Number", unique:true},
            how: { value:'any',type: "Enum", unique:true, options:["any","all"]},
            thresh: { value:0,type: "Number", unique:true},
            subset: { value:[], type:"ChooseCol", unique:false}
          },
          description: ""
        },
      })
    },
    {
      label: 'remove_duplicates',
      value: () => ({
        meta: {
          name: 'remove_duplicates',
          params:{
            keep: { value: "first",type:"Enum", unique:true, options:["first","last","mean"]},
            subset: { value:[], type:"ChooseCol", unique:false }
          },
          description: ""
        },

      })
    },
    {
      label: 'time_normalization',
      value: () => ({
        meta: {
          name: 'time_normalization',
          params:{
            subset: {value:[], type:"ChooseCol", unique:false}
          },
          description: ""
        }
      })
    },
    {
      label: 'onehot_encode',
      value: () => ({
        meta: {
          name: 'onehot_encode',
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
      label: 'normalize',
      value: () => ({
        meta: {
          name: 'normalize',
          params:{
            method: {value:"z-score", type:"Enum", unique:true, options:["z-score","min-max","max-abs"]},
            subset: {value:[], type:"ChooseCol", unique:false}
          },
          description: ""
        },
      })
    },
    {
      label: 'imputation',
      value: () => ({
        meta: {
          name: 'imputation',
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
      label: 'variance_select',
      value: () => ({
        meta: {
          name: 'variance_select',
          params:{
            threshold: {value:0, type:"Float", unique:true},
            subset: {value:[], type:"ChooseCol", unique:false}
          },
          description: ""
        }
      })
    },
    {
      label: 'test_select',
      value: () => ({
        meta: {
          name: 'test_select',
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
      label: 'dimension_reduction',
      value: () => ({
        meta: {
          name: 'dimension_reduction',
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
      label: 'get_subtable',
      value: () => ({
        meta: {
          name: 'get_subtable',
          params:{
            subset: {value:[], type:"ChooseCol", unique:false}
          },
          description: ""
        },
      })
    },
    {
      label: '2d_to_3d',
      value: () => ({
        meta: {
          name: '2d_to_3d',
          params:{
            id_col: {value:[], type:"ChooseCol", unique:false},
            timestap_col: {value:[], type:"ChooseCol", unique:true},
            to_tensor: {value:false, type:"Bool", unique:true}
          },
          description: ""
        }
      })
    },
    {
      label: 'merge',
      value: () => ({
        meta: {
          name: 'merge',
          params:{
            how: { value:"inner", type:"Enum", unique:true, options:["left","right","outer","inner","cross"]},
            on: { value:[], type:"ChooseCol", unique:false}
          },
          description: ""
        },
      })
    },
  ]

export default nodeOptions