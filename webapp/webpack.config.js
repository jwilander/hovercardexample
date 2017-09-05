const path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        filename: 'dist/hovercardexample_bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)?$/,
                loader: 'babel-loader',
                exclude: /(node_modules|non_npm_dependencies)/,
                query: {
                    presets: [
                        'react',
                        ['es2015', {modules: false}],
                        'stage-0'
                    ],
                    plugins: ['transform-runtime']
                }
            }
        ]
    },
    resolve: {
        modules: ['node_modules', path.resolve('./')],
        extensions: ['.jsx', '.js']
    }
};
