// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    // baseUrl:'/',
    publicPath: "/",
    outputDir: "dist", // 打包的目录
    assetsDir: "static",
    lintOnSave: true, // 在保存时校验格式
    productionSourceMap: false, // 生产环境是否生成 SourceMap

    devServer: {
        open: false, // 启动服务后是否打开浏览器
        overlay: {
            warnings: true,
            errors: true
        },
        host: "0.0.0.0",
        port: 8080, // 服务端口
        https: false,
        hotOnly: false
        // proxy: { // 设置代理
        //   '/api': {
        //     target: host,
        //     changeOrigin: true,
        //     pathRewrite: {
        //       '/api': '/',
        //     }
        //   },
        // },
    },
    css: {
        sourceMap: false
    },
    configureWebpack: config => {
        config.plugins.push(
            // new CompressionWebpackPlugin({
            //     // filename: '[path].gz[query]',  // 提示 compression-webpack-plugin@3.0.0的话asset改为filename
            //     filename: '[path][base].gz',
            //     algorithm: 'gzip',
            //     test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
            //     threshold: 10240,
            //     minRatio: 0.8
            // })
        );
    },

    chainWebpack: config => {
        // 修复HMR 开启热更新
        config.resolve.symlinks(true);
    }
};
