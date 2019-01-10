const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const plugins = [new HtmlWebpackPlugin({
    template: 'client/index.html',
    filename: 'index.html',
    inject: 'body'
})];

module.exports = (env) => {
    // makes plugin work only in production env
    if (env === 'production') {
        plugins.push(
            new OptimizeJsPlugin({
                sourceMap: false
            })
        )
    };

    const environment = env || 'production';

    return {
        mode: environment,
        entry: './client/index.js',
        output: {
            path: path.resolve(__dirname, 'public'),
            filename: 'app.bundle.js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        query: {
                            plugins: env !== 'production' ? [
                                'react-hot-loader/babel',
                                'transform-class-properties'
                            ] : []
                        }
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        { loader: 'style-loader'},
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true
                            }
                        }
                    ]
                }
            ]
        },
        plugins: plugins,
        devServer: {
            proxy: {
                '/socket.io': {
                    target: 'http://localhost:4000',
                    ws: true
                }
            }
        }
    }
};