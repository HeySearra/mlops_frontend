module.exports = {
  lintOnSave: false,

  devServer: {
    host: "localhost",
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: { //配置跨域 
      "/api/": {
        target: "http://cc.qk0.cc:8001/", 
        ws: true,
        changOrigin: true, //允许跨域 
        pathRewrite: {
          "^/api": "",
        },
      },
    }
  },
}