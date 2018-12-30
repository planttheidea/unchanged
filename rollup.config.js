import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import {uglify} from 'rollup-plugin-uglify';

import pkg from './package.json';

const DEV_CONFIG = {
  input: 'src/index.js',
  output: {
    exports: 'named',
    file: 'dist/unchanged.js',
    format: 'umd',
    name: 'unchanged',
    sourcemap: true,
  },
  plugins: [
    resolve({
      main: true,
      module: true,
    }),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};

export default [
  DEV_CONFIG,
  {
    ...DEV_CONFIG,
    output: {
      ...DEV_CONFIG.output,
      file: 'dist/unchanged.min.js',
      sourcemap: false,
    },
    plugins: [...DEV_CONFIG.plugins, uglify()],
  },
];
