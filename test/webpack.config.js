var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        'home/app': './src/test/home',
        'main': './src/main'
    }, //演示单入口文件
    output: {
        path: path.join(__dirname, 'dist'), //打包输出的路径
        publicPath: "./dist/", //html引用路径，在这里是本地地址。
        // filename: 'app.js', //打包后的名字
        filename: '[name].js' //打包多个
    },
    // 新添加的module属性
    module: {
        loaders: [{
                test: /\.js?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                // include: path.resolve(__dirname, "/page/"),
                query: {
                    presets: ['es2015']
                }
            },
            { test: /\.css$/, loader: "style!css" },
            { test: /\.(jpg|png)$/, loader: "url?limit=8192" },
            { test: /\.scss$/, loader: "style!css!sass" },
            { test: /\.json$/, loader: 'json' },
            // { test: require.resolve("jquery"), loader: "imports-loader?$=jquery" }
        ]

        // loaders: [{
        //     test: /\.css$/,
        //     loader: 'style-loader!css-loader!autoprefixer-loader?browsers=last 2 versions!'
        // }, {
        //     test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        //     loader: "url?limit=10240&minetype=application/font-woff&name=fonts/[name].[md5:hash:hex:7].[ext]"
        // }, {
        //     test: /\.(png|jpg|gif)/,
        //     loader: 'url?prefix=img&limit=10240&name=img/[name].[hash].[ext]'
        // }, {
        //     test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        //     loader: "file?name=fonts/[name].[md5:hash:hex:7].[ext]"
        // }, {
        //     test: /(admin|index)\.html/,
        //     loader: "file?name=[name].html"
        // }, {
        //     test: /tpl[\/\\].*\.html/,
        //     loader: 'html-loader!html-minify'
        // }, {
        //     test: /\.scss$/,
        //     loader: 'style!css!autoprefixer-loader?browsers=last 2 versions!sass'
        // }, ]
    },
    resolve: {
        root: ['./src'],
        alias: {
            // jquery: "jquery/dist/jquery"
        },
        extensions: ["", ".js"]
    },
    // externals: {
    //     jquery: 'window.$'
    // },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ],
    // devtool: "#source-map",
    // devServer: {
    //     contentBase: "./build",
    // }
};
