var webpack = require('webpack');
const plugins = process.env.NODE_ENV === 'development' ? [
        new webpack.ProvidePlugin({
          Promise: 'imports?this=>global!exports?global.Promise!es6-promise',
          'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
]: [
        new webpack.ProvidePlugin({
          Promise: 'imports?this=>global!exports?global.Promise!es6-promise',
          'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
    new webpack.optimize.UglifyJsPlugin({
     //  sourceMap: false,
      mangle: false
    })
];
module.exports = {
    entry: {
      //IABGPageAddin : './IABGPageAddin.js',
      //MostPopularItems: './MostPopularItems.js',
      //FOBPriceForm: './FOB_Price/Form.js',
      //FOBPriceListView: './FOB_Price/ListView.js',
      //FOBPriceStartWorkflow: './FOB_Price/StartWorkflow.js',
      //FOBPriceTaskForm: './FOB_Price/TaskForm.js',
      UpdateFOBListFromExcel:'./FOB_Price/app/index.js',
      //FOBPriceEditForm: './FOB_Price/EditForm.js'
    },
    output: {
        filename: "./build/[name].js"
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js']
    },
    devtool: 'source-map',
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
              plugins: ['transform-runtime'],
              presets: ['react', 'es2015', 'stage-0']
            },
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }]
    },
    devServer: {
        contentBase: './',
    },
    plugins: plugins,
};
