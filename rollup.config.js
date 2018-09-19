import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import {uglify} from 'rollup-plugin-uglify';

export default [
  {
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
  },
  {
    input: 'src/index.js',
    output: {
      exports: 'named',
      file: 'dist/unchanged.min.js',
      format: 'umd',
      name: 'unchanged',
    },
    plugins: [
      resolve({
        main: true,
        module: true,
      }),
      babel({
        exclude: 'node_modules/**',
      }),
      uglify(),
    ],
  },
];
