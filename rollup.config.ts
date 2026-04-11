import {defineConfig} from 'rollup';
import copy from 'rollup-plugin-copy';
import {applyPatch} from 'diff';
import {readFileSync} from "fs";
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { NodePackageImporter } from 'sass';
import sassRollupPlugin from 'rollup-plugin-sass';
import resolve from '@rollup/plugin-node-resolve'
// @ts-ignore — no type declarations available
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const isDev = process.env.ROLLUP_WATCH === 'true';

// prefer patch files in case the theme vendor releases an update
function applyPatches(patchfile: Buffer, filename: string): any {
  const originalFile =  filename.replace('.patch', '')
  const originalFileName = `themes/onflow/${originalFile}`
  const originalContents = readFileSync(originalFileName, 'utf-8');
  return applyPatch(originalContents, patchfile.toString())
}

function renamePatch(name: string, extension: string, fullPath: string): string {
  return name
}

export default defineConfig([
    // javascript
    {
      input: 'src/js/custom.ts',
      output: {
        dir: 'dist',
        sourcemap: true,
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
      plugins: [
        resolve(),
        typescript({ tsconfig: 'tsconfig.json' }),
        // terser(), // uncomment for prod
        ...(isDev ? [
          serve({
            contentBase: ['dist', 'test'],
            port: 3000,
            open: false,
          }),
          livereload({ watch: 'src' }),
        ] : []),
        copy({
          targets: [
            // Copy pre-built stuff in the theme package, no need to re-build
            { src: 'themes/onflow/assets/built', dest: 'dist' },
            { src: 'themes/onflow/assets/vendors', dest: 'dist' },
            { src: 'themes/onflow/locales', dest: 'dist' },
            { src: 'themes/onflow/partials', dest: 'dist' },
            { src: 'themes/onflow/*.hbs', dest: 'dist' },
            { src: 'themes/onflow/routes.yaml', dest: 'dist' },
            { src: 'patches/onflow/**', dest: 'dist', transform: applyPatches, rename: renamePatch },

            // our custom images
            { src: 'src/img', dest: 'dist' },
          ]
      })
    ]
  },

  // css
  {
    input: "src/css/index.scss",
    output: { file: 'dist/custom' },
    plugins: [
      livereload({ watch: 'src' }),
      sassRollupPlugin({
        api: 'modern',
        output: true,
        options: {
          sourceMapIncludeSources: true,
          importers: [new NodePackageImporter()],
        }
      }),
    ]
  }
]);
